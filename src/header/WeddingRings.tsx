import { animationRingConfig, weddingRingWidth } from "../utils/constants";
import { motion, useAnimationControls } from "framer-motion";
import React, { useCallback, useEffect } from "react";
import { easterEggAtom } from "../state/easterEggAtom";
import { useAtomValue } from "jotai";

type Props = {
  onAnimationComplete: () => void;
};
export const WeddingRings: React.FC<Props> = ({ onAnimationComplete }) => {
  const easterEgg = useAtomValue(easterEggAtom);
  const animation = useAnimationControls();

  const sequence = useCallback(async () => {
    await animation.start({
      scale: 1,
      y: [-weddingRingWidth * 3, 0],
      transition: {
        delay: animationRingConfig.delay,
        duration: animationRingConfig.duration,
        type: animationRingConfig.type,
        bounce: animationRingConfig.bounce
      }
    });
    await animation.start({
      y: [0, 5, 0, 5, 0],
      transition: {
        delay: 2,
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity
      }
    });
  }, [animation]);

  useEffect(() => {
    void sequence();
  }, [sequence]);
  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "90%",
        transform: "translate(-50%, -50%)",
        zIndex: !easterEgg ? 10004 : 0
      }}
    >
      <motion.img
        style={{
          width: weddingRingWidth,
          height: "auto",
          position: "relative"
        }}
        key={"wedding-ring"}
        src={"./header/wedding-ring.png"}
        layout={true}
        onAnimationComplete={onAnimationComplete}
        animate={animation}
      />
    </motion.div>
  );
};
