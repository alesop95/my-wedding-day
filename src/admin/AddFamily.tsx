import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import React, { useCallback } from "react";
import { produce } from "immer";
import { FamilyData, FamilyMember } from "../types/family";
import { generateId } from "../utils/family";
import { useAddFamilyData } from "../hooks/useFamilyData";
import ErrorIcon from "@mui/icons-material/Error";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutline";

type AddFamilyProps = {
  onFamilyAdded: (familyData: FamilyData) => void;
  currentIds: Set<string>;
};

export const AddFamily: React.FC<AddFamilyProps> = ({
  onFamilyAdded,
  currentIds
}) => {
  const [familyData, setFamilyData] = React.useState<FamilyData>({
    id: generateId(),
    family: "",
    members: [],
    linkSent: false,
    onlyInfo: false,
    note: ""
  });
  const reset = useCallback(() => {
    setFamilyData({
      id: generateId(),
      family: "",
      members: [],
      linkSent: false,
      onlyInfo: false,
      note: ""
    });
  }, []);
  const save = useAddFamilyData();
  return (
    <Card sx={{ width: "70%", p: 2 }}>
      <Stack direction={"column"} spacing={1}>
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <TextField
            label={"Nome famiglia"}
            value={familyData.family}
            onChange={({ target }) => {
              setFamilyData({ ...familyData, family: target.value });
            }}
          />
          <Stack alignItems={"center"} direction={"row"} spacing={1}>
            <Typography fontFamily={"Monospace"}>{familyData.id}</Typography>
            {currentIds.has(familyData.id) && <ErrorIcon color={"error"} />}
          </Stack>
        </Stack>
        <FormControlLabel
          control={
            <Switch
              checked={familyData.onlyInfo}
              onChange={({ target }) => {
                setFamilyData({ ...familyData, onlyInfo: target.checked });
              }}
              size={"small"}
            />
          }
          label="solo info"
        />
        {familyData.members.map((member, idx) => {
          const memberKey = `${member.firstName}_${member.lastName}_${member.sex}_${idx}`;
          return (
            <Stack direction={"row"} spacing={1} key={memberKey}>
              <IconButton
                onClick={() => {
                  setFamilyData(produce(draft => {
                    draft.members.splice(idx, 1);
                  }));
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                label={"Nome"}
                value={member.firstName}
                onChange={({ target }) => {
                  setFamilyData(produce(draft => {
                    draft.members[idx].firstName = target.value;
                  }));
                }}
                style={{ flex: 1 }}
              />
              <TextField
                label={"Cognome"}
                value={member.lastName}
                style={{ flex: 1 }}
                onChange={({ target }) => {
                  setFamilyData(produce(draft => {
                    draft.members[idx].lastName = target.value;
                  }));
                }}
              />
              <FormControl fullWidth style={{ flex: 1 }}>
                <InputLabel id="demo-simple-select-label">Genere</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={member.sex}
                  onChange={({ target }) => {
                    setFamilyData(produce(draft => {
                      draft.members[idx].sex = target.value as FamilyMember["sex"];
                    }));
                  }}
                  label="Sex"
                >
                  <MenuItem value={"male"}>Maschio</MenuItem>
                  <MenuItem value={"female"}>Femmina</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={member.isChild}
                    size={"small"}
                    onChange={({ target }) => {
                      setFamilyData(produce(draft => {
                        draft.members[idx].isChild = target.checked;
                      }));
                    }}
                  />
                }
                label="bambino"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={member.recipient}
                    onChange={({ target }) => {
                      setFamilyData(produce(draft => {
                        draft.members[idx].recipient = target.checked;
                      }));
                    }}
                    size={"small"}
                  />
                }
                label="capo famiglia"
              />
            </Stack>
          );
        })}
        <Button
          variant={"contained"}
          style={{ width: "fit-content" }}
          color={"info"}
          onClick={() => {
            setFamilyData(produce(draft => {
              draft.members.push({
                firstName: "",
                lastName: "",
                isChild: false,
                recipient: false,
                sex: "male",
                rsvp: "unknown"
              });
            }));
          }}
        >
          + aggiungi membro famiglia
        </Button>
        <Button
          disabled={familyData.members.length === 0}
          variant={"contained"}
          style={{ width: "fit-content" }}
          onClick={async () => {
            await save(familyData);
            onFamilyAdded(familyData);
            reset();
          }}
        >
          salva famiglia
        </Button>
      </Stack>
    </Card>
  );
};
