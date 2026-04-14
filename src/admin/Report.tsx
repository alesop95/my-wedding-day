import { FamilyData, FamilyMember } from "../types/family";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useLoadTables } from "../hooks/useRestaurant";
const jsonexport = require("jsonexport/dist");

type ReportProps = {
  data: FamilyData[];
};

type ValueProps = {
  value: React.ReactNode;
  label: string;
};
const Value: React.FC<ValueProps> = ({ value, label }) => (
  <Grid item={true} xs={12} md={6}>
    <Stack>
      <Typography fontWeight={"bold"}>{label}</Typography>
      <Typography variant="caption">{value}</Typography>
    </Stack>
  </Grid>
);

export const Report: React.FC<ReportProps> = ({ data }) => {
  const familiesWithRSPV = data.filter(d => !d.onlyInfo);
  const [tables] = useLoadTables();
  const totalMemberInvited = familiesWithRSPV.reduce(
    (acc, family) => acc + family.members.length,
    0
  );
  const membersYes = familiesWithRSPV.reduce<FamilyMember[]>(
    (acc, family) => [...acc, ...family.members.filter(m => m.rsvp === "yes")],
    []
  );
  const membersUnknown = familiesWithRSPV.reduce<FamilyMember[]>(
    (acc, family) => [
      ...acc,
      ...family.members.filter(m => m.rsvp === "unknown")
    ],
    []
  );
  const membersNo = familiesWithRSPV.reduce<FamilyMember[]>(
    (acc, family) => [...acc, ...family.members.filter(m => m.rsvp === "no")],
    []
  );
  const sidesStats = familiesWithRSPV.reduce(
    (acc, family) => {
      return {
        ...acc,
        mario:
          acc.mario +
          (family.side === "Alessio"
            ? family.members.filter(m => m.rsvp === "yes").length
            : 0),
        not_mario:
          acc.not_mario +
          (family.side === "Alessio"
            ? family.members.filter(m => m.rsvp === "no").length
            : 0),
        no_response_mario:
          acc.no_response_mario +
          (family.side === "Alessio"
            ? family.members.filter(m => !["no", "yes"].includes(m.rsvp)).length
            : 0),
        giulia:
          acc.giulia +
          (family.side === "Beatrice"
            ? family.members.filter(m => m.rsvp === "yes").length
            : 0),
        not_giulia:
          acc.not_giulia +
          (family.side === "Beatrice"
            ? family.members.filter(m => m.rsvp === "no").length
            : 0),

        no_response_giulia:
          acc.no_response_giulia +
          (family.side === "Beatrice"
            ? family.members.filter(m => !["no", "yes"].includes(m.rsvp)).length
            : 0)
      };
    },
    {
      alessio: 0,
      beatrice: 0,
      not_alessio: 0,
      not_beatrice: 0,
      no_response_alessio: 0,
      no_response_beatrice: 0
    }
  );
  const maleAndFemale = membersYes.reduce(
    (acc, member) => {
      if (member.isChild) {
        return { ...acc, children: acc["children"] + 1 };
      }
      if (member.infant) {
        return { ...acc, infant: acc["infant"] + 1 };
      }
      return {
        ...acc,
        male: acc["male"] + (member.sex === "male" ? 1 : 0),
        female: acc["female"] + (member.sex === "female" ? 1 : 0)
      };
    },
    { male: 0, female: 0, children: 0, infant: 0 }
  );
  return (
    <Paper sx={{ p: 1, my: 2, width: "90%" }}>
      <Grid container={true}>
        <Value
          value={
            <Stack>
              <Typography variant={"caption"}>
                totale: {totalMemberInvited}
              </Typography>
              <Typography
                variant={"caption"}
                color={"primary"}
                fontWeight={"bold"}
              >
                confermati: {membersYes.length}
              </Typography>
              <Typography variant={"caption"}>
                rifiuti: {membersNo.length}
              </Typography>
              <Typography variant={"caption"}>
                senza risposta: {membersUnknown.length}
              </Typography>
            </Stack>
          }
          label={"Inviati"}
        />

        <Value
          value={
            <Stack>
              <Typography variant={"caption"}>
                adulti: {maleAndFemale.male + maleAndFemale.female}
              </Typography>
              <Typography
                variant={"caption"}
                color={"primary"}
                fontWeight={"bold"}
              >
                bambini: {maleAndFemale.children}
              </Typography>
              <Typography
                variant={"caption"}
                color={"primary"}
                fontWeight={"bold"}
              >
                neonati: {maleAndFemale.infant}
              </Typography>
            </Stack>
          }
          label={"Statistiche confermati"}
        />
        <Value
          value={
            <Stack direction={"column"}>
              <Typography variant={"caption"}>
                totali:{" "}
                {sidesStats.alessio +
                  sidesStats.not_alessio +
                  sidesStats.no_response_alessio}
              </Typography>
              <Typography
                variant={"caption"}
                color={"primary"}
                fontWeight={"bold"}
              >
                percentuale ristorante:{" "}
                {(
                  (sidesStats.alessio /
                    (sidesStats.alessio + sidesStats.beatrice)) *
                  100
                ).toFixed(2)}
                %
              </Typography>
              <Typography variant={"caption"}>
                confermati: {sidesStats.alessio}
              </Typography>
              <Typography variant={"caption"}>
                rifiuti: {sidesStats.not_alessio}
              </Typography>
              <Typography variant={"caption"}>
                senza risposta: {sidesStats.no_response_alessio}
              </Typography>
            </Stack>
          }
          label={`Alessio`}
        />
        <Value
          value={
            <Stack direction={"column"}>
              <Typography variant={"caption"}>
                totali:{" "}
                {sidesStats.beatrice +
                  sidesStats.not_beatrice +
                  sidesStats.no_response_beatrice}
              </Typography>
              <Typography
                variant={"caption"}
                color={"primary"}
                fontWeight={"bold"}
              >
                percentuale ristorante:{" "}
                {(
                  (sidesStats.beatrice /
                    (sidesStats.alessio + sidesStats.beatrice)) *
                  100
                ).toFixed(2)}
                %
              </Typography>
              <Typography variant={"caption"}>
                confermati: {sidesStats.beatrice}
              </Typography>
              <Typography variant={"caption"}>
                rifiuti: {sidesStats.not_beatrice}
              </Typography>
              <Typography variant={"caption"}>
                senza risposta: {sidesStats.no_response_beatrice}
              </Typography>
            </Stack>
          }
          label={`Beatrice`}
        />
        <Value
          value={
            <Typography
              variant={"caption"}
              color={"primary"}
              fontWeight={"bold"}
            >
              {data.reduce((acc, family) => acc + (family.gift ?? 1), 0)}
            </Typography>
          }
          label={"Bomboniere"}
        />
        <Value
          value={
            <Stack>
              <Typography
                variant={"caption"}
                color={"primary"}
                fontWeight={"bold"}
              >
                totale{" "}
                {data.reduce((acc, family) => acc + (family.donation ?? 0), 0)}€
              </Typography>
              <Typography
                variant={"caption"}
                color={"primary"}
                fontWeight={"bold"}
              >
                Alessio{" "}
                {data
                  .filter(f => f.side === "alessio")
                  .reduce((acc, family) => acc + (family.donation ?? 0), 0)}
                €
              </Typography>
              <Typography
                variant={"caption"}
                color={"primary"}
                fontWeight={"bold"}
              >
                Beatrice{" "}
                {data
                  .filter(f => f.side === "beatrice")
                  .reduce((acc, family) => acc + (family.donation ?? 0), 0)}
                €
              </Typography>
            </Stack>
          }
          label={"Regali"}
        />
      </Grid>
      <Button
        variant={"contained"}
        onClick={() => {
          // force the browser to open save file dialog
          const blob = new Blob(
            [JSON.stringify({ families: data, tables: tables }, null, "\t")],
            {
              type: "application/json"
            }
          );
          const now = new Date();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `myWeddingDate-${now.getDate()}-${
              now.getMonth() + 1
            }-${now.getFullYear()}.json`
          );
          document.body.appendChild(link);
          link.click();
        }}
      >
        Backup
      </Button>
      <Button
        variant={"contained"}
        onClick={() => {
          console.log(
            jsonexport(
              data
                .filter(f => !!f.donation)
                .map(f => {
                  return {
                    cosa: f.family,
                    quanto: f.donation,
                    famiglia: f.side
                  };
                })
            ).then(console.log)
          );
        }}
      >
        TO CSV
      </Button>
    </Paper>
  );
};
