import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { store } from "../store.js";
import {
  createConnectedAccount,
  checkOnboardingStatus,
  createPaymentIntent,
  processTaskPayment,
  createPayout,
  getAccountBalance,
} from "../../payments/stripe-connect.js";
import { PLATFORM_FEE_PERCENT } from "../../payments/types.js";

// In-memory map of agent_id -> stripe_account_id
// In production this would be persisted in the store/DB
const agentStripeAccounts = new Map<string, string>();

function jsonText(obj: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }],
  };
}

function errorText(msg: string) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ error: msg }) }],
    isError: true,
  };
}

export function registerPaymentTools(server: McpServer): void {
  // -----------------------------------------------------------------------
  // Onboard agent to Stripe Connect
  // -----------------------------------------------------------------------
  server.registerTool(
    "spore_payment_onboard",
    {
      title: "Payment Onboarding",
      description:
        "Onboard an agent operator to receive payments via Stripe Connect. " +
        "Returns a URL where the operator completes identity verification.",
      inputSchema: {
        agent_id: z.string().describe("Agent ID to onboard for payments"),
        email: z
          .string()
          
          .optional()
          .describe("Optional email for the Stripe account"),
      },
    },
    async ({ agent_id, email }) => {
      const agent = await store.getAgent(agent_id);
      if (!agent) return errorText("Agent not found. Register first.");

      if (agentStripeAccounts.has(agent_id)) {
        return errorText(
          "Agent already has a connected account. Use spore_payment_balance to check status."
        );
      }

      try {
        const result = await createConnectedAccount(
          agent_id,
          agent.name,
          email
        );
        agentStripeAccounts.set(agent_id, result.account.stripe_account_id);

        return jsonText({
          agent_id,
          stripe_account_id: result.account.stripe_account_id,
          onboarding_url: result.onboarding_url,
          message:
            "Connected account created. Complete onboarding at the URL above.",
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return errorText(`Stripe onboarding failed: ${msg}`);
      }
    }
  );

  // -----------------------------------------------------------------------
  // Check onboarding status
  // -----------------------------------------------------------------------
  server.registerTool(
    "spore_payment_onboarding_status",
    {
      title: "Check Payment Onboarding Status",
      description:
        "Check whether an agent has completed Stripe Connect onboarding.",
      inputSchema: {
        agent_id: z.string().describe("Agent ID to check"),
      },
    },
    async ({ agent_id }) => {
      const stripeAccountId = agentStripeAccounts.get(agent_id);
      if (!stripeAccountId) {
        return errorText(
          "No connected account found. Use spore_payment_onboard first."
        );
      }

      try {
        const complete = await checkOnboardingStatus(stripeAccountId);
        return jsonText({
          agent_id,
          stripe_account_id: stripeAccountId,
          onboarding_complete: complete,
          message: complete
            ? "Onboarding complete. Agent can receive payments."
            : "Onboarding not yet complete. Agent must finish setup at the onboarding URL.",
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return errorText(`Failed to check onboarding: ${msg}`);
      }
    }
  );

  // -----------------------------------------------------------------------
  // Create payment intent (when a bid is accepted on a paid task)
  // -----------------------------------------------------------------------
  server.registerTool(
    "spore_payment_create",
    {
      title: "Create Payment",
      description:
        "Create a payment intent for a task. Call this after accepting a bid " +
        `on a task with a budget. Platform takes ${PLATFORM_FEE_PERCENT}% fee.`,
      inputSchema: {
        task_id: z.string().describe("Task ID"),
        poster_id: z
          .string()
          .describe("ID of the task poster (who is paying)"),
      },
    },
    async ({ task_id, poster_id }) => {
      const task = await store.getTask(task_id);
      if (!task) return errorText("Task not found.");
      if (!task.budget_usd || task.budget_usd <= 0) {
        return errorText("Task has no budget set. Cannot create payment.");
      }
      if (!task.assigned_agent_id) {
        return errorText("Task has no assigned agent. Accept a bid first.");
      }

      const stripeAccountId = agentStripeAccounts.get(task.assigned_agent_id);
      if (!stripeAccountId) {
        return errorText(
          "Assigned agent has no Stripe account. They must complete payment onboarding first."
        );
      }

      const amountCents = Math.round(task.budget_usd * 100);

      try {
        const intent = await createPaymentIntent(
          task_id,
          poster_id,
          stripeAccountId,
          amountCents
        );

        const platformFeeCents = Math.round(
          amountCents * (PLATFORM_FEE_PERCENT / 100)
        );

        return jsonText({
          task_id,
          payment_intent_id: intent.stripe_payment_intent_id,
          total_usd: task.budget_usd,
          agent_receives_usd:
            Math.round((amountCents - platformFeeCents) / 100 * 100) / 100,
          platform_fee_usd: Math.round(platformFeeCents / 100 * 100) / 100,
          platform_fee_percent: PLATFORM_FEE_PERCENT,
          status: intent.status,
          message: `Payment of $${task.budget_usd} created. $${((amountCents - platformFeeCents) / 100).toFixed(2)} goes to agent, $${(platformFeeCents / 100).toFixed(2)} platform fee.`,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return errorText(`Failed to create payment: ${msg}`);
      }
    }
  );

  // -----------------------------------------------------------------------
  // Process payment on task completion
  // -----------------------------------------------------------------------
  server.registerTool(
    "spore_payment_process",
    {
      title: "Process Task Payment",
      description:
        "Process payment after a task is completed and rated. " +
        "Transfers 85% to the agent and retains 15% as platform fee.",
      inputSchema: {
        task_id: z.string().describe("Task ID"),
        stripe_payment_intent_id: z
          .string()
          .describe("Stripe payment intent ID from spore_payment_create"),
      },
    },
    async ({ task_id, stripe_payment_intent_id }) => {
      const task = await store.getTask(task_id);
      if (!task) return errorText("Task not found.");
      if (task.status !== "completed") {
        return errorText(
          "Task must be completed (delivered + rated) before processing payment."
        );
      }
      if (!task.assigned_agent_id) {
        return errorText("No assigned agent on this task.");
      }

      const stripeAccountId = agentStripeAccounts.get(task.assigned_agent_id);
      if (!stripeAccountId) {
        return errorText("Agent has no connected Stripe account.");
      }

      try {
        const result = await processTaskPayment(
          stripe_payment_intent_id,
          stripeAccountId
        );

        return jsonText({
          task_id: result.task_id,
          status: result.status,
          total_usd: (result.total_amount_cents / 100).toFixed(2),
          agent_received_usd: (result.agent_payout_cents / 100).toFixed(2),
          platform_fee_usd: (result.platform_fee_cents / 100).toFixed(2),
          transfer_id: result.transfer_id,
          ...(result.error ? { error: result.error } : {}),
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return errorText(`Payment processing failed: ${msg}`);
      }
    }
  );

  // -----------------------------------------------------------------------
  // Agent balance
  // -----------------------------------------------------------------------
  server.registerTool(
    "spore_payment_balance",
    {
      title: "Check Payment Balance",
      description:
        "Check an agent's available and pending balance from completed tasks.",
      inputSchema: {
        agent_id: z.string().describe("Agent ID"),
      },
    },
    async ({ agent_id }) => {
      const stripeAccountId = agentStripeAccounts.get(agent_id);
      if (!stripeAccountId) {
        return errorText(
          "No connected account found. Use spore_payment_onboard first."
        );
      }

      try {
        const balance = await getAccountBalance(stripeAccountId);

        return jsonText({
          agent_id,
          available: balance.available.map((b) => ({
            amount_usd: (b.amount_cents / 100).toFixed(2),
            currency: b.currency,
          })),
          pending: balance.pending.map((b) => ({
            amount_usd: (b.amount_cents / 100).toFixed(2),
            currency: b.currency,
          })),
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return errorText(`Failed to check balance: ${msg}`);
      }
    }
  );

  // -----------------------------------------------------------------------
  // Agent payout (withdraw to bank)
  // -----------------------------------------------------------------------
  server.registerTool(
    "spore_payment_payout",
    {
      title: "Request Payout",
      description:
        "Request a payout of available balance to the agent's bank account.",
      inputSchema: {
        agent_id: z.string().describe("Agent ID"),
        amount_usd: z
          .number()
          .positive()
          .describe("Amount to withdraw in USD"),
      },
    },
    async ({ agent_id, amount_usd }) => {
      const stripeAccountId = agentStripeAccounts.get(agent_id);
      if (!stripeAccountId) {
        return errorText(
          "No connected account found. Use spore_payment_onboard first."
        );
      }

      const amountCents = Math.round(amount_usd * 100);

      try {
        const result = await createPayout(stripeAccountId, amountCents);

        return jsonText({
          agent_id,
          payout_id: result.payout_id,
          amount_usd: (result.amount_cents / 100).toFixed(2),
          estimated_arrival: result.arrival_date,
          status: result.status,
          message: `Payout of $${amount_usd.toFixed(2)} initiated. Estimated arrival: ${result.arrival_date}.`,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return errorText(`Payout failed: ${msg}`);
      }
    }
  );
}
