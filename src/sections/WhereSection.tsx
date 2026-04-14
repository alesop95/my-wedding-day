import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";
import { AddToCalendarButton } from "add-to-calendar-button-react";

const cerimoniaDescription = `h17.30 - Cerimonia presso Location Cerimonia A`;
export const WhereSection: React.FC<{ onlyInfo: boolean }> = ({ onlyInfo }) => {
  const dates = [
    {
      name: "Alessio & Beatrice - Sposi",
      startDate: "2027-07-24",
      startTime: "17:30",
      endTime: "18:30",
      endDate: "2027-07-24",
      timeZone: "Europe/Rome",
      description: onlyInfo
        ? cerimoniaDescription
        : `${cerimoniaDescription}. A seguire, ricevimento presso Location Ricevimento B`,
      location: "Location Cerimonia A, Citta Esempio, Italia"
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
            altImage={"chiesa"}
            title={"Cerimonia"}
          />

          <Typography variant={"h4"} textAlign={"center"}>
            ore 17:30
          </Typography>
          <Typography variant={"h5"} textAlign={"center"}>
            24 Luglio
          </Typography>
          <a
            rel="noreferrer"
            href={"https://example.com/maps/location-cerimonia-a"}
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
                location cerimonia A
              </Typography>
              <img
                src={"/sections/map.png"}
                alt={"map"}
                style={{ width: 26, height: 26 }}
              />
            </Stack>
          </a>

          <img
            src={"/sections/church.png"}
            alt={"cerimonia"}
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
                altImage={"ricevimento"}
                title={"Ricevimento"}
              />
              <Typography variant={"h4"} textAlign={"center"}>
                dopo la cerimonia saremo lieti <br />
                di festeggiare insieme presso
              </Typography>
              <a
                rel="noreferrer"
                href={"https://example.com/maps/location-ricevimento-b"}
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
                    location ricevimento B
                  </Typography>
                  <img
                    src={"/sections/map.png"}
                    alt={"map"}
                    style={{ width: 26, height: 26 }}
                  />
                </Stack>
              </a>

              <img
                src={"/sections/restaurant.png"}
                alt={"ricevimento"}
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
            name="Matrimonio Alessio & Beatrice"
            label={"aggiungi al calendario"}
            language={"it"}
            dates={dates}
            options={["Google", "Apple", "Yahoo", "Outlook.com"]}
          />
        </Box>
      </Box>
    </SectionContainer>
  );
};
