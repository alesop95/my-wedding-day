import { SectionHeader } from "../common/SectionHeader";
import React from "react";
import { useTranslation } from "react-i18next";
import { SectionContainer } from "./SectionContainer";
import {
  Alert,
  Box,
  Button,
  Divider,
  Snackbar,
  Stack,
  TextareaAutosize,
  Typography
} from "@mui/material";
import {
  confirmDaysBefore,
  weddingDate
} from "../utils/constants";
import { useResponsiveDimensions } from "../hooks/useResponsiveDimensions";
import { FamilyData, FamilyMember } from "../types/family";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Checkbox from "@mui/material/Checkbox";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUpdateFamilyData } from "../hooks/useFamilyData";
import produce from "immer";
import ConfettiExplosion from "react-confetti-explosion";
import { WhatsAppWidget } from "../common/WhatsAppWidget";
import { YouHaveToConfirm } from "./YouHaveToConfirm";
import FmdBadIcon from "@mui/icons-material/FmdBad";

type RSVPSectionProps = {
  familyData: FamilyData;
};

type ConfirmMemberProps = {
  // when there is only one member, we don't want to show the name
  hideName?: boolean;
  isUpdating: boolean;
  member: FamilyMember;
  onMemberUpdate: (updatedMember: FamilyMember) => void;
};
const ConfirmMember: React.FC<ConfirmMemberProps> = ({
  member,
  onMemberUpdate,
  isUpdating,
  hideName = false
}) => {
  const { t } = useTranslation();
  const [isExploding, setIsExploding] = React.useState(false);
  const { containerWidth } = useResponsiveDimensions();
  const noRSVP = member.rsvp === "unknown";
  const handleRSVP = (rsvp: "yes" | "no") => {
    if (isUpdating || isExploding) {
      return;
    }
    onMemberUpdate({
      ...member,
      rsvp: rsvp === member.rsvp ? "unknown" : rsvp
    });
    if (rsvp === "yes" && member.rsvp !== "yes") {
      setIsExploding(true);
      setTimeout(() => {
        setIsExploding(false);
      }, 1000);
    }
  };
  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      spacing={1}
      sx={{ width: "100%" }}
    >
      <Stack direction={"row"} alignItems={"center"}>
        {noRSVP && <FmdBadIcon style={{ fontSize: 16, color: "#ff800088" }} />}
        {!hideName && (
          <Typography variant={"h4"} textAlign={"center"} sx={{ px: 1 }}>
            {member.firstName}
          </Typography>
        )}
      </Stack>

      <Stack direction={"column"} alignItems={"center"} spacing={1}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{
            width: "100%",
            backgroundColor: member.rsvp === "yes" ? "#aff6cd" : "#efefef",
            borderRadius: 2,
            pr: 2
          }}
          onClick={() => {
            handleRSVP("yes");
          }}
        >
          <Checkbox
            disabled={isUpdating}
            checked={member.rsvp === "yes"}
            checkedIcon={
              <CheckCircleIcon color={"success"} sx={{ fontSize: 16 }} />
            }
            icon={
              <CheckCircleOutlineIcon
                color={"disabled"}
                sx={{ fontSize: 16 }}
              />
            }
          />
          {isExploding && (
            <ConfettiExplosion
              width={containerWidth}
              particleCount={30}
              force={0.5}
              duration={3000}
            />
          )}
          <Typography
            sx={{ cursor: "pointer", flex: 1, bg: "red" }}
            variant={"h6"}
            className={"disable-text-selection"}
          >
            {isUpdating ? t("sections.rsvp.waiting") : t("sections.rsvp.willAttend")}
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          onClick={() => handleRSVP("no")}
          sx={{
            width: "100%",
            backgroundColor: member.rsvp === "no" ? "#fddad7" : "#efefef",
            borderRadius: 2,
            pr: 2
          }}
        >
          <Checkbox
            disabled={isUpdating}
            checked={member.rsvp === "no"}
            checkedIcon={<CancelIcon color={"error"} sx={{ fontSize: 16 }} />}
            icon={<HighlightOffIcon color={"disabled"} sx={{ fontSize: 16 }} />}
          />

          <Typography
            sx={{ cursor: "pointer" }}
            variant={"h6"}
            className={"disable-text-selection"}
          >
            {isUpdating ? t("sections.rsvp.waiting") : t("sections.rsvp.wontAttend")}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const RSVPSection: React.FC<RSVPSectionProps> = ({ familyData }) => {
  const { t } = useTranslation();
  const [updatedFamilyData, setUpdatedFamilyData] =
    React.useState<FamilyData>(familyData);
  const limitDate = new Date(weddingDate);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [note, setNotes] = React.useState("");
  const [isNoteOpen, setIsNoteOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  limitDate.setDate(limitDate.getDate() - confirmDaysBefore);
  const update = useUpdateFamilyData(familyData.id);
  return (
    <SectionContainer backgroundSvg="/backgrounds/bg-hotel.svg" overlayOpacity={0.6}>
      <Stack direction={"column"} alignItems={"center"} spacing={1}>
        <SectionHeader
          imgSrc={"../sections/rsvp.png"}
          altImage={t("sections.rsvp.altImage")}
          title={t("sections.rsvp.title")}
        />

        <Typography variant={"h4"} textAlign={"center"} sx={{ px: 1 }}>
          {t("sections.rsvp.description1")}
          <br />
          {t("sections.rsvp.description2")}
        </Typography>
        <Typography variant={"h4"} pb={2}>
          <b>{`${limitDate.getDate().toString().padStart(2, "0")}/${(
            limitDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${limitDate.getFullYear()}`}</b>
        </Typography>
        <Stack
          direction={"column"}
          alignItems={"center"}
          spacing={2}
          divider={<Divider sx={{ width: "100%" }} />}
        >
          {updatedFamilyData.members.map((member, idx) => (
            <ConfirmMember
              hideName={false}
              isUpdating={isUpdating}
              member={member}
              key={`confirm_${idx}`}
              onMemberUpdate={async member => {
                setIsUpdating(true);
                setError(null);
                try {
                  const members = produce(updatedFamilyData.members, draft => {
                    draft[idx] = member;
                    return draft;
                  });
                  const toUpdate = { ...updatedFamilyData, members };
                  await update(toUpdate);
                  setUpdatedFamilyData(toUpdate);
                } catch (err) {
                  console.error(t("sections.rsvp.updateError"), err);
                  setError(t("sections.rsvp.networkError"));
                } finally {
                  setIsUpdating(false);
                }
              }}
            />
          ))}
          <YouHaveToConfirm members={updatedFamilyData.members} />
          {error && (
            <Alert
              severity="error"
              sx={{ width: "100%", mt: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setError(null)}
                >
                  {t("sections.rsvp.ok")}
                </Button>
              }
            >
              {error}
            </Alert>
          )}
        </Stack>
        <Box
          display={"flex"}
          style={{
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 15
          }}
        >
          {!isNoteOpen && (
            <Typography
              onClick={() => {
                setIsNoteOpen(true);
                setNotes(updatedFamilyData.note);
              }}
              variant={"body1"}
              textAlign={"left"}
              sx={{
                p: 1,
                width: "80%",
                backgroundColor: "#f1f1f1",
                color: "#7e7e7e"
              }}
            >
              {updatedFamilyData.note || t("sections.rsvp.notePlaceholder")}
            </Typography>
          )}
          {isNoteOpen && (
            <TextareaAutosize
              autoFocus={true}
              aria-label="minimum height"
              minRows={2}
              onChange={({ target }) => setNotes(target.value)}
              value={note}
              style={{ width: "80%", padding: 2 }}
            />
          )}
          <Stack direction={"row"} sx={{ mt: 2 }} spacing={1}>
            <Button
              variant={"contained"}
              color={"inherit"}
              disabled={isUpdating || !isNoteOpen}
              onClick={async () => {
                setIsUpdating(true);
                setError(null);
                try {
                  const updateData = { ...updatedFamilyData, note };
                  await update(updateData);
                  setUpdatedFamilyData(updateData);
                  setNotes("");
                  setOpenSnackbar(true);
                  setIsNoteOpen(false);
                } catch (err) {
                  console.error(t("sections.rsvp.saveError"), err);
                  setError(t("sections.rsvp.networkError"));
                } finally {
                  setIsUpdating(false);
                }
              }}
            >
              {t("sections.rsvp.saveNotes")}
            </Button>
            <Button
              variant={"contained"}
              disabled={isUpdating || !isNoteOpen}
              color={"inherit"}
              onClick={() => {
                setNotes("");
                setIsNoteOpen(false);
              }}
            >
              {t("sections.rsvp.cancel")}
            </Button>
          </Stack>
        </Box>
        <Box
          display={"flex"}
          style={{
            width: "100%",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Divider sx={{ width: "80%", mt: 2, mb: 1 }} />
        </Box>
        <Box>
          <Stack direction={"column"} alignItems={"center"} spacing={1}>
            <Typography variant={"subtitle2"} textAlign={"center"} p={1}>
              {t("sections.rsvp.contactInfo")}
            </Typography>
            <WhatsAppWidget />
          </Stack>
        </Box>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="info" sx={{ width: "100%" }}>
          <Typography>{t("sections.rsvp.notesUpdated")}</Typography>
        </Alert>
      </Snackbar>
    </SectionContainer>
  );
};
