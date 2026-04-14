import { motion } from "framer-motion";
import { Stack, Typography } from "@mui/material";
import React from "react";
import { FamilyMember } from "../types/family";

type YouHaveToConfirmProps = {
  members: FamilyMember[];
};
export const YouHaveToConfirm: React.FC<YouHaveToConfirmProps> = ({
  members
}) => {
  const someOneHasNotConfirmed = members.some(m => m.rsvp === "unknown");
  if (!someOneHasNotConfirmed) {
    return null;
  }
  return (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
      <Stack
        mb={1}
        spacing={0.5}
        direction={"row"}
        sx={{
          width: "fit-content",
          p: 1,
          backgroundColor: "#c4f6d044",
          borderColor: "#ff800099",
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: 6
        }}
      >
        <motion.div
          animate={{
            y: [0, 2, 0, 7, 0],
            transition: {
              duration: 2.0,
              ease: "easeInOut",
              repeat: Infinity
            }
          }}
        >
          ☝️
        </motion.div>
        <Typography variant={"subtitle2"} sx={{ color: "#757575" }}>
          {members.length === 1
            ? "facci sapere se festeggerai con noi"
            : "facci sapere se festeggerete con noi"}
          <br />
          cliccando qui sopra
        </Typography>
      </Stack>
    </Stack>
  );
};
