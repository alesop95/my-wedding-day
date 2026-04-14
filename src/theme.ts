import { ThemeOptions } from "@mui/material/styles";
import { function as F } from "fp-ts";
import { createTheme, responsiveFontSizes } from "@mui/material";
export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    divider: "#d5d5d577",
    primary: {
      main: "#3f51b5"
    },
    secondary: {
      main: "#f50057"
    }
  },
  typography: {
    fontFamily: "Dosis"
  }
};

const theme = F.pipe(createTheme(themeOptions), responsiveFontSizes);
export default theme;
