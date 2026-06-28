import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageSquare, Trash, UploadSimple, VideoCamera, WarningCircle, X } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ChaosButton } from '@/components/ui/chaos';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { TrackerQuest } from '@/data/questme';
import { uploadProofMedia } from '@/services/proof-upload.service';

const MAX_PROOF_ASSETS = 4;
const MAX_PROOF_FILE_SIZE_BYTES = 10 * 1024 * 1024;

type SubmitStatus = 'idle' | 'uploading' | 'uploaded';

type SubmitProofModalProps = {
  onClose: () => void;
  quest: TrackerQuest | null;
};

export function SubmitProofModal({ onClose, quest }: SubmitProofModalProps) {
  const [assets, setAssets] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const canSubmit = assets.length > 0 && status !== 'uploading';

  useEffect(() => {
    setAssets([]);
    setMessage('');
    setStatus('idle');
  }, [quest?.id]);

  const close = () => {
    if (status === 'uploading') return;
    onClose();
  };

  const pickMedia = async () => {
    if (assets.length >= MAX_PROOF_ASSETS) {
      setMessage(`Можна додати максимум ${MAX_PROOF_ASSETS} медіафайли.`);
      return;
    }

    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      setMessage('Надайте доступ до фото та відео, щоб завантажити доказ виконання.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ['images', 'videos'],
      orderedSelection: true,
      quality: 0.86,
      selectionLimit: Math.max(1, MAX_PROOF_ASSETS - assets.length),
      videoMaxDuration: 90,
    });

    if (!result.canceled) {
      appendAssets(result.assets);
    }
  };

  const captureMedia = async () => {
    if (assets.length >= MAX_PROOF_ASSETS) {
      setMessage(`Можна додати максимум ${MAX_PROOF_ASSETS} медіафайли.`);
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      setMessage('Надайте доступ до камери, щоб зняти фото або відеодоказ.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.86,
      videoMaxDuration: 90,
    });

    if (!result.canceled) {
      appendAssets(result.assets);
    }
  };

  const appendAssets = (pickedAssets: ImagePicker.ImagePickerAsset[]) => {
    const mediaAssets = pickedAssets.filter((asset) => asset.type === 'image' || asset.type === 'video');
    const acceptedAssets = mediaAssets.filter((asset) => !asset.fileSize || asset.fileSize <= MAX_PROOF_FILE_SIZE_BYTES);
    const rejectedCount = pickedAssets.length - acceptedAssets.length;

    setAssets((currentAssets) => {
      const knownUris = new Set(currentAssets.map((asset) => asset.uri));
      const uniqueAssets = acceptedAssets.filter((asset) => !knownUris.has(asset.uri));
      return [...currentAssets, ...uniqueAssets].slice(0, MAX_PROOF_ASSETS);
    });

    if (rejectedCount > 0) {
      setMessage('Частину файлів не додано: потрібні тільки фото або відео до 10 МБ.');
    } else if (acceptedAssets.length > 0) {
      setMessage('Медіадоказ додано. Текстові відповіді тут не приймаються.');
    }
  };

  const removeAsset = (uri: string) => {
    setAssets((currentAssets) => currentAssets.filter((asset) => asset.uri !== uri));
    setMessage('');
  };

  const submitProof = async () => {
    if (!quest || !assets.length) {
      setMessage('Додайте фото або відео. Текстовий доказ не можна відправити на перевірку.');
      return;
    }

    setStatus('uploading');
    setMessage('Завантажуємо доказ на перевірку...');

    try {
      await uploadProofMedia({ assets, questId: quest.id });
      setStatus('uploaded');
      setMessage('Доказ відправлено на перевірку. Автор зможе підтвердити виконання.');
      setTimeout(onClose, 900);
    } catch (error) {
      setStatus('idle');
      setMessage(error instanceof Error ? error.message : 'Не вдалося завантажити доказ.');
    }
  };

  return (
    <Modal animationType="slide" transparent visible={Boolean(quest)} onRequestClose={close}>
      <View style={styles.modalShade}>
        <View style={styles.sheet}>
          <View style={styles.sheetTop}>
            <View style={styles.titleBlock}>
              <Text style={styles.sheetTitle}>Доказ виконання</Text>
              <Text style={styles.sheetText}>{quest?.title}</Text>
            </View>
            <Pressable accessibilityRole="button" disabled={status === 'uploading'} onPress={close} style={styles.close}>
              <X color={questColors.textPrimary} size={20} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            <View style={styles.uploadBox}>
              <UploadSimple color={questColors.acid} size={30} weight="bold" />
              <Text style={styles.uploadTitle}>Тільки фото або відео</Text>
              <Text style={styles.uploadText}>
                Текстові докази вимкнені. Завантажте медіа, щоб автор міг перевірити, чи завдання виконано.
              </Text>
              <View style={styles.mediaActions}>
                <ChaosButton
                  disabled={status === 'uploading'}
                  icon={<ImageSquare color={questColors.textPrimary} size={18} weight="bold" />}
                  label="Галерея"
                  onPress={pickMedia}
                  style={styles.mediaAction}
                  variant="outline"
                />
                <ChaosButton
                  disabled={status === 'uploading'}
                  icon={<Camera color={questColors.void} size={18} weight="bold" />}
                  label="Камера"
                  onPress={captureMedia}
                  style={styles.mediaAction}
                />
              </View>
            </View>

            {assets.length > 0 ? (
              <View style={styles.assetList}>
                {assets.map((asset) => (
                  <ProofAssetCard key={asset.uri} asset={asset} disabled={status === 'uploading'} onRemove={() => removeAsset(asset.uri)} />
                ))}
              </View>
            ) : null}

            {message ? (
              <View style={[styles.feedback, status === 'uploaded' && styles.successFeedback]}>
                <WarningCircle color={status === 'uploaded' ? questColors.success : questColors.warning} size={18} weight="bold" />
                <Text style={styles.feedbackText}>{message}</Text>
              </View>
            ) : null}
          </ScrollView>

          <ChaosButton
            disabled={!canSubmit}
            label={status === 'uploading' ? 'Завантажуємо...' : 'Відправити на перевірку'}
            onPress={submitProof}
          />
        </View>
      </View>
    </Modal>
  );
}

