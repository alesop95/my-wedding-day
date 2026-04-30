import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";
import { AddToCalendarButton } from "add-to-calendar-button-react";

export const WhereSection: React.FC<{ onlyInfo: boolean }> = ({ onlyInfo }) => {
  const { t, i18n } = useTranslation();

  const dates = [
    {
      name: t("sections.where.calendarCeremonyName"),
      startDate: "2027-07-24",
      startTime: "17:30",
      endTime: "18:30",
      endDate: "2027-07-24",
      timeZone: "Europe/Rome",
      description: t("sections.where.ceremonyDescription"),
      location: t("sections.where.calendarLocation")
    },
    {
      name: t("sections.where.calendarReceptionName"),
      startDate: "2027-07-24",
      startTime: "19:00",
      endTime: "01:00",
      endDate: "2027-07-25",
      timeZone: "Europe/Rome",
      description: t("sections.where.receptionDescription"),
      location: t("sections.where.calendarReceptionLocation")
    }
  ];
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
            imgSrc={"../sections/church.png"}
            altImage={t("sections.where.church")}
            title={t("sections.where.ceremony")}
          />

          <Typography variant={"h4"} textAlign={"center"}>
            {t("sections.where.time")}
          </Typography>
          <Typography variant={"h5"} textAlign={"center"}>
            {t("sections.where.date")}
          </Typography>
          <a
            rel="noreferrer"
            href={"https://maps.app.goo.gl/apPEZMHkUCJc8yyP7"}
            target={"_blank"}
            style={{
              textDecoration: "underline",
              textUnderlineOffset: 4,
              color: "#595959"
            }}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Typography
                variant={"h5"}
                fontWeight={"600"}
                textAlign={"center"}
              >
                {t("sections.where.ceremonyLocation")}
              </Typography>
              <img
                src={"/sections/map.png"}
                alt={t("sections.where.map")}
                style={{ width: 26, height: 26 }}
              />
            </Stack>
          </a>

          <img
            src={"/sections/church.png"}
            alt={t("sections.where.ceremony")}
            style={{
              width: "90%",
              height: "auto",
              borderRadius: 10
            }}
          />
        </Stack>
        {!onlyInfo && (
          <Box
            sx={{ mt: { sm: 3, xs: 2 } }}
            component={"div"}
            display={"flex"}
            style={{
              justifyContent: "center"
            }}
          >
            <Stack direction={"column"} alignItems={"center"} spacing={1}>
              <SectionHeader
                imgSrc={"../sections/restaurant.png"}
                altImage={t("sections.where.receptionAlt")}
                title={t("sections.where.reception")}
              />
              <Typography variant={"h4"} textAlign={"center"}>
                {t("sections.where.receptionText")}
              </Typography>
              <a
                rel="noreferrer"
                href={"https://maps.app.goo.gl/MW3uhzN3Vj7seb3RA"}
                target={"_blank"}
                style={{
                  textDecoration: "underline",
                  textUnderlineOffset: 4,
                  color: "#595959"
                }}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Typography
                    variant={"h5"}
                    fontWeight={"600"}
                    textAlign={"center"}
                  >
                    {t("sections.where.receptionLocation")}
                  </Typography>
                  <img
                    src={"/sections/map.png"}
                    alt={t("sections.where.map")}
                    style={{ width: 26, height: 26 }}
                  />
                </Stack>
              </a>

              <img
                src={"/sections/restaurant.png"}
                alt={t("sections.where.receptionAlt")}
                style={{
                  width: "90%",
                  height: "auto",
                  borderRadius: 10
                }}
              />
            </Stack>
          </Box>
        )}

        <Box
          display={"flex"}
          pt={{ sm: 2, xs: 1 }}
          style={{
            justifyContent: "center",
            zIndex: 100
          }}
        >
          <AddToCalendarButton
            buttonStyle={"round"}
            hideBranding={true}
            name={t("sections.where.calendarName")}
            label={t("sections.where.calendarLabel")}
            language={i18n.language as "it" | "en"}
            dates={dates}
            options={["Google", "Apple", "Yahoo", "Outlook.com"]}
          />
        </Box>
      </Box>
    </SectionContainer>
  );
};
