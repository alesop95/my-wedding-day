import { Box, Divider as MUIDivider } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
export const Divider = () => (
  <Box
    display={"flex"}
    mt={{ sm: 2, xs: 2 }}
    mb={{ sm: 2, xs: 2 }}
    style={{
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <MUIDivider style={{ width: "96%" }}>
      <FavoriteIcon style={{ fontSize: 10, color: "#ff000066" }} />
    </MUIDivider>
  </Box>
);
