import { SectionContainer } from "./SectionContainer";
import { SectionHeader } from "../common/SectionHeader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Link,
  Stack,
  Typography
} from "@mui/material";

type Hotel = {
  name: string;
  address?: string;
  phone?: string;
  website: string;
  image: string;
};
const hotelList: Hotel[] = [
  {
    name: "Residence Aurora",
    address: "https://example.com/maps/residence-aurora",
    phone: "+390600000001",
    website: "https://example.com/stays/residence-aurora",
    image: "../sections/resort.png"
  },
  {
    name: "Hotel Riviera Verde",
    address: "https://example.com/maps/hotel-riviera-verde",
    phone: "+390600000002",
    website: "https://example.com/stays/hotel-riviera-verde",
    image: "../sections/resort.png"
  },
  {
    name: "Cottage Lago Blu",
    address: "https://example.com/maps/cottage-lago-blu",
    phone: "+390600000003",
    website: "https://example.com/stays/cottage-lago-blu",
    image: "../sections/resort.png"
  },
  {
    name: "Hotel Marina",
    address: "https://example.com/maps/hotel-marina",
    phone: "+390600000004",
    website: "https://example.com/stays/hotel-marina",
    image: "../sections/home.png"
  },
  {
    name: "Guest House Luminosa",
    address: "https://example.com/maps/guest-house-luminosa",
    phone: "+390600000005",
    website: "https://example.com/stays/guest-house-luminosa",
    image: "../sections/car.png"
  },
  {
    name: "Casa Vacanze Ulivo",
    address: "https://example.com/maps/casa-vacanze-ulivo",
    phone: "+390600000006",
    website: "https://example.com/stays/casa-vacanze-ulivo",
    image: "../sections/resort.png"
  }
];

export const HotelSection = () => {
  return (
    <SectionContainer>
      <Stack direction={"column"} alignItems={"center"} spacing={1}>
        <SectionHeader
          imgSrc={"../sections/resort.png"}
          altImage={"chiesa"}
          title={"Alloggio"}
        />
        <Typography variant={"h4"} textAlign={"center"} sx={{ px: 1 }}>
          Se desiderate fermarvi qualche giorno in piu, qui trovate una lista
          di strutture di esempio.
        </Typography>
        <Typography variant={"h4"} textAlign={"center"} sx={{ px: 1, pb: 2 }}>
          Vi consigliamo di prenotare al più presto!
        </Typography>
        <Accordion
          style={{
            backgroundColor: "white",
            borderRadius: 6,
            color: "black",
            borderTopWidth: 0
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ color: "black" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              variant={"h5"}
              textAlign={"center"}
              style={{ color: "black", flex: 1 }}
            >
              I nostri consigli ({hotelList.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {hotelList.map((hotel, index) => (
              <Box key={`hotel_${index}`}>
                <Stack direction={"column"} alignItems={"center"}>
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    style={{
                      width: "90%",
                      height: "auto",
                      borderRadius: 10,
                      marginBottom: 12
                    }}
                  />
                  <Typography
                    variant={"h6"}
                    fontFamily={"Monospace"}
                    fontWeight={"bold"}
                  >
                    {hotel.name}
                  </Typography>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1}
                    divider={<Divider orientation="vertical" flexItem />}
                  >
                    {hotel.address && (
                      <Link
                        href={hotel.address}
                        variant={"subtitle2"}
                        fontFamily={"Monospace"}
                        style={{ textDecoration: "none" }}
                        target={"_blank"}
                      >
                        posizione
                      </Link>
                    )}
                    <Link
                      href={hotel.website}
                      variant={"subtitle2"}
                      fontFamily={"Monospace"}
                      style={{ textDecoration: "none" }}
                      target={"_blank"}
                    >
                      sito web
                    </Link>
                    {hotel.phone && (
                      <Typography
                        variant={"subtitle2"}
                        fontFamily={"Monospace"}
                      >
                        {hotel.phone}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                {index < hotelList.length - 1 && (
                  <Divider style={{ width: "90%" }} sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      </Stack>
    </SectionContainer>
  );
};
