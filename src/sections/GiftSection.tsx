import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Slide,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import React, { useCallback, useRef } from "react";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";
import {
  bank,
  tripDescription1,
  tripDescription2
} from "../utils/constants";
import { useResponsiveDimensions } from "../hooks/useResponsiveDimensions";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ConfettiExplosion from "react-confetti-explosion";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import aroundTheWorldAnimation from "../animation/128-around-the-world.json";
import japanAnimation from "../animation/japan.json";

type BankDetailProps = {
  header: string;
  value: string;
};
const BankDetail: React.FC<BankDetailProps> = ({ header, value }) => {
  const canUseClipboard = navigator?.clipboard !== undefined;
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  return (
    <>
      <TableRow>
        <TableCell colSpan={2}>
          <Typography fontFamily={"Monospace"} textAlign={"left"}>
            <b>{header}</b>
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography fontFamily={"Monospace"} textAlign={"left"}>
            {value}
          </Typography>
        </TableCell>
        {canUseClipboard && (
          <TableCell align={"left"}>
            <IconButton
              style={{ color: "black" }}
              onClick={() => {
                void navigator.clipboard.writeText(value);
                setOpenSnackbar(true);
              }}
            >
              <ContentCopyIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </TableCell>
        )}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            severity="info"
            sx={{ width: "100%", backgroundColor: "#14c4e1", color: "white" }}
          >
            <Typography>Copiato negli appunti</Typography>
          </Alert>
        </Snackbar>
      </TableRow>
    </>
  );
};

export const GiftSection: React.FC = () => {
  const [showFlag, setShowFlag] = React.useState(false);
  const [showBankDetails, setShowBankDetails] = React.useState(false);
  const containerRef = React.useRef(null);
  const { aroundTheWorldAnimationWidth, containerWidth } = useResponsiveDimensions();

  const [isExploding, setIsExploding] = React.useState(false);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const explode = useCallback(() => {
    if (isExploding) {
      return;
    }
    setIsExploding(true);
    setShowFlag(true);
    setTimeout(() => {
      lottieRef.current?.play();
      setIsExploding(false);
    }, 1000);
  }, [isExploding]);

  return (
    <SectionContainer>
      <Stack direction={"column"} alignItems={"center"} spacing={0}>
        <SectionHeader
          imgSrc={"../sections/car.png"}
          altImage={"chiesa"}
          title={"Lista nozze"}
        />

        <Typography variant={"h4"} textAlign={"center"} sx={{ p: 1, pb: 4 }}>
          {tripDescription1}
          <br />
          {tripDescription2}
        </Typography>

        <Box
          width={aroundTheWorldAnimationWidth}
          height={aroundTheWorldAnimationWidth}
        >
          {!showBankDetails ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={aroundTheWorldAnimation}
              loop={true}
              autoplay={true}
            />
          ) : (
            <Lottie
              lottieRef={lottieRef}
              animationData={japanAnimation}
              loop={true}
              autoplay={true}
            />
          )}
        </Box>

        <Stack direction={"column"} spacing={1} sx={{ width: "100%" }}>
          <Stack alignItems={"center"} justifyItems={"center"}>
            <Button
              onClick={() => {
                setShowBankDetails(pv => !pv);
                if (!showBankDetails) {
                  explode();
                }
              }}
              sx={{
                backgroundColor: "#87f395aa",
                color: "#646262",
                ":hover": {
                  bgcolor: "rgba(176,248,183,0.67)", // theme.palette.primary.main
                  color: "#343434"
                }
              }}
              variant={"contained"}
              size={"large"}
            >
              LISTA NOZZE
            </Button>
            {isExploding && (
              <ConfettiExplosion
                width={containerWidth}
                particleCount={70}
                force={0.3}
                duration={3000}
              />
            )}
          </Stack>
          <Box ref={containerRef}>
            <Slide
              mountOnEnter={true}
              unmountOnExit={true}
              direction="up"
              in={showBankDetails}
              container={containerRef.current}
            >
              <Table size={"small"}>
                <TableBody>
                  <BankDetail header={"INTESTATARIO"} value={bank.owner} />
                  <BankDetail header={"IBAN"} value={bank.iban} />
                  <BankDetail header={"BIC/SEPA"} value={bank.bicSwift} />
                  {/* <BankDetail header={"NUMERO CONTO"} value={bank.number} /> */}
                </TableBody>
              </Table>
            </Slide>
          </Box>
        </Stack>
      </Stack>
    </SectionContainer>
  );
};
