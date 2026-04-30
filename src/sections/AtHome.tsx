import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";

type AtHomeProps = {};
export const AtHome: React.FC<AtHomeProps> = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <Box
        display={"flex"}
        style={{
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Stack direction={"column"} alignItems={"center"} spacing={1}>
          <SectionHeader
            imgSrc={"../sections/home.png"}
            altImage={t("sections.athome.church")}
            title={t("sections.athome.title")}
          />
          <Typography variant={"h5"} textAlign={"center"}>
            {t("sections.athome.description")}
          </Typography>
          <Stack spacing={2}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <img
                src={"../header/mario.svg"}
                alt={t("header.avatarMario")}
                style={{ width: 48 }}
              />
              <Typography fontSize={16} textAlign={"left"}>
                {t("sections.athome.timeFrom")}{" "}
                <a
                  rel="noreferrer"
                  href={"https://maps.app.goo.gl/AKpXN4mCpm6SEYQB8"}
                  target={"_blank"}
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    color: "#595959"
                  }}
                >
                  {t("sections.athome.meetingPointA")}
                </a>
              </Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <img
                src={"../header/giulia.svg"}
                alt={t("header.avatarGiulia")}
                style={{ width: 48 }}
              />
              <Typography fontSize={16} textAlign={"left"}>
                {t("sections.athome.timeFrom")}{" "}
                <a
                  rel="noreferrer"
                  href={"https://maps.app.goo.gl/BSnNZWyf3iqAoeYE7"}
                  target={"_blank"}
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    color: "#595959"
                  }}
                >
                  {t("sections.athome.meetingPointB")}
                </a>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </SectionContainer>
  );
};
