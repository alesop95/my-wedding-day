import {
  Box,
  createTheme,
  Paper,
  responsiveFontSizes,
  Table,
  TableBody,
  TableContainer,
  ThemeProvider
} from "@mui/material";
import React, { useEffect } from "react";
import { useAdminData } from "../hooks/useAdmin";
import { ThemeOptions } from "@mui/material/styles";
import { function as F } from "fp-ts";
import { FamilyRow } from "./FamilyRow";
import { AddFamily } from "./AddFamily";
import { FamilyData } from "../types/family";
import { Report } from "./Report";

export const themeOptions: ThemeOptions = {
  palette: {
    divider: "#d5d5d577",
    primary: {
      main: "#3f51b5"
    },
    secondary: {
      main: "#f50057"
    }
  }
};
const theme = F.pipe(createTheme(themeOptions), responsiveFontSizes);

export const Admin = () => {
  const [familyData, setFamilyData] = React.useState<FamilyData[] | null>(null);
  const [data] = useAdminData();

  useEffect(() => {
    if (data) {
      setFamilyData(data);
    }
  }, [data]);

  if (!familyData) {
    return null;
  }
  return (
    <ThemeProvider theme={theme}>
      <Box
        display={"flex"}
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: 10,
          marginTop: 10
        }}
      >
        <Report data={familyData} />
        <AddFamily
          currentIds={new Set(familyData.map(p => p.id))}
          onFamilyAdded={newFamily => {
            setFamilyData([newFamily, ...familyData]);
          }}
        />

        <Box display={"flex"} style={{ width: "90%" }}>
          <TableContainer component={Paper} sx={{ m: 2 }}>
            <Table size={"small"}>
              <TableBody>
                {familyData
                  .sort((a, b) => a.family.localeCompare(b.family))
                  .map(p => (
                    <FamilyRow familyData={p} key={`family_${p.id}`} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
