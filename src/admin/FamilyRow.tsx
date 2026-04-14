import {
  Alert,
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  Link,
  Snackbar,
  Stack,
  Switch,
  TableCell,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import React from "react";
import {
  FamilyData,
  getWhatsAppMessage,
  getWhatsAppMessageReminder
} from "../types/family";
import { useUpdateFamilyData } from "../hooks/useFamilyData";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { FamilyMembers } from "./FamilyMembers";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

type FamilyRowProps = {
  familyData: FamilyData;
  key: string;
};

export const FamilyRow: React.FC<FamilyRowProps> = ({ familyData }) => {
  const [localData, setLocalData] = React.useState(familyData);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const canUseClipboard = navigator?.clipboard !== undefined;
  const familyLink = `${window.location.origin}/${localData.id}`;
  const update = useUpdateFamilyData(localData.id);
  const [open, setOpen] = React.useState(false);
  const needReminder =
    !localData.onlyInfo &&
    localData.members.some(m => !["yes", "no"].includes(m.rsvp));

  return (
    <>
      <TableCell>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={1}
          key={familyLink}
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <RSVPStats data={localData} />
          {localData.note && <WarningAmberIcon color={"warning"} />}

          <Typography variant={"body2"}>
            <b style={{ color: "#0082e1" }}>{localData.family}</b>
          </Typography>
          {!canUseClipboard && (
            <Link target={"_blank"} href={familyLink} variant={"body2"}>
              link
            </Link>
          )}

          {canUseClipboard && !needReminder && (
            <IconButton
              size={"small"}
              sx={{ color: "text.secondary" }}
              onClick={() => {
                setOpenSnackbar(true);
                void navigator.clipboard.writeText(
                  getWhatsAppMessage(localData)
                );
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          )}

          {canUseClipboard && needReminder && (
            <IconButton
              size={"small"}
              sx={{ color: "text.secondary" }}
              onClick={() => {
                setOpenSnackbar(true);
                void navigator.clipboard.writeText(
                  getWhatsAppMessageReminder(localData)
                );
              }}
            >
              <NotificationsActiveOutlinedIcon color={"warning"} />
            </IconButton>
          )}

          <Typography variant={"caption"}>{familyData.id}</Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Switch
              checked={localData.onlyInfo}
              onChange={t => {
                const updatedFamilyData = {
                  ...localData,
                  onlyInfo: t.target.checked
                };
                void update(updatedFamilyData);
                setLocalData(updatedFamilyData);
              }}
              size={"small"}
            />
          }
          label={<Typography variant={"caption"}>solo info</Typography>}
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Checkbox
              checked={localData.linkSent}
              onChange={t => {
                const updatedFamilyData = {
                  ...localData,
                  linkSent: t.target.checked
                };
                void update(updatedFamilyData);
                setLocalData(updatedFamilyData);
              }}
              size={"small"}
            />
          }
          label={<Typography variant={"caption"}>invito inviato</Typography>}
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Checkbox
              checked={localData.reminderSent}
              onChange={t => {
                const updatedFamilyData = {
                  ...localData,
                  reminderSent: t.target.checked
                };
                void update(updatedFamilyData);
                setLocalData(updatedFamilyData);
              }}
              size={"small"}
            />
          }
          label={<Typography variant={"caption"}>reminder inviato</Typography>}
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Checkbox
              checked={localData.side === "Alessio"}
              onChange={t => {
                if (t.target.checked) {
                  const updatedFamilyData = {
                    ...localData,
                    side: "Alessio" as const
                  };
                  void update(updatedFamilyData);
                  setLocalData(updatedFamilyData);
                }
              }}
              size={"small"}
            />
          }
          label={<Typography variant={"caption"}>Alessio</Typography>}
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Checkbox
              checked={localData.side === "Beatrice"}
              onChange={t => {
                if (t.target.checked) {
                  const updatedFamilyData = {
                    ...localData,
                    side: "Beatrice" as const
                  };
                  void update(updatedFamilyData);
                  setLocalData(updatedFamilyData);
                }
              }}
              size={"small"}
            />
          }
          label={<Typography variant={"caption"}>Beatrice</Typography>}
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <TextField
              label={"Bomboniera"}
              style={{ width: 100 }}
              value={localData.gift ?? 1}
              onChange={t => {
                if (t.target.value) {
                  const updatedFamilyData = {
                    ...localData,
                    gift: Number(t.target.value)
                  };
                  void update(updatedFamilyData);
                  setLocalData(updatedFamilyData);
                }
              }}
              type={"number"}
              size={"small"}
            />
          }
          label=""
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <TextField
              label={"Regalo"}
              style={{ width: 100 }}
              value={localData.donation}
              onChange={t => {
                if (t.target.value) {
                  const updatedFamilyData = {
                    ...localData,
                    donation: Number(t.target.value)
                  };
                  void update(updatedFamilyData);
                  setLocalData(updatedFamilyData);
                }
              }}
              type={"number"}
              size={"small"}
            />
          }
          label=""
        />
      </TableCell>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="info" sx={{ width: "100%" }}>
          <Typography>Link copiato negli appunti</Typography>
        </Alert>
      </Snackbar>
      <TableRow>
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ m: 1 }}>
          <Box>
            <FamilyMembers data={familyData} key={`members_${familyData.id}`} />
          </Box>
          <Box>
            {localData.note && (
              <Typography
                variant={"caption"}
                textAlign={"center"}
                sx={{
                  p: 1,
                  backgroundColor: "white",
                  width: "fit-content",
                  borderRadius: 2
                }}
                color={"warning.main"}
              >
                NOTE: {localData.note}
              </Typography>
            )}
          </Box>
        </Collapse>
      </TableRow>
    </>
  );
};

const RSVPStats = ({ data }: { data: FamilyData }) => {
  if (data.onlyInfo) {
    return null;
  }
  const yesLength = data.members.filter(m => m.rsvp === "yes").length;
  const noLength = data.members.filter(m => m.rsvp === "no").length;
  const unknownLength = data.members.filter(m => m.rsvp === "unknown").length;
  return (
    <Stack direction={"row"} spacing={1} alignItems={"center"}>
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        {yesLength > 0 && <Typography>{yesLength}</Typography>}
        {yesLength > 0 && <CheckCircleIcon color={"success"} />}
      </Stack>
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        {noLength > 0 && <Typography>{noLength}</Typography>}
        {noLength > 0 && <CancelIcon color={"error"} />}
      </Stack>
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        {unknownLength > 0 && <Typography>{unknownLength}</Typography>}
        {unknownLength > 0 && <QuestionMarkIcon color={"disabled"} />}
      </Stack>
    </Stack>
  );
};
