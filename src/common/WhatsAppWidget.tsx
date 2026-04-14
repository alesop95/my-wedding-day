import React from "react";
import {
  Avatar,
  Badge,
  Card,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";

type WhatsAppItemProps = {
  name: string;
  number: string;
  message: string;
  image: string;
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: -0.3,
      left: -0.3,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "0.5px solid currentColor",
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.0)",
      opacity: 0
    }
  }
}));

const URL = "https://wa.me";
const WhatsAppItem: React.FC<WhatsAppItemProps> = ({
  name,
  number,
  message,
  image
}) => {
  const handleOnClick = () => {
    const numberClean = number.replace(/[^\w\s]/gi, "").replace(/ /g, "");
    const url = `${URL}/${numberClean}?text=${encodeURI(message)}`;
    window.open(url);
  };
  return (
    <Card
      onClick={handleOnClick}
      sx={{ p: 0.5, backgroundColor: "rgba(252,252,252,0.8)", color: "black" }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar src={image} sizes={"md"} />
        </StyledBadge>
        <Stack direction={"column"} sx={{ px: 1 }}>
          <Typography variant={"subtitle2"}>{name}</Typography>
          <Typography variant={"caption"}>{number}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export const WhatsAppWidget = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={1}>
      <WhatsAppItem
        name={"Beatrice"}
        number={"+393331983242"}
        message={""}
        image={"./header/giulia.svg"}
      />
      <WhatsAppItem
        name={"Alessio"}
        number={"+393201950043"}
        message={""}
        image={"./header/mario.svg"}
      />
    </Stack>
  );
};
