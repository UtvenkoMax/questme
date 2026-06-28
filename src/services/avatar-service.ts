import * as FileSystem from 'expo-file-system';
import type * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

import {
  getRandomAvatarEmoji,
  getRandomAvatarPhotoId,
  isAvatarPhotoId,
  type AvatarEmoji,
  type AvatarPhotoId,
} from '@/constants/avatarPhotos';

export type AvatarKind = 'generated' | 'emoji' | 'custom';

export type AvatarChoice = {
  avatarEmoji?: AvatarEmoji;
  avatarId?: AvatarPhotoId;
  avatarKind: AvatarKind;
  avatarUri?: string;
};

export function createGeneratedAvatarChoice(avatarId: AvatarPhotoId): AvatarChoice {
  return {
    avatarId,
    avatarKind: 'generated',
  };
}

export function createRandomGeneratedAvatarChoice(): AvatarChoice {
  return createGeneratedAvatarChoice(getRandomAvatarPhotoId());
}

export function createRandomEmojiAvatarChoice(): AvatarChoice {
  return {
    avatarEmoji: getRandomAvatarEmoji(),
    avatarKind: 'emoji',
  };
}

export function normalizeAvatarChoice(profile: Partial<AvatarChoice> & { email?: string; id?: string }): AvatarChoice {
  if (profile.avatarKind === 'custom' && profile.avatarUri) {
    return {
      avatarKind: 'custom',
      avatarUri: profile.avatarUri,
    };
  }

  if (profile.avatarKind === 'emoji' && profile.avatarEmoji) {
    return {
      avatarEmoji: profile.avatarEmoji as AvatarEmoji,
      avatarKind: 'emoji',
    };
  }

  if (isAvatarPhotoId(profile.avatarId)) {
    return {
      avatarId: profile.avatarId,
      avatarKind: 'generated',
    };
  }

  return createRandomGeneratedAvatarChoice();
}

export async function createCustomAvatarChoice(asset: ImagePicker.ImagePickerAsset, accountId: string): Promise<AvatarChoice> {
  if (Platform.OS === 'web') {
    const dataUri = await getWebAvatarDataUri(asset);
    return {
      avatarKind: 'custom',
      avatarUri: dataUri,
    };
  }

  const avatarDirectory = new FileSystem.Directory(FileSystem.Paths.document, 'avatars');
  avatarDirectory.create({ idempotent: true, intermediates: true });

  const extension = getAvatarExtension(asset.fileName, asset.mimeType);
  const source = new FileSystem.File(asset.uri);
  const destination = new FileSystem.File(avatarDirectory, `${sanitizeAccountId(accountId)}-${Date.now()}.${extension}`);

  source.copy(destination);

  return {
    avatarKind: 'custom',
    avatarUri: destination.uri,
  };
}

async function getWebAvatarDataUri(asset: ImagePicker.ImagePickerAsset) {
  if (asset.base64) {
    return `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`;
  }

  if (asset.uri.startsWith('data:')) {
    return asset.uri;
  }

  return asset.uri;
}

function getAvatarExtension(fileName?: string | null, mimeType?: string | null) {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  if (extension && /^[a-z0-9]{2,5}$/.test(extension)) return extension;

  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/heic') return 'heic';
  return 'jpg';
}

function sanitizeAccountId(accountId: string) {
  return accountId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 48) || 'account';
}
