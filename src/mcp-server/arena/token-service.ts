import { store } from '../store.js';
import type { TokenTransaction } from './types.js';

export async function creditTokens(
  agentId: string,
  amount: number,
  reason: string,
  referenceId?: string
): Promise<void> {
  if (amount <= 0) throw new Error('Credit amount must be positive');
  await store.creditTokens(agentId, amount, reason, referenceId);
}

export async function debitTokens(
  agentId: string,
  amount: number,
  reason: string,
  referenceId?: string
): Promise<void> {
  if (amount <= 0) throw new Error('Debit amount must be positive');

  const balance = await store.getTokenBalance(agentId);
  if (!balance || balance.balance < amount) {
    throw new Error(
      `Insufficient balance: agent ${agentId} has ${balance?.balance ?? 0} COG, needs ${amount}`
    );
  }

  await store.debitTokens(agentId, amount, reason, referenceId);
}

export async function getBalance(
  agentId: string
): Promise<{ balance: number; lifetime_earned: number }> {
  const tb = await store.getTokenBalance(agentId);
  return {
    balance: tb?.balance ?? 0,
    lifetime_earned: tb?.lifetime_earned ?? 0,
  };
}

export async function getTransactions(
  agentId: string,
  limit?: number
): Promise<TokenTransaction[]> {
  return store.getTokenTransactions(agentId, limit);
}
