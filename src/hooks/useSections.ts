import { useMemo } from 'react';
import { SectionInfo } from '../state/activeSectionAtom';
import { useWedding } from './useWedding';
import { usePhotoSharing } from './usePhotoSharing';
import { useTranslation } from 'react-i18next';

interface UseSectionsParams {
  onlyInfo: boolean;
}

export const useSections = ({ onlyInfo }: UseSectionsParams): SectionInfo[] => {
  const { showAtHome, showRSVP, showHotel, showGuestbook } = useWedding();
  const { isVisible: isPhotoSharingVisible } = usePhotoSharing();
  const { t } = useTranslation();

  return useMemo(() => {
    const list: SectionInfo[] = [];
    list.push({ id: 'header', icon: '💍', name: t('header.title'), desc: t('header.subtitle') });
    if (showAtHome) {
      list.push({ id: 'at-home', icon: '🏠', name: t('sections.athome.title'), desc: t('sections.athome.subtitle') });
    }
    list.push({ id: 'where', icon: '⛪', name: t('sections.where.title'), desc: t('sections.where.subtitle') });
    list.push({ id: 'menu', icon: '🍽️', name: t('sections.menu.title'), desc: t('sections.menu.subtitle') });
    if (!onlyInfo && showRSVP) {
      list.push({ id: 'rsvp', icon: '✅', name: t('sections.rsvp.title'), desc: t('sections.rsvp.subtitle') });
    }
    if (!onlyInfo && showHotel) {
      list.push({ id: 'hotel', icon: '🏨', name: t('sections.hotel.title'), desc: t('sections.hotel.subtitle') });
    }
    list.push({ id: 'gift', icon: '🎁', name: t('sections.gift.title'), desc: t('sections.gift.subtitle') });
    if (showGuestbook) {
      list.push({ id: 'guestbook', icon: '📝', name: t('sections.guestbook.title'), desc: t('sections.guestbook.subtitle') });
    }
    list.push({ id: 'playlist', icon: '🎵', name: t('sections.playlist.title'), desc: t('sections.playlist.subtitle') });
    if (isPhotoSharingVisible) {
      list.push({ id: 'photo-sharing', icon: '📸', name: t('sections.photoSharing.title'), desc: t('sections.photoSharing.subtitle') });
    }
    list.push({ id: 'gallery', icon: '🖼️', name: t('sections.gallery.title'), desc: t('sections.gallery.subtitle') });
    return list;
  }, [showAtHome, showRSVP, showHotel, showGuestbook, onlyInfo, isPhotoSharingVisible, t]);
};
