export type BankConfig = {
  iban: string;
  owner: string;
  bicSwift?: string;
};

export type BankState = {
  config: BankConfig | null;
  loading: boolean;
  error: string | null;
};