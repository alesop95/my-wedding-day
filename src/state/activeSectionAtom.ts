import { atom } from 'jotai';

export const activeSectionAtom = atom<number>(0);

export interface SectionInfo {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export const visibleSectionsAtom = atom<SectionInfo[]>([]);
export const totalSectionsAtom = atom<number>(get => get(visibleSectionsAtom).length);
