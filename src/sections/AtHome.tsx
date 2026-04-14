import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";

type AtHomeProps = {};
export const AtHome: React.FC<AtHomeProps> = () => {
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
            altImage={"chiesa"}
            title={"Prima della cerimonia"}
          />
          <Typography variant={"h5"} textAlign={"center"}>
            Se hai piacere di incontrarci prima della cerimonia per bere una
            cosa insieme e scambiare 4 chiacchere, sei il benvenuto/a!
          </Typography>
          <Stack spacing={2}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <img
                src={"../header/mario.svg"}
                alt={"avatar Mario"}
                style={{ width: 48 }}
              />
              <Typography fontSize={16} textAlign={"left"}>
                dalle 16h -{" "}
                <a
                  rel="noreferrer"
                  href={"https://example.com/maps/meeting-point-a"}
                  target={"_blank"}
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    color: "#595959"
                  }}
                >
                  Punto di incontro A, Citta Esempio
                </a>
              </Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <img
                src={"../header/giulia.svg"}
                alt={"avatar Giulia"}
                style={{ width: 48 }}
              />
              <Typography fontSize={16} textAlign={"left"}>
                dalle 16h -{" "}
                <a
                  rel="noreferrer"
                  href={"https://example.com/maps/meeting-point-b"}
                  target={"_blank"}
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    color: "#595959"
                  }}
                >
                  Punto di incontro B, Citta Esempio
                </a>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </SectionContainer>
  );
};
