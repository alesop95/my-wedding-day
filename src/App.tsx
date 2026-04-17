import React, { useEffect } from "react";
import "./App.css";
import Container from "./container";
import Header from "./header";
import { useAtom } from "jotai";
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
import { useWedding } from "./hooks/useWedding";
import { useRestaurant } from "./hooks/useRestaurant";
import { Restaurant } from "./restaurant";
import { AtHome } from "./sections/AtHome";
import { WeddingIsOver } from "./sections/WeddingIsOver";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

const App = () => {
  const [headerAnimationEnd, setHeaderAnimationEnd] =
    useAtom(bootAnimationAtom);
  const result = useFamilyData();
  const { isWeddingStarted, isPartyStarted, isWeddingOver } = useWedding();
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

  // Gestione transizione diretta Admin ↔ Restaurant
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

  return (
    <Container>
      <Header onAnimationComplete={() => setHeaderAnimationEnd(true)} />
      {headerAnimationEnd && (
        <motion.div
          style={{ width: "100%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}
        >
          <WeAreWedding />
          {isPartyStarted && <GallerySection />}
          {!isPartyStarted && <AtHome />}
          {/* <WhenSection /> */}
          <WhereSection onlyInfo={result.data.onlyInfo} />
          {!result.data.onlyInfo && !isWeddingStarted && (
            <>
              <RSVPSection familyData={result.data} />
              <HotelSection />
            </>
          )}
          <GiftSection />
          {!isPartyStarted && <GallerySection />}
        </motion.div>
      )}
    </Container>
  );
};

export default App;
