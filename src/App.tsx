import React, { useEffect } from "react";
import "./App.css";
import Container from "./container";
import Header from "./header";
import { useAtom, useSetAtom } from "jotai";
import { bootAnimationAtom } from "./state/bootAnimationAtom";
import { motion } from "framer-motion";
import WeAreWedding from "./sections/WeAreWedding";
import { WhereSection } from "./sections/WhereSection";
import { GiftSection } from "./sections/GiftSection";
import { GallerySection } from "./sections/GallerySection";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { HotelSection } from "./sections/HotelSection";
import { LoadingMask } from "./common/LoadingMask";
import { useFamilyData } from "./hooks/useFamilyData";
import { ErrorMask } from "./common/ErrorMask";
import { useAdmin } from "./hooks/useAdmin";
import { Admin } from "./admin/Admin";
import { RSVPSection } from "./sections/RSVPSection";
import { isDev } from "./utils/env";
import { useNeedToRefresh } from "./hooks/useNeedToRefresh";
import { useRestaurant } from "./hooks/useRestaurant";
import { Restaurant } from "./restaurant";
import { AtHome } from "./sections/AtHome";
import { WeddingIsOver } from "./sections/WeddingIsOver";
import { GuestbookSection } from "./sections/GuestbookSection";
import { PhotoSharingSection } from "./sections/PhotoSharingSection";
import { PlaylistSection } from "./sections/PlaylistSection";
import { MenuSection } from "./sections/MenuSection";
import { SectionNavigator } from "./common/SectionNavigator";
import { useSections } from "./hooks/useSections";
import { visibleSectionsAtom } from "./state/activeSectionAtom";
import { useWedding } from "./hooks/useWedding";
import { FamilyData } from "./types/family";

const firebaseConfig = {
  apiKey: "AIzaSyAjVNYUCvAPUbSyf6gjnDObiJQT9arEYFw",
  authDomain: "my-wedding-day-dev.firebaseapp.com",
  projectId: "my-wedding-day-dev",
  storageBucket: "my-wedding-day-dev.firebasestorage.app",
  messagingSenderId: "638204567637",
  appId: "1:638204567637:web:d750670c56ac9030da74dc"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

const renderSectionContent = (id: string, familyData: FamilyData): React.ReactNode => {
  switch (id) {
    case 'we-are-wedding': return <WeAreWedding />;
    case 'at-home': return <AtHome />;
    case 'where': return <WhereSection onlyInfo={familyData.onlyInfo} />;
    case 'menu': return <MenuSection />;
    case 'rsvp': return <RSVPSection familyData={familyData} />;
    case 'hotel': return <HotelSection />;
    case 'gift': return <GiftSection />;
    case 'guestbook': return <GuestbookSection />;
    case 'playlist': return <PlaylistSection />;
    case 'photo-sharing': return <PhotoSharingSection />;
    case 'gallery': return <GallerySection />;
    default: return null;
  }
};

const App = () => {
  const [headerAnimationEnd, setHeaderAnimationEnd] = useAtom(bootAnimationAtom);
  const result = useFamilyData();
  const { isWeddingOver } = useWedding();
  const [elapsed, setElapsed] = React.useState(false);

  const needToRefresh = useNeedToRefresh();
  useEffect(() => {
    if (needToRefresh) {
      window.location.reload();
    }
  }, [needToRefresh]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setElapsed(true);
      },
      isDev ? 0 : 800
    );
    return () => clearInterval(interval);
  }, []);

  const admin = useAdmin();
  const restaurant = useRestaurant();

  const [adminMode, setAdminMode] = React.useState<'admin' | 'restaurant' | null>(null);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const switchMode = url.searchParams.get('switchTo');
    if (switchMode === 'restaurant' && admin) {
      setAdminMode('restaurant');
    } else if (switchMode === 'admin' && restaurant) {
      setAdminMode('admin');
    } else if (admin) {
      setAdminMode('admin');
    } else if (restaurant) {
      setAdminMode('restaurant');
    }
  }, [admin, restaurant]);

  const onlyInfo = result?.kind === "success" ? result.data.onlyInfo : false;
  const sections = useSections({ onlyInfo });
  const setVisibleSections = useSetAtom(visibleSectionsAtom);

  useEffect(() => {
    setVisibleSections(sections);
  }, [sections, setVisibleSections]);

  if (adminMode === 'admin' || (admin && !adminMode)) {
    return <Admin />;
  }

  if (adminMode === 'restaurant' || (restaurant && !adminMode)) {
    return <Restaurant />;
  }

  if (!result || !elapsed) {
    return <LoadingMask />;
  }

  if (isWeddingOver) {
    return (
      <Container>
        <WeddingIsOver />
      </Container>
    );
  }

  if (result.kind === "error") {
    return <ErrorMask />;
  }

  const familyData = result.data;
  const headerSection = sections[0];
  const bodySections = sections.slice(1);

  return (
    <>
      <SectionNavigator />
      <Container>
        <div id={`section-0`} data-section-id={headerSection?.id}>
          <Header onAnimationComplete={() => setHeaderAnimationEnd(true)} />
        </div>
        {headerAnimationEnd && (
          <motion.div
            style={{ width: "100%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}
          >
            {bodySections.map((section, idx) => (
              <div
                key={section.id}
                id={`section-${idx + 1}`}
                data-section-id={section.id}
              >
                {renderSectionContent(section.id, familyData)}
              </div>
            ))}
          </motion.div>
        )}
      </Container>
    </>
  );
};

export default App;
