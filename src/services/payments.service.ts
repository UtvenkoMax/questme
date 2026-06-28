export type PaymentProvider = 'liqpay' | 'monobank';

export type PaymentDraft = {
  amount: number;
  provider: PaymentProvider;
  purpose: string;
  status: 'draft';
};

export async function createPaymentDraft(provider: PaymentProvider, amount: number, purpose: string): Promise<PaymentDraft> {
  return {
    amount,
    provider,
    purpose,
    status: 'draft',
  };
}

export async function createPayoutDraft(provider: PaymentProvider, amount: number): Promise<PaymentDraft> {
  return createPaymentDraft(provider, amount, 'QuestMe wallet payout');
}