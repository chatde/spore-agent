/**
 * Stripe Connect integration for Spore Agent marketplace.
 *
 * Flow:
 * 1. Agent operator calls createConnectedAccount() to onboard
 * 2. Task poster calls createPaymentIntent() when a bid is accepted
 * 3. On task completion + approval, processTaskPayment() transfers funds
 *    - 85% to agent's connected account
 *    - 15% platform fee (retained in platform account)
 * 4. Agent can createPayout() to withdraw to their bank
 */

import Stripe from "stripe";
import { logToDiscord } from "../logging/discord-webhook.js";
import type {
  ConnectedAccount,
  PaymentIntent,
  TaskPaymentResult,
  PayoutResult,
  AccountBalance,
} from "./types.js";

const PLATFORM_FEE = 15; // percent

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your .env file. " +
        "Use a test key (sk_test_...) for development."
    );
  }
  return new Stripe(key);
}

// ---------------------------------------------------------------------------
// 1. Onboard agent operators with Stripe Connect
// ---------------------------------------------------------------------------

export async function createConnectedAccount(
  agentId: string,
  agentName: string,
  email?: string
): Promise<{
  account: ConnectedAccount;
  onboarding_url: string;
}> {
  const stripe = getStripe();

  // Create a Standard connected account
  const account = await stripe.accounts.create({
    type: "express",
    metadata: { agent_id: agentId },
    ...(email ? { email } : {}),
    business_profile: {
      name: agentName,
      product_description: "AI agent services on Spore Agent marketplace",
    },
    capabilities: {
      transfers: { requested: true },
    },
  });

  // Generate onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${getBaseUrl()}/payments/onboarding/refresh?agent_id=${agentId}`,
    return_url: `${getBaseUrl()}/payments/onboarding/complete?agent_id=${agentId}`,
    type: "account_onboarding",
  });

  return {
    account: {
      agent_id: agentId,
      stripe_account_id: account.id,
      onboarding_complete: false,
      created_at: new Date().toISOString(),
    },
    onboarding_url: accountLink.url,
  };
}

/**
 * Check whether an agent's connected account has finished onboarding.
 */
export async function checkOnboardingStatus(
  stripeAccountId: string
): Promise<boolean> {
  const stripe = getStripe();
  const account = await stripe.accounts.retrieve(stripeAccountId);
  return account.charges_enabled && account.payouts_enabled;
}

// ---------------------------------------------------------------------------
// 2. Create a payment intent when a task bid is accepted
// ---------------------------------------------------------------------------

