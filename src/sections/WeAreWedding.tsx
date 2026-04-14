import { CardContent, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAtom } from "jotai";
import {
  easterEggAtom,
  easterEggClickCounterAtom
} from "../state/easterEggAtom";
import { easterEggActivationClicks } from "../utils/constants";

const WeAreWedding: React.FC = () => {
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
        Alessio & Beatrice
      </Typography>
      <Typography variant={"h2"} textAlign={"center"} fontFamily={"Gwendolyn"}>
        sposi
      </Typography>
      <Typography variant={"h2"} textAlign={"center"} fontFamily={"Gwendolyn"}>
        24 Luglio 2027
      </Typography>
    </CardContent>
  );
};

export default WeAreWedding;
