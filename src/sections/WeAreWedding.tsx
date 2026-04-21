import { CardContent, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import {
  easterEggAtom,
  easterEggClickCounterAtom
} from "../state/easterEggAtom";
import { easterEggActivationClicks } from "../utils/constants";

const WeAreWedding: React.FC = () => {
  const { t } = useTranslation();
  const [easterEgg, setEasterEgg] = useAtom(easterEggAtom);
  const [tapCounter, setTapCounter] = useAtom(easterEggClickCounterAtom);
  useEffect(() => {
    if (!easterEgg && tapCounter === easterEggActivationClicks) {
      setEasterEgg(true);
      setTapCounter(0);
    }
  }, [easterEgg, setEasterEgg, setTapCounter, tapCounter]);
  return (
    <CardContent>
      <Typography
        className={"disable-text-selection"}
        variant={"h1"}
        textAlign={"center"}
        fontFamily={"Gwendolyn"}
        onClick={() => {
          setTapCounter(s => s + 1);
        }}
      >
        {t("header.title")}
      </Typography>
      <Typography variant={"h2"} textAlign={"center"} fontFamily={"Gwendolyn"}>
        {t("header.married")}
      </Typography>
      <Typography variant={"h2"} textAlign={"center"} fontFamily={"Gwendolyn"}>
        {t("header.subtitle")}
      </Typography>
    </CardContent>
  );
};

export default WeAreWedding;
