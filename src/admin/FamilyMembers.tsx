import { FamilyData, FamilyMember } from "../types/family";
import React from "react";
import { TableCell, TableRow } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

type FamilyRowsProps = {
  data: FamilyData;
};

const rsvpMap: Record<FamilyMember["rsvp"], string> = {
  yes: "SI",
  no: "NO",
  maybe: "FORSE",
  unknown: "-"
};

export const FamilyMembers: React.FC<FamilyRowsProps> = ({ data }) => {
  const { id, members } = data;

  return (
    <>
      {members.map((member, idx) => {
        const { firstName, lastName, rsvp, isChild, infant } = member;
        return (
          <TableRow key={`${id}_${idx}`}>
            <TableCell align={"center"}>{firstName}</TableCell>
            <TableCell align={"center"}>{lastName}</TableCell>
            <TableCell align={"center"}>
              {infant ? "neonato" : isChild ? "bambino" : ""}
            </TableCell>

            <TableCell align={"center"}>
              {rsvp === "yes" ? (
                <CheckCircleIcon color={"success"} />
              ) : rsvp === "no" ? (
                <CancelIcon color={"error"} />
              ) : (
                rsvpMap[rsvp]
              )}
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};
