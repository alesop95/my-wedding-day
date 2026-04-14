import { sectionHeaderIconWidth } from "../utils/constants";
import { Stack, Typography } from "@mui/material";
import React from "react";

type Props = {
  altImage: string;
  imgSrc: string;
  title: string;
};
export const SectionHeader: React.FC<Props> = ({ title, imgSrc, altImage }) => {
  return (
    <Stack
      direction={"row"}
      spacing={2}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <img src={imgSrc} width={sectionHeaderIconWidth} alt={altImage} />
      <Typography fontSize={34} fontWeight={"400"} textAlign={"center"}>
        {title}
      </Typography>
    </Stack>
  );
};
