import {
  AnimationDefinition,
  motion,
  useAnimationControls
} from "framer-motion";
import React from "react";
import { animationCharacterConfig } from "../utils/constants";
import { useResponsiveDimensions } from "../hooks/useResponsiveDimensions";

type Props = {
  side: "left" | "right";
  src: string;
};

const scaleInitial = 0.2;
const scaleStep1 = 0.8;
const scaleStep2 = 1.0;
const gapWhenClose = 0.05;

export const AnimatedCharacter: React.FC<Props> = ({ side, src }) => {
  const animation = useAnimationControls();
  const { containerHalfWidth, headerCharacterWidth } = useResponsiveDimensions();

  const leftAnimate1 = React.useMemo(() => ({
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
  }), [containerHalfWidth, headerCharacterWidth]);

  const leftAnimate2 = React.useMemo(() => ({
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
  }), [containerHalfWidth, headerCharacterWidth]);

  const rightAnimate1 = React.useMemo(() => ({
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
  }), [containerHalfWidth, headerCharacterWidth]);

  const rightAnimate2: AnimationDefinition = React.useMemo(() => ({
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
  }), [containerHalfWidth, headerCharacterWidth]);

  React.useEffect(() => {
    animation.start(side === "left" ? leftAnimate1 : rightAnimate1).then(() => {
      void animation.start(side === "left" ? leftAnimate2 : rightAnimate2);
    });
  }, [animation, side, leftAnimate1, leftAnimate2, rightAnimate1, rightAnimate2]);

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
