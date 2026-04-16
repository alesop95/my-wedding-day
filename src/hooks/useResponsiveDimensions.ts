import { useEffect, useState } from "react";

type ResponsiveDimensions = {
  containerWidth: number;
  containerHalfWidth: number;
  headerCharacterWidth: number;
  weddingRingWidth: number;
  sectionHeaderIconWidth: number;
  errorAnimationWidth: number;
  aroundTheWorldAnimationWidth: number;
};

export const useResponsiveDimensions = (): ResponsiveDimensions => {
  const [dimensions, setDimensions] = useState<ResponsiveDimensions>(() => {
    const containerWidth = Math.min(window.innerWidth, 700);
    const containerHalfWidth = containerWidth / 2;
    const headerCharacterWidth = containerHalfWidth * 0.5;
    const weddingRingWidth = headerCharacterWidth * 0.5;
    const sectionHeaderIconWidth = Math.min(headerCharacterWidth * 0.3, 48);
    const errorAnimationWidth = containerWidth * 0.6;
    const aroundTheWorldAnimationWidth = containerWidth * 0.3;

    return {
      containerWidth,
      containerHalfWidth,
      headerCharacterWidth,
      weddingRingWidth,
      sectionHeaderIconWidth,
      errorAnimationWidth,
      aroundTheWorldAnimationWidth,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = Math.min(window.innerWidth, 700);
      const containerHalfWidth = containerWidth / 2;
      const headerCharacterWidth = containerHalfWidth * 0.5;
      const weddingRingWidth = headerCharacterWidth * 0.5;
      const sectionHeaderIconWidth = Math.min(headerCharacterWidth * 0.3, 48);
      const errorAnimationWidth = containerWidth * 0.6;
      const aroundTheWorldAnimationWidth = containerWidth * 0.3;

      setDimensions({
        containerWidth,
        containerHalfWidth,
        headerCharacterWidth,
        weddingRingWidth,
        sectionHeaderIconWidth,
        errorAnimationWidth,
        aroundTheWorldAnimationWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return dimensions;
};