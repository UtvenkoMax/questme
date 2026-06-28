export const avatarPhotoIds = [
  'avatar-01',
  'avatar-02',
  'avatar-03',
  'avatar-04',
  'avatar-05',
  'avatar-06',
  'avatar-07',
  'avatar-08',
  'avatar-09',
  'avatar-10',
] as const;

export type AvatarPhotoId = (typeof avatarPhotoIds)[number];

export const avatarPhotoSources = {
  'avatar-01': require('../../assets/images/avatars/avatar-01.png'),
  'avatar-02': require('../../assets/images/avatars/avatar-02.png'),
  'avatar-03': require('../../assets/images/avatars/avatar-03.png'),
  'avatar-04': require('../../assets/images/avatars/avatar-04.png'),
  'avatar-05': require('../../assets/images/avatars/avatar-05.png'),
  'avatar-06': require('../../assets/images/avatars/avatar-06.png'),
  'avatar-07': require('../../assets/images/avatars/avatar-07.png'),
  'avatar-08': require('../../assets/images/avatars/avatar-08.png'),
  'avatar-09': require('../../assets/images/avatars/avatar-09.png'),
  'avatar-10': require('../../assets/images/avatars/avatar-10.png'),
} as const satisfies Record<AvatarPhotoId, number>;

export type AvatarPhotoSource = (typeof avatarPhotoSources)[AvatarPhotoId];

export const avatarEmojiOptions = ['🙂', '😎', '🤩', '🥳', '😈', '👾', '🔥', '⚡', '💫', '🎯', '🚀', '🌈'] as const;

export type AvatarEmoji = (typeof avatarEmojiOptions)[number];

export function getRandomAvatarPhotoId(): AvatarPhotoId {
  return avatarPhotoIds[Math.floor(Math.random() * avatarPhotoIds.length)];
}

export function getRandomAvatarEmoji(): AvatarEmoji {
  return avatarEmojiOptions[Math.floor(Math.random() * avatarEmojiOptions.length)];
}

export function getAvatarPhotoIdForAccount(seed: string): AvatarPhotoId {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return avatarPhotoIds[hash % avatarPhotoIds.length];
}

export function getAvatarPhotoSource(avatarId?: string | null): AvatarPhotoSource | undefined {
  if (!isAvatarPhotoId(avatarId)) return undefined;
  return avatarPhotoSources[avatarId];
}

export function isAvatarPhotoId(value?: string | null): value is AvatarPhotoId {
  return Boolean(value && (avatarPhotoIds as readonly string[]).includes(value));
}
