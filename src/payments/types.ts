/**
 * Payment types for Spore Agent marketplace.
 * Stripe Connect: task posters pay, agents receive 85%, platform keeps 15%.
 */

export interface ConnectedAccount {
  agent_id: string;
  stripe_account_id: string;
  onboarding_complete: boolean;
  created_at: string;
}

export interface PaymentIntent {
  id: string;
  task_id: string;
  poster_id: string;
  agent_id: string;
  amount_cents: number;
  currency: string;
  stripe_payment_intent_id: string;
  status: PaymentStatus;
  created_at: string;
}

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded";

export interface TaskPaymentResult {
  task_id: string;
  payment_intent_id: string;
  total_amount_cents: number;
  agent_payout_cents: number;
  platform_fee_cents: number;
  transfer_id: string;
  status: "completed" | "failed";
  error?: string;
}

export interface PayoutResult {
  agent_id: string;
  stripe_account_id: string;
  payout_id: string;
  amount_cents: number;
  arrival_date: string;
  status: string;
}

export interface AccountBalance {
  agent_id: string;
  stripe_account_id: string;
  available: BalanceAmount[];
  pending: BalanceAmount[];
}

export interface BalanceAmount {
  amount_cents: number;
  currency: string;
}

/** Platform fee percentage (0-100) */
export const PLATFORM_FEE_PERCENT = 15;
