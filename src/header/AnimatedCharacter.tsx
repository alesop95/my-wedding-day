import {
  AnimationDefinition,
  motion,
  useAnimationControls
} from "framer-motion";
import React from "react";
import {
  animationCharacterConfig,
  containerHalfWidth,
  headerCharacterWidth
} from "../utils/constants";

type Props = {
  side: "left" | "right";
  src: string;
};

const scaleInitial = 0.2;
const scaleStep1 = 0.8;
const scaleStep2 = 1.0;
const gapWhenClose = 0.05;
const leftAnimate1 = {
  opacity: [0, 1],
  scale: [scaleInitial, scaleStep1],
  x: [
    -headerCharacterWidth,
    containerHalfWidth -
      (headerCharacterWidth -
        (headerCharacterWidth * (1 - gapWhenClose - scaleStep1)) / 2)
  ],
  y: [-headerCharacterWidth / 2, 0],
  rotate: [-30, 0],
  transition: {
    delay: animationCharacterConfig.animationDelay1,
    duration: animationCharacterConfig.animationDuration1,
    ease: animationCharacterConfig.easeAnimation1
  }
};

const leftAnimate2 = {
  x: [
    containerHalfWidth -
      (headerCharacterWidth -
        (headerCharacterWidth * (1 - gapWhenClose - scaleStep1)) / 2),
    0
  ],
  scale: [scaleStep1, scaleStep2],
  transition: {
    delay: animationCharacterConfig.animationDelay2,
    duration: animationCharacterConfig.animationDuration2,
    ease: animationCharacterConfig.easeAnimation2
  }
};

const rightAnimate1 = {
  opacity: [0, 1],
  scale: [scaleInitial, scaleStep1],
  y: [-headerCharacterWidth / 2, 0],
  x: [
    containerHalfWidth + headerCharacterWidth,
    -((headerCharacterWidth * (1 - gapWhenClose - scaleStep1)) / 2)
  ],
  rotate: [30, 0],
  transition: {
    delay: animationCharacterConfig.animationDelay1,
    duration: animationCharacterConfig.animationDuration1,
    ease: animationCharacterConfig.easeAnimation1
  }
};

const rightAnimate2: AnimationDefinition = {
  x: [
    -((headerCharacterWidth * (1 - gapWhenClose - scaleStep1)) / 2),
    containerHalfWidth - headerCharacterWidth
  ],
  scale: [scaleStep1, scaleStep2],
  transition: {
    delay: animationCharacterConfig.animationDelay2,
    duration: animationCharacterConfig.animationDuration2,
    ease: animationCharacterConfig.easeAnimation2
  }
};

export const AnimatedCharacter: React.FC<Props> = ({ side, src }) => {
  const animation = useAnimationControls();
  React.useEffect(() => {
    animation.start(side === "left" ? leftAnimate1 : rightAnimate1).then(() => {
      void animation.start(side === "left" ? leftAnimate2 : rightAnimate2);
    });
  }, [animation, side]);
  return (
    <motion.img
      style={{
        width: headerCharacterWidth,
        height: "auto",
        position: "relative"
      }}
      key={src}
      src={src}
      animate={animation}
      layout={true}
    />
  );
};
