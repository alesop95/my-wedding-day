import { atomWithStorage } from 'jotai/utils';

export type Language = 'it' | 'en';

export const languageAtom = atomWithStorage<Language>('wedding-app-language', 'it');