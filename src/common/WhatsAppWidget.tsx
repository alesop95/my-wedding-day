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
import { useContactsConfig } from "../hooks/useContactsConfig";

type WhatsAppItemProps = {
  name: string;
  number: string;
  message: string;
  image: string;
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.main,
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
  const theme = useTheme();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOnClick();
    }
  };

  const handleOnClick = () => {
    try {
      const numberClean = number.replace(/[^\w\s]/gi, "").replace(/ /g, "");

      if (!numberClean) {
        console.error("Invalid phone number provided");
        return;
      }

      const url = `${URL}/${numberClean}?text=${encodeURIComponent(message)}`;
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

      if (!newWindow) {
        console.error("Failed to open WhatsApp. Popup may be blocked.");
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
    }
  };
  return (
    <Card
      onClick={handleOnClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Contatta ${name} su WhatsApp`}
      sx={{
        p: 0.5,
        backgroundColor: "background.paper",
        color: "text.primary",
        cursor: "pointer",
        "&:focus": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: "2px"
        }
      }}
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
  const { contacts, loading, error } = useContactsConfig();

  if (loading) return null; // Don't show anything while loading
  if (error || contacts.length === 0) return null; // Don't show if error or no contacts

  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={1}>
      {contacts.map((contact, index) => (
        <WhatsAppItem
          key={`${contact.name}-${index}`}
          name={contact.name}
          number={contact.number}
          message={contact.message}
          image={contact.image}
        />
      ))}
    </Stack>
  );
};