function ProofAssetCard({
  asset,
  disabled,
  onRemove,
}: {
  asset: ImagePicker.ImagePickerAsset;
  disabled: boolean;
  onRemove: () => void;
}) {
  const isVideo = asset.type === 'video';

  return (
    <View style={styles.assetCard}>
      <View style={styles.assetPreview}>
        {isVideo ? (
          <View style={styles.videoPreview}>
            <VideoCamera color={questColors.acid} size={24} weight="fill" />
          </View>
        ) : (
          <Image contentFit="cover" source={{ uri: asset.uri }} style={styles.assetImage} />
        )}
      </View>
      <View style={styles.assetCopy}>
        <Text numberOfLines={1} style={styles.assetTitle}>
          {asset.fileName ?? (isVideo ? 'Відеодоказ' : 'Фотодоказ')}
        </Text>
        <Text style={styles.assetMeta}>
          {isVideo ? 'Відео' : 'Фото'} · {formatFileSize(asset.fileSize)}
          {isVideo && asset.duration ? ` · ${formatDuration(asset.duration)}` : ''}
        </Text>
      </View>
      <Pressable accessibilityRole="button" disabled={disabled} onPress={onRemove} style={styles.removeButton}>
        <Trash color={questColors.danger} size={18} weight="bold" />
      </Pressable>
    </View>
  );
}

async function requestMediaLibraryPermission() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return permission.granted;
}

async function requestCameraPermission() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  return permission.granted;
}

function formatFileSize(size?: number) {
  if (!size) return 'розмір невідомий';
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} КБ`;
  return `${(size / 1024 / 1024).toFixed(1)} МБ`;
}

function formatDuration(durationMs: number) {
  const seconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${minutes}:${restSeconds.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  assetCard: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  assetCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  assetImage: {
    height: '100%',
    width: '100%',
  },
  assetList: {
    gap: spacing.sm,
  },
  assetMeta: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  assetPreview: {
    backgroundColor: questColors.void,
    borderRadius: radii.xs,
    height: 58,
    overflow: 'hidden',
    width: 58,
  },
  assetTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  close: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  feedback: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 209, 102, 0.1)',
    borderColor: 'rgba(255, 209, 102, 0.28)',
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  feedbackText: {
    ...typography.caption,
    color: questColors.textPrimary,
    flex: 1,
  },
  mediaAction: {
    flex: 1,
  },
  mediaActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  modalShade: {
    backgroundColor: 'rgba(10,10,15,0.74)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  removeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 95, 0.1)',
    borderRadius: radii.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  sheet: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.lg,
    maxHeight: '88%',
    padding: spacing.lg,
  },
  sheetContent: {
    gap: spacing.lg,
    paddingBottom: spacing.xs,
  },
  sheetText: {
    ...typography.body,
    color: questColors.textSecondary,
  },
  sheetTitle: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
  sheetTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  successFeedback: {
    backgroundColor: 'rgba(36, 209, 139, 0.12)',
    borderColor: 'rgba(36, 209, 139, 0.32)',
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  uploadBox: {
    alignItems: 'center',
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  uploadText: {
    ...typography.caption,
    color: questColors.textSecondary,
    textAlign: 'center',
  },
  uploadTitle: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  videoPreview: {
    alignItems: 'center',
    backgroundColor: 'rgba(196, 255, 0, 0.08)',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