export async function createPaymentIntent(
  taskId: string,
  posterId: string,
  agentStripeAccountId: string,
  amountCents: number,
  currency: string = "usd"
): Promise<PaymentIntent> {
  const stripe = getStripe();

  const platformFeeCents = Math.round(amountCents * (PLATFORM_FEE / 100));

  const intent = await stripe.paymentIntents.create(
    {
      amount: amountCents,
      currency,
      // The platform fee is automatically deducted; the rest goes to the agent
      application_fee_amount: platformFeeCents,
      transfer_data: {
        destination: agentStripeAccountId,
      },
      metadata: {
        task_id: taskId,
        poster_id: posterId,
        platform_fee_percent: String(PLATFORM_FEE),
      },
    },
    {
      idempotencyKey: `task_${taskId}_${Date.now()}`,
    }
  );

  return {
    id: crypto.randomUUID(),
    task_id: taskId,
    poster_id: posterId,
    agent_id: "", // resolved by caller
    amount_cents: amountCents,
    currency,
    stripe_payment_intent_id: intent.id,
    status: "pending",
    created_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 3. Process payment on task completion (transfer funds)
// ---------------------------------------------------------------------------

export async function processTaskPayment(
  stripePaymentIntentId: string,
  agentStripeAccountId: string
): Promise<TaskPaymentResult> {
  const stripe = getStripe();

  try {
    // Retrieve the payment intent to confirm it succeeded
    const intent = await stripe.paymentIntents.retrieve(
      stripePaymentIntentId,
      undefined,
      {
        idempotencyKey: `process_${stripePaymentIntentId}`,
      }
    );

    if (intent.status !== "succeeded") {
      const errorMsg = `Payment intent status is "${intent.status}", expected "succeeded".`;
      logToDiscord("error", "Payment intent failed", {
        payment_intent_id: intent.id,
        task_id: intent.metadata?.task_id,
        status: intent.status,
        error: errorMsg,
      });
      return {
        task_id: (intent.metadata?.task_id as string) ?? "",
        payment_intent_id: intent.id,
        total_amount_cents: intent.amount,
        agent_payout_cents: 0,
        platform_fee_cents: 0,
        transfer_id: "",
        status: "failed",
        error: errorMsg,
      };
    }

    const platformFeeCents = Math.round(intent.amount * (PLATFORM_FEE / 100));
    const agentPayoutCents = intent.amount - platformFeeCents;

    // With transfer_data.destination set at creation, Stripe automatically
    // transfers funds to the connected account minus the application_fee.
    // This function confirms the state and returns the breakdown.

    // Retrieve the latest charge to find the transfer
    const charges = await stripe.charges.list({
      payment_intent: intent.id,
      limit: 1,
    });
    const charge = charges.data[0];
    const transferId =
      typeof charge?.transfer === "string"
        ? charge.transfer
        : charge?.transfer?.id ?? "";

    return {
      task_id: (intent.metadata?.task_id as string) ?? "",
      payment_intent_id: intent.id,
      total_amount_cents: intent.amount,
      agent_payout_cents: agentPayoutCents,
      platform_fee_cents: platformFeeCents,
      transfer_id: transferId,
      status: "completed",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logToDiscord("error", "Payment processing error", {
      payment_intent_id: stripePaymentIntentId,
      agent_account: agentStripeAccountId,
      error: message,
    });
    return {
      task_id: "",
      payment_intent_id: stripePaymentIntentId,
      total_amount_cents: 0,
      agent_payout_cents: 0,
      platform_fee_cents: 0,
      transfer_id: "",
      status: "failed",
      error: message,
    };
  }
}

// ---------------------------------------------------------------------------
// 4. Create a payout (agent withdraws earnings to their bank)
// ---------------------------------------------------------------------------

export async function createPayout(
  agentStripeAccountId: string,
  amountCents: number,
  currency: string = "usd"
): Promise<PayoutResult> {
  const stripe = getStripe();

  try {
    const payout = await stripe.payouts.create(
      {
        amount: amountCents,
        currency,
      },
      {
        stripeAccount: agentStripeAccountId,
      }
    );

    return {
      agent_id: "", // resolved by caller
      stripe_account_id: agentStripeAccountId,
      payout_id: payout.id,
      amount_cents: payout.amount,
      arrival_date: new Date((payout.arrival_date ?? 0) * 1000).toISOString(),
      status: payout.status,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logToDiscord("error", "Payout creation failed", {
      agent_account: agentStripeAccountId,
      amount_cents: amountCents,
      currency,
      error: message,
    });
    throw err;
  }
}

// ---------------------------------------------------------------------------
// 5. Get account balance
// ---------------------------------------------------------------------------

export async function getAccountBalance(
  agentStripeAccountId: string
): Promise<AccountBalance> {
  const stripe = getStripe();

  const balance = await stripe.balance.retrieve({
    stripeAccount: agentStripeAccountId,
  });

  return {
    agent_id: "", // resolved by caller
    stripe_account_id: agentStripeAccountId,
    available: balance.available.map((b) => ({
      amount_cents: b.amount,
      currency: b.currency,
    })),
    pending: balance.pending.map((b) => ({
      amount_cents: b.amount,
      currency: b.currency,
    })),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBaseUrl(): string {
  return process.env.SPORE_BASE_URL ?? "http://localhost:3456";
}
