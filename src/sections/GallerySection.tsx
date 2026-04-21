import { Carousel } from "react-responsive-carousel";
import { SectionContainer } from "./SectionContainer";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Typography } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import React from "react";
import { useTranslation } from "react-i18next";

export const GallerySection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <Typography variant={"h4"} textAlign={"center"} pb={2}>
        {t("sections.gallery.subtitle")}
      </Typography>
      <Box
        display={"flex"}
        style={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <Box
          display={"flex"}
          style={{
            flex: 1,
            width: "96%",
            justifyContent: "center"
          }}
        >
          <Carousel
            infiniteLoop={true}
            autoPlay={false}
            centerMode={false}
            emulateTouch={true}
            swipeable={true}
            showThumbs={false}
            showArrows={true}
            dynamicHeight={false}
            showStatus={false}
            showIndicators={false}
            width={"100%"}
          >
            <div>
              <img
                src={"../sections/gallery/placeholder1.svg"}
                alt={t("sections.gallery.placeholder1")}
              />
            </div>
            <div>
              <img
                src={"../sections/gallery/placeholder2.svg"}
                alt={t("sections.gallery.placeholder2")}
              />
            </div>
          </Carousel>
        </Box>
        <Button
          startIcon={<CollectionsIcon />}
          sx={{ mt: 2, backgroundColor: "#9cf19d" }}
          variant={"contained"}
          color={"inherit"}
          onClick={() => {
            window.open("https://example.com/private-album");
          }}
        >
          <Typography>
            {t("sections.gallery.share")}
          </Typography>
        </Button>
      </Box>
    </SectionContainer>
  );
};
