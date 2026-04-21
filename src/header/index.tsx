import { AnimatedCharacter } from "./AnimatedCharacter";
import { Stack, Box } from "@mui/material";
import { WeddingRings } from "./WeddingRings";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { motion, useAnimationControls } from "framer-motion";
import React, { useCallback, useEffect, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  easterEggAtom,
  easterEggClickCounterAtom,
  fireEasterEggAtom
} from "../state/easterEggAtom";
import { easterEggActivationClicks } from "../utils/constants";
import { useResponsiveDimensions } from "../hooks/useResponsiveDimensions";

type Props = {
  onAnimationComplete: () => void;
};

const Header: React.FC<Props> = ({ onAnimationComplete }) => {
  const [easterEgg, setEasterEgg] = useAtom(easterEggAtom);
  const easterEggClicks = useAtomValue(easterEggClickCounterAtom);
  const setEasterEggFire = useSetAtom(fireEasterEggAtom);
  const animation = useAnimationControls();
  const animationShake = useAnimationControls();
  const audio = useMemo(() => new Audio("back_to_the_future.mp3"), []);
  const { headerCharacterWidth } = useResponsiveDimensions();

  useEffect(() => {
    if (
      !easterEgg &&
      easterEggClicks > 0 &&
      easterEggClicks < easterEggActivationClicks
    ) {
      void animationShake.start({
        //rotate: [0, 5, -5, 0],
        x: [0, 5, -5, 0],
        y: [0, 5, -5, 0],
        transition: {
          duration: 0.1,
          ease: "easeIn"
        }
      });
    }
  }, [animationShake, easterEggClicks]);

  const animate = useCallback(async () => {
    await animation.start({
      zIndex: 10006,
      y: [0, window.innerHeight - headerCharacterWidth * 1.5],
      transition: {
        duration: 13,
        ease: "easeIn"
      }
    });
    await animation.start({
      rotate: [0, 20],
      transition: {
        duration: 1.8,
        ease: "easeOut"
      }
    });
    setTimeout(() => {
      setEasterEggFire(true);
    }, 4700);
    await animation.start({
      x: [0, window.innerWidth * 3],
      transition: {
        ease: "anticipate",
        delay: 4.3,
        duration: 4.3
      }
    });
    await animation.start({
      y: 0,
      x: 0,
      rotate: 0,
      transition: {
        duration: 1,
        ease: "easeIn"
      }
    });
    setEasterEgg(false);
  }, [animation, setEasterEgg, setEasterEggFire, headerCharacterWidth]);
  React.useEffect(() => {
    if (easterEgg) {
      audio.currentTime = 0;
      audio.pause();
      void audio.play();
      void animate();
    }
  }, [animate, animation, audio, easterEgg]);
  return (
    <Stack direction={"row"} style={{ position: "relative" }} pt={1}>
      {/* Language Switcher in top right */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 16,
          zIndex: 10004,
        }}
      >
        <LanguageSwitcher />
      </Box>

      <Stack
        style={{
          flex: 1
        }}
      >
        <motion.div animate={animationShake} style={{ zIndex: 10003 }}>
          <motion.div animate={animation}>
            <AnimatedCharacter side={"left"} src={"/header/mario.svg"} />
          </motion.div>
        </motion.div>
      </Stack>
      <Stack
        style={{
          flex: 1
        }}
      >
        <AnimatedCharacter side={"right"} src={"/header/giulia.svg"} />
      </Stack>

      <WeddingRings onAnimationComplete={onAnimationComplete} />
    </Stack>
  );
};

export default Header;
