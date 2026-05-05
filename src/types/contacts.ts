export type ContactConfig = {
  name: string;
  number: string;
  message: string;
  image: string;
};

export type ContactsState = {
  contacts: ContactConfig[];
  loading: boolean;
  error: string | null;
};