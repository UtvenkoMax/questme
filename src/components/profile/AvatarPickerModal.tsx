import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Camera, DiceFive, ImageSquare, X } from "phosphor-react-native";
import { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { ChaosButton } from "@/components/ui/chaos";
import { avatarPhotoIds, avatarPhotoSources } from "@/constants/avatarPhotos";
import { questColors } from "@/constants/colors";
import { radii, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { updateUserAvatar, type UserProfile } from "@/services/auth-service";
import {
    createCustomAvatarChoice,
    createGeneratedAvatarChoice,
    createRandomEmojiAvatarChoice,
    type AvatarChoice,
} from "@/services/avatar-service";

const MAX_CUSTOM_AVATAR_BYTES = 6 * 1024 * 1024;

type AvatarPickerModalProps = {
  onClose: () => void;
  onProfileChange: (profile: UserProfile) => void;
  profile: UserProfile | null;
  visible: boolean;
};

export function AvatarPickerModal({
  onClose,
  onProfileChange,
  profile,
  visible,
}: AvatarPickerModalProps) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (saving) return;
    setMessage("");
    onClose();
  };

  const saveChoice = async (choice: AvatarChoice) => {
    if (!profile || saving) return;

    setSaving(true);
    setMessage("");
    try {
      const nextProfile = await updateUserAvatar(choice);
      onProfileChange(nextProfile);
      setMessage("");
      onClose();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Не вдалося оновити аватар.",
      );
    } finally {
      setSaving(false);
    }
  };

  const pickCustomPhoto = async () => {
    if (!profile || saving) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage("Надайте доступ до фото, щоб поставити власну аватарку.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: Platform.OS === "web",
      mediaTypes: ["images"],
      quality: 0.82,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset) return;

    if (asset.fileSize && asset.fileSize > MAX_CUSTOM_AVATAR_BYTES) {
      setMessage("Фото завелике. Оберіть зображення до 6 МБ.");
      return;
    }

    try {
      const choice = await createCustomAvatarChoice(asset, profile.id);
      await saveChoice(choice);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Не вдалося підготувати фото.",
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={close}
    >
      <View style={styles.modalShade}>
        <View style={styles.sheet}>
          <View style={styles.sheetTop}>
            <View style={styles.titleBlock}>
              <Text style={styles.sheetTitle}>Аватарка</Text>
              <Text style={styles.sheetText}>
                {" "}
                одне зі згенерованих фото, random смайлик або власне фото.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={close}
              style={styles.close}
            >
              <X color={questColors.textPrimary} size={20} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.generatedGrid}>
              {avatarPhotoIds.map((avatarId) => {
                const selected =
                  profile?.avatarKind === "generated" &&
                  profile.avatarId === avatarId;
                return (
                  <Pressable
                    accessibilityRole="button"
                    disabled={saving}
                    key={avatarId}
                    onPress={() =>
                      saveChoice(createGeneratedAvatarChoice(avatarId))
                    }
                    style={[
                      styles.avatarOption,
                      selected && styles.avatarOptionSelected,
                    ]}
                  >
                    <Image
                      contentFit="cover"
                      source={avatarPhotoSources[avatarId]}
                      style={styles.avatarImage}
                    />
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.choiceRow}>
              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={() => saveChoice(createRandomEmojiAvatarChoice())}
                style={[
                  styles.wideChoice,
                  profile?.avatarKind === "emoji" && styles.wideChoiceSelected,
                ]}
              >
                <View style={styles.emojiPreview}>
                  <Text style={styles.emojiText}>
                    {profile?.avatarKind === "emoji"
                      ? profile.avatarEmoji
                      : "🙂"}
                  </Text>
                </View>
                <View style={styles.choiceCopy}>
                  <Text style={styles.choiceTitle}>Рандомний смайлик</Text>
                  <Text style={styles.choiceText}>
                    Застосунок сам вибере emoji-аватар.
                  </Text>
                </View>
                <DiceFive color={questColors.acid} size={22} weight="bold" />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={pickCustomPhoto}
                style={[
                  styles.wideChoice,
                  profile?.avatarKind === "custom" && styles.wideChoiceSelected,
                ]}
              >
                <View style={styles.customPreview}>
                  {profile?.avatarKind === "custom" && profile.avatarUri ? (
                    <Image
                      contentFit="cover"
                      source={{ uri: profile.avatarUri }}
                      style={styles.customImage}
                    />
                  ) : (
                    <ImageSquare
                      color={questColors.textPrimary}
                      size={24}
                      weight="bold"
                    />
                  )}
                </View>
                <View style={styles.choiceCopy}>
                  <Text style={styles.choiceTitle}>Власне фото</Text>
                  <Text style={styles.choiceText}>
                    Вибери квадратне фото з галереї.
                  </Text>
                </View>
                <Camera color={questColors.ember} size={22} weight="bold" />
              </Pressable>
            </View>

            {message ? <Text style={styles.message}>{message}</Text> : null}
          </ScrollView>

          <ChaosButton
            disabled={saving}
            label={saving ? "Зберігаємо..." : "Закрити"}
            onPress={close}
            variant="outline"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  avatarImage: {
    height: "100%",
    width: "100%",
  },
  avatarOption: {
    aspectRatio: 1,
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.pill,
    borderWidth: 2,
    flexBasis: "18%",
    flexGrow: 1,
    maxWidth: 72,
    minWidth: 58,
    overflow: "hidden",
  },
  avatarOptionSelected: {
    borderColor: questColors.acid,
  },
  choiceCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  choiceRow: {
    gap: spacing.sm,
  },
  choiceText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  choiceTitle: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  close: {
    alignItems: "center",
    backgroundColor: questColors.surfaceUp,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xs,
  },
  customImage: {
    height: "100%",
    width: "100%",
  },
  customPreview: {
    alignItems: "center",
    backgroundColor: questColors.surfaceUp,
    borderRadius: radii.pill,
    height: 46,
    justifyContent: "center",
    overflow: "hidden",
    width: 46,
  },
  emojiPreview: {
    alignItems: "center",
    backgroundColor: "rgba(196,255,0,0.12)",
    borderRadius: radii.pill,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  emojiText: {
    fontSize: 24,
  },
  generatedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  message: {
    ...typography.caption,
    color: questColors.warning,
  },
  modalShade: {
    backgroundColor: "rgba(10,10,15,0.74)",
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.lg,
    maxHeight: "88%",
    padding: spacing.lg,
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
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  wideChoice: {
    alignItems: "center",
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
  },
  wideChoiceSelected: {
    borderColor: questColors.acid,
  },
});
