export type AccountType = "asset" | "liability" | "revenue" | "expense" | "equity";
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  createdAt: string;
}
export interface JournalLine {
  accountId: string;
  debitCents: number;
  creditCents: number;
}
export interface JournalEntry {
  id: string;
  reference: string;
  description: string;
  currency: string;
  lines: JournalLine[];
  idempotencyKey: string;
  createdAt: string;
}
export interface StatementLine {
  externalRef: string;
  amountCents: number;
  currency: string;
}
export interface ReconciliationResult {
  matched: string[];
  unmatched: string[];
  missingFromLedger: string[];
}
