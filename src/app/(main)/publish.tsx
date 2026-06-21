import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    type LayoutChangeEvent,
} from "react-native";

import { QuestPreviewCard } from "@/components/quest/QuestPreviewCard";
import { ChaosBadge, ChaosButton, SectionKicker } from "@/components/ui/chaos";
import { Screen } from "@/components/ui/screen";
import { Notice } from "@/components/ui/status";
import { questColors } from "@/constants/colors";
import { radii, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import {
    QUEST_TEXT_WORD_LIMIT,
    createQuest,
    getQuestTextWordCount,
    limitQuestTextWords,
} from "@/services/quest-service";
import {
    PREMIUM_QUEST_PRICE,
    calculatePlatformFee,
    selectBalance,
    selectFormattedBalance,
    useWalletStore,
} from "@/store";

const examples = [
  "Зніми відео, як ти 30 секунд говориш голосом NPC",
  "Придумай найсмішніший слоган для мого фото",
  "Зроби мем з кадру, де я дивлюсь на чек",
  "Зніми реакцію друга на дивний комплімент",
];

const proofTypes = ["Відео", "Фото"];
const deadlines = ["6 год", "12 год", "24 год", "2 дні", "7 днів"];

export default function CreateQuestScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [task, setTask] = useState("");
  const [proofType, setProofType] = useState("Відео");
  const [reward, setReward] = useState(50);
  const [deadline, setDeadline] = useState("24 год");
  const [isPremium, setIsPremium] = useState(false);
  const [message, setMessage] = useState("");
  const walletBalance = useWalletStore(selectBalance);
  const formattedBalance = useWalletStore(selectFormattedBalance);
  const reserveQuestReward = useWalletStore((state) => state.reserveQuestReward);

  const placeholder = useMemo(
    () => examples[Math.floor(Math.random() * examples.length)],
    [],
  );
  const taskWordCount = useMemo(() => getQuestTextWordCount(task), [task]);
  const canContinue = step === 0 ? task.trim().length >= 10 : true;
  const platformFee = calculatePlatformFee(reward);
  const premiumFee = isPremium ? PREMIUM_QUEST_PRICE : 0;
  const totalToReserve = reward + platformFee + premiumFee;
  const canAffordQuest = walletBalance >= totalToReserve;

  const updateTask = (value: string) => {
    const limitedTask = limitQuestTextWords(value);
    setTask(limitedTask);

    if (getQuestTextWordCount(value) > QUEST_TEXT_WORD_LIMIT) {
      setMessage(
        `Текст квесту може містити максимум ${QUEST_TEXT_WORD_LIMIT} слів.`,
      );
      return;
    }

    if (message) {
      setMessage("");
    }
  };

  const next = () => {
    if (!canContinue) {
      setMessage("Додайте конкретний текст квесту мінімум на 10 символів.");
      return;
    }
    setMessage("");
    setStep((value) => Math.min(value + 1, 4));
  };

  const back = () => {
  setMessage("");

  if (step === 0) {
    router.push("/");
    return;
  }

  setStep((value) => Math.max(value - 1, 0));
};

  const publish = async () => {
    const reserveResult = reserveQuestReward(task.trim(), reward, {
      premium: isPremium,
    });

    if (!reserveResult.ok) {
      setMessage(reserveResult.message);
      return;
    }

    await createQuest(
      task.trim(),
      `${proofType} · ${reward} грн · ${deadline} · escrow ${reserveResult.escrowId}${isPremium ? " · premium" : ""}`,
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    setMessage("Квест опубліковано. Винагорода заблокована в escrow до підтвердження виконання.");
    setTimeout(() => router.push("/tasks" as never), 480);
  };

  return (
    <Screen contentStyle={styles.content} keyboard>
      <SectionKicker eyebrow={`Крок ${step + 1}/5`} title="Квест-будівник" />
      <View style={styles.progress}>
        {Array.from({ length: 5 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= step && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.card}>
        {step === 0 ? (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Текст квесту</Text>
            <TextInput
              multiline
              onChangeText={updateTask}
              placeholder={placeholder}
              placeholderTextColor={questColors.textSecondary}
              selectionColor={questColors.acid}
              style={styles.textarea}
              value={task}
            />
            <Text style={styles.counter}>
              {taskWordCount}/{QUEST_TEXT_WORD_LIMIT} слів
            </Text>
          </View>
        ) : null}

        {step === 1 ? (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Тип виконання</Text>
            <View style={styles.optionGrid}>
              {proofTypes.map((type) => (
                <Option
                  key={type}
                  active={proofType === type}
                  label={type}
                  onPress={() => setProofType(type)}
                />
              ))}
            </View>
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Сума оплати</Text>
            <Text style={styles.reward}>{reward} грн</Text>
            <RewardSlider value={reward} onChange={setReward} />
            <View style={styles.quickAmounts}>
              {[25, 50, 100, 250].map((amount) => (
                <Option
                  key={amount}
                  active={reward === amount}
                  label={`${amount}`}
                  onPress={() => setReward(amount)}
                  compact
                />
              ))}
            </View>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: isPremium }}
              onPress={() => setIsPremium((value) => !value)}
              style={[styles.premiumCard, isPremium && styles.premiumCardActive]}
            >
              <View style={styles.premiumCopy}>
                <Text style={styles.premiumTitle}>Premium-квест</Text>
                <Text style={styles.premiumText}>
                  Бейдж у стрічці, пріоритет у видачі та окрема транзакція.
                </Text>
              </View>
              <ChaosBadge tone={isPremium ? "acid" : "muted"}>
                {isPremium ? "увімкнено" : `+${PREMIUM_QUEST_PRICE} грн`}
              </ChaosBadge>
            </Pressable>
          </View>
        ) : null}

        {step === 3 ? (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Дедлайн</Text>
            <View style={styles.deadlineWheel}>
              {deadlines.map((item) => (
                <Option
                  key={item}
                  active={deadline === item}
                  label={item}
                  onPress={() => setDeadline(item)}
                />
              ))}
            </View>
          </View>
        ) : null}

        {step === 4 ? (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Перевірка</Text>
            <QuestPreviewCard
              deadline={deadline}
              disabled={!canAffordQuest}
              proofType={proofType}
              publishLabel={canAffordQuest ? "Опублікувати" : "Недостатньо коштів"}
              reward={reward}
              title={task}
              onPublish={publish}
            />
            <View style={styles.paymentSummary}>
              <Text style={styles.summaryTitle}>Safe Pay розрахунок</Text>
              <SummaryRow label="Доступно" value={formattedBalance} />
              <SummaryRow label="Винагорода в escrow" value={`${reward} грн`} />
              <SummaryRow label="Комісія платформи 8%" value={`${platformFee} грн`} tone="ember" />
              <SummaryRow label="Premium-квест" value={premiumFee ? `${premiumFee} грн` : "0 грн"} />
              <View style={styles.summaryDivider} />
              <SummaryRow label="Буде списано" value={`${totalToReserve} грн`} tone="acid" strong />
              {!canAffordQuest ? (
                <Text style={styles.summaryError}>
                  Поповніть гаманець ще на {totalToReserve - walletBalance} грн або зменште винагороду.
                </Text>
              ) : null}
            </View>
            <View style={styles.paymentNote}>
              <ChaosBadge tone="ember">Escrow + commission</ChaosBadge>
              <Text style={styles.noteText}>
                Після публікації винагорода блокується, premium і комісія списуються одразу.
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      {message ? (
        <Notice tone={message.includes("опубліковано") ? "success" : "danger"}>
          {message}
        </Notice>
      ) : null}

      <View style={styles.actions}>
        <ChaosButton
          label="Назад"
          onPress={back}
          style={styles.action}
          variant="outline"
        />
        {step < 4 ? (
          <ChaosButton label="Далі" onPress={next} style={styles.action} />
        ) : null}
      </View>
    </Screen>
  );
}

function SummaryRow({
  label,
  strong = false,
  tone,
  value,
}: {
  label: string;
  strong?: boolean;
  tone?: "acid" | "ember";
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, strong && styles.summaryLabelStrong]}>{label}</Text>
      <Text
        style={[
          styles.summaryValue,
          strong && styles.summaryValueStrong,
          tone === "acid" ? styles.summaryValueAcid : tone === "ember" ? styles.summaryValueEmber : null,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function Option({
  active,
  compact = false,
  label,
  onPress,
}: {
  active: boolean;
  compact?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        compact && styles.optionCompact,
        active && styles.optionActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.optionText, active && styles.optionTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function RewardSlider({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const startValueRef = useRef(value);

  const MIN = 25;
  const MAX = 250;
  const THUMB_SIZE = 24;

  const clampValue = (nextValue: number) =>
    Math.min(MAX, Math.max(MIN, Math.round(nextValue)));

  const updateFromDelta = (dx: number) => {
    const currentWidth = widthRef.current;
    if (currentWidth <= 0) return;

    const startPercent = (startValueRef.current - MIN) / (MAX - MIN);
    const startX = startPercent * currentWidth;
    const nextX = Math.max(0, Math.min(startX + dx, currentWidth));

    const percent = nextX / currentWidth;
    const nextValue = clampValue(MIN + percent * (MAX - MIN));

    if (nextValue !== value) {
      onChange(nextValue);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 6 && Math.abs(gesture.dx) > Math.abs(gesture.dy),

      onPanResponderGrant: () => {
        startValueRef.current = value;
      },

      onPanResponderMove: (_, gesture) => {
        updateFromDelta(gesture.dx);
      },

      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {},
      onPanResponderRelease: () => {},
      onShouldBlockNativeResponder: () => true,
    }),
  ).current;

  const usableWidth = Math.max(width - THUMB_SIZE, 0);
  const percent = width > 0 ? (value - MIN) / (MAX - MIN) : 0;
  const thumbLeft = percent * usableWidth;
  const fillWidth = percent * usableWidth + THUMB_SIZE / 2;

  const handleLayout = (e: LayoutChangeEvent) => {
    const nextWidth = e.nativeEvent.layout.width;
    widthRef.current = nextWidth;
    setWidth(nextWidth);
  };

  return (
    <View
      {...panResponder.panHandlers}
      onLayout={handleLayout}
      style={styles.sliderTrack}
    >
      <View style={[styles.sliderFill, { width: fillWidth }]} />
      <View style={[styles.sliderThumb, { left: thumbLeft }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  action: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  card: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 120,
  },
  counter: {
    ...typography.caption,
    color: questColors.textSecondary,
    textAlign: "right",
  },
  deadlineWheel: {
    gap: spacing.sm,
  },
  noteText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  option: {
    alignItems: "center",
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    flex: 1,
    minHeight: 58,
    justifyContent: "center",
    minWidth: 118,
    padding: spacing.md,
  },
  optionActive: {
    backgroundColor: "rgba(196,255,0,0.14)",
    borderColor: questColors.acid,
  },
  optionCompact: {
    minHeight: 44,
    minWidth: 72,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  optionText: {
    ...typography.label,
    color: questColors.textSecondary,
  },
  optionTextActive: {
    color: questColors.acid,
  },
  paymentNote: {
    gap: spacing.sm,
  },
  paymentSummary: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  premiumCard: {
    alignItems: "center",
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.md,
  },
  premiumCardActive: {
    backgroundColor: "rgba(196,255,0,0.10)",
    borderColor: "rgba(196,255,0,0.44)",
  },
  premiumCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 180,
  },
  premiumText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  premiumTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  pressed: {
    opacity: 0.72,
  },
  progress: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  progressDot: {
    backgroundColor: questColors.border,
    borderRadius: radii.pill,
    flex: 1,
    height: 5,
  },
  progressDotActive: {
    backgroundColor: questColors.acid,
  },
  quickAmounts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  reward: {
    ...typography.display,
    color: questColors.ember,
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: questColors.ember,
    borderRadius: radii.pill,
  },
  sliderThumb: {
    backgroundColor: questColors.acid,
    borderRadius: 12,
    height: 24,
    width: 24,
    position: "absolute",
    top: -8,
  },
  sliderTrack: {
    backgroundColor: "#29293A",
    borderRadius: radii.pill,
    height: 8,
    marginVertical: spacing.md,
    position: "relative",
  },
  step: {
    gap: spacing.lg,
  },
  stepTitle: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
  summaryDivider: {
    backgroundColor: questColors.border,
    height: 1,
  },
  summaryError: {
    ...typography.captionStrong,
    color: questColors.danger,
  },
  summaryLabel: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  summaryLabelStrong: {
    color: questColors.textPrimary,
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  summaryTitle: {
    ...typography.label,
    color: questColors.acid,
    textTransform: "uppercase",
  },
  summaryValue: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
    textAlign: "right",
  },
  summaryValueAcid: {
    color: questColors.acid,
  },
  summaryValueEmber: {
    color: questColors.ember,
  },
  summaryValueStrong: {
    ...typography.subtitle,
  },
  textarea: {
    ...typography.subtitle,
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    color: questColors.textPrimary,
    minHeight: 180,
    padding: spacing.md,
    textAlignVertical: "top",
  },
});
