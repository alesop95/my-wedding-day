import { useMemo } from 'react';
import { SectionInfo } from '../state/activeSectionAtom';
import { useWedding } from './useWedding';

interface UseSectionsParams {
  onlyInfo: boolean;
}

export const useSections = ({ onlyInfo }: UseSectionsParams): SectionInfo[] => {
  const { showAtHome, showRSVP, showHotel, showGuestbook } = useWedding();

  return useMemo(() => {
    const list: SectionInfo[] = [];
    list.push({ id: 'header', icon: '💍', name: 'Alessio & Beatrice', desc: 'I nostri sposi' });
    list.push({ id: 'we-are-wedding', icon: '👰🤵', name: 'Chi siamo', desc: 'La nostra storia' });
    if (showAtHome) {
      list.push({ id: 'at-home', icon: '🏠', name: 'Prima cerimonia', desc: 'Incontriamoci' });
    }
    list.push({ id: 'where', icon: '⛪', name: 'Dove', desc: 'Cerimonia e ricevimento' });
    list.push({ id: 'menu', icon: '🍽️', name: 'Menù', desc: 'Ricevimento' });
    if (!onlyInfo && showRSVP) {
      list.push({ id: 'rsvp', icon: '✅', name: 'Conferma presenza', desc: 'Ci sarai?' });
    }
    if (!onlyInfo && showHotel) {
      list.push({ id: 'hotel', icon: '🏨', name: 'Alloggi', desc: 'Dove dormire' });
    }
    list.push({ id: 'gift', icon: '🎁', name: 'Lista nozze', desc: 'Il vostro regalo' });
    if (showGuestbook) {
      list.push({ id: 'guestbook', icon: '📝', name: 'Guestbook', desc: 'Lascia messaggio' });
    }
    list.push({ id: 'playlist', icon: '🎵', name: 'Playlist', desc: 'Musica festa' });
    list.push({ id: 'photo-sharing', icon: '📸', name: 'Condividi foto', desc: 'I vostri scatti' });
    list.push({ id: 'gallery', icon: '🖼️', name: 'Galleria', desc: 'Le nostre foto' });
    return list;
  }, [showAtHome, showRSVP, showHotel, showGuestbook, onlyInfo]);
};
