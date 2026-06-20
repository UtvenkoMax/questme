import type * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

const DEFAULT_MEDIA_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8084' : 'http://localhost:8084';
const MEDIA_API_URL = process.env.EXPO_PUBLIC_MEDIA_API_URL ?? DEFAULT_MEDIA_API_URL;

export type ProofUploadResponse = {
  created_at: string;
  filename: string;
  id: string;
  mime_type: string;
  size_bytes: number;
  url: string;
};

export type ProofUploadResult = ProofUploadResponse & {
  localUri: string;
  mediaType: 'image' | 'video';
};

type UploadProofMediaParams = {
  assets: ImagePicker.ImagePickerAsset[];
  questId: string;
};

export async function uploadProofMedia({ assets, questId }: UploadProofMediaParams) {
  if (!assets.length) {
    throw new Error('Додайте фото або відео як доказ виконання.');
  }

  const uploaded = await Promise.all(assets.map((asset) => uploadSingleProofAsset(asset, questId)));
  return uploaded;
}

async function uploadSingleProofAsset(asset: ImagePicker.ImagePickerAsset, questId: string): Promise<ProofUploadResult> {
  const mediaType = asset.type === 'video' ? 'video' : 'image';
  const mimeType = asset.mimeType ?? getFallbackMimeType(mediaType, asset.fileName);
  const fileName = asset.fileName ?? `${questId}-${Date.now()}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;
  const formData = new FormData();

  formData.append('quest_id', questId);
  formData.append('proof_type', mediaType);

  if (Platform.OS === 'web' && asset.file) {
    formData.append('file', asset.file, fileName);
  } else {
    formData.append(
      'file',
      {
        name: fileName,
        type: mimeType,
        uri: asset.uri,
      } as unknown as Blob,
    );
  }

  const response = await fetch(`${MEDIA_API_URL}/api/upload`, {
    body: formData,
    method: 'POST',
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(details || `Не вдалося завантажити доказ (${response.status}).`);
  }

  const payload = (await response.json()) as ProofUploadResponse;
  return {
    ...payload,
    localUri: asset.uri,
    mediaType,
  };
}

function getFallbackMimeType(mediaType: 'image' | 'video', fileName?: string | null) {
  const extension = fileName?.split('.').pop()?.toLowerCase();

  if (mediaType === 'video') {
    if (extension === 'mov') return 'video/quicktime';
    if (extension === 'webm') return 'video/webm';
    return 'video/mp4';
  }

  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'heic') return 'image/heic';
  return 'image/jpeg';
}
