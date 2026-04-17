import { RestaurantTable } from "./type";
import { FamilyData, FamilyMember } from "../types/family";
import {
  Autocomplete,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useCallback, useContext, useMemo } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { reverse } from "fp-ts/Array";
import { RestaurantContext } from "./index";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

type Props = {
  tables: RestaurantTable[];
  families: FamilyData[];
  isPrinting: boolean;
  onMemberAdded: (
    member: MemberWithFamilyRef,
    table: RestaurantTable,
    note?: string
  ) => void;
  onMemberRemoved: (member: MemberWithFamilyRef) => void;
};
export const Tables: React.FC<Props> = ({
  tables,
  families,
  isPrinting,
  onMemberAdded,
  onMemberRemoved
}) => {
  const membersWithNoTable = useMemo(
    () =>
      families.reduce<MemberWithFamilyRef[]>(
        (acc, family) => [
          ...acc,
          ...family.members
            .filter(m => !m.table && m.rsvp !== "no")
            .map(m => ({
              ...m,
              family: family.family,
              familyId: family.id
            }))
        ],
        []
      ),
    [families]
  );

  const membersWithTable = useMemo(
    () =>
      families.reduce<MemberWithFamilyRef[]>(
        (acc, family) => [
          ...acc,
          ...family.members
            .filter(m => m.table !== undefined)
            .map(m => ({
              ...m,
              family: family.family,
              familyId: family.id
            }))
        ],
        []
      ),
    [families]
  );
  return (
    <Card sx={{ p: 2 }}>
      {!isPrinting && (
        <Stack
          sx={{
            border: "1px solid black",
            borderRadius: 6,
            width: "fit-content",
            p: 2,
            m: 1
          }}
        >
          <Typography>totale ai tavoli {membersWithTable.length}</Typography>
          <Typography>
            totale senza tavolo {membersWithNoTable.length}
          </Typography>
        </Stack>
      )}
      <Grid container xs={12} rowSpacing={2} columnSpacing={2}>
        <Grid item xs={12} md={4} sm={6}>
          <FixedTable members={["Mario", "Giulia"]} tableName={"Sposi"} />
        </Grid>
        <Grid item xs={12} md={4} sm={6}>
          <FixedTable
            members={[
              "Staff Foto-1",
              "Staff Foto-2",
              "Staff Foto-3",
              "Staff Band-1",
              "Staff Band-2",
              "Staff Band-3",
              "Staff Band-4",
              "Staff Band-5"
            ]}
            tableName={"Staff"}
          />
        </Grid>
        {reverse(tables).map(table => (
          <Grid item xs={12} md={4} sm={6} key={table.id}>
            <Table
              isPrinting={isPrinting}
              table={table}
              membersWithTable={membersWithTable}
              membersWithNoTable={membersWithNoTable}
              onMemberAdded={onMemberAdded}
              onMemberRemoved={onMemberRemoved}
            />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

type FixedTableProps = {
  members: string[];
  tableName: string;
};
const FixedTable: React.FC<FixedTableProps> = ({ members, tableName }) => {
  return (
    <Stack
      spacing={1}
      sx={{
        border: "1px solid #efefef",
        p: 1,
        borderRadius: 3,
        backgroundColor: "#efefef"
      }}
    >
      <Typography variant={"h5"} fontWeight={"bold"}>
        {tableName} ({members.length})
      </Typography>
      <Divider sx={{ borderWidth: 2 }} />
      <Stack spacing={1}>
        {members.map(member => (
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={1}
            key={`${member}${tableName}`}
          >
            <Typography>{member}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export type MemberWithFamilyRef = FamilyMember & {
  family: string;
  familyId: string;
};
type TableProps = {
  isPrinting: boolean;
  onMemberAdded: (
    member: MemberWithFamilyRef,
    table: RestaurantTable,
    note?: string
  ) => void;
  onMemberRemoved: (member: MemberWithFamilyRef) => void;
  table: RestaurantTable;
  membersWithTable: MemberWithFamilyRef[];
  membersWithNoTable: MemberWithFamilyRef[];
};
const Table: React.FC<TableProps> = ({
  isPrinting,
  table,
  membersWithTable,
  membersWithNoTable,
  onMemberAdded,
  onMemberRemoved
}) => {
  const { isLoading } = useContext(RestaurantContext);
  const [selectedMember, setSelectedMember] = React.useState<
    MemberWithFamilyRef | undefined
  >();
  const [note, setNote] = React.useState<string | undefined>();
  const members = useMemo(
    () =>
      membersWithTable
        .filter(member => member.table?.tableId === table.id)
        .reduce<Record<string, MemberWithFamilyRef[]>>((acc, member) => {
          return {
            ...acc,
            [member.familyId]: [...(acc[member.familyId] ?? []), member]
          };
        }, {}),
    [membersWithTable, table.id]
  );

  const totalMembers = useMemo(
    () =>
      membersWithTable.filter(member => member.table?.tableId === table.id)
        .length,
    [membersWithTable, table.id]
  );

  const getMemberDisplayName = useCallback((m: MemberWithFamilyRef) => {
    return `(${m.family}) ${m.firstName}${m.lastName ? " " + m.lastName : ""}`;
  }, []);

  return (
    <Stack
      spacing={1}
      sx={{
        border: "1px solid #efefef",
        p: 1,
        borderRadius: 3,
        backgroundColor: "#efefef"
      }}
    >
      <Typography variant={"h5"} fontWeight={"bold"}>
        {table.name.toUpperCase()} ({totalMembers})
      </Typography>
      <Divider sx={{ borderWidth: 2 }} />
      <Stack spacing={1}>
        {table.id === "XVRY" && (
          <fieldset>
            <legend>{"STAFF"}</legend>
            <Typography>{"Babysitter"}</Typography>
          </fieldset>
        )}
        {isPrinting &&
          Object.entries(members).map(([_, members]) =>
            members.map(member => (
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                key={`${member.familyId}${member.firstName}`}
              >
                {!member.lastName && (
                  <Tooltip title={"manca il cognome"}>
                    <PriorityHighIcon color={"warning"} fontSize={"small"} />
                  </Tooltip>
                )}
                <Typography>
                  {member.firstName} {member.lastName}
                </Typography>
                {member.table?.note && (
                  <Chip
                    variant={"outlined"}
                    size={"small"}
                    color={"primary"}
                    label={member.table.note}
                  />
                )}
                {!isPrinting && (
                  <IconButton
                    onClick={() => onMemberRemoved(member)}
                    disabled={isLoading}
                  >
                    <DeleteOutlineIcon color={"error"} fontSize={"small"} />
                  </IconButton>
                )}
              </Stack>
            ))
          )}
        {!isPrinting &&
          Object.entries(members).map(([_, members]) => (
            <fieldset>
              <legend>{members[0].family}</legend>
              {members.map(member => (
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  spacing={1}
                  key={`${member.familyId}${member.firstName}`}
                >
                  {!member.lastName && (
                    <Tooltip title={"manca il cognome"}>
                      <PriorityHighIcon color={"warning"} fontSize={"small"} />
                    </Tooltip>
                  )}
                  <Typography>
                    {member.firstName} {member.lastName}
                  </Typography>
                  {member.table?.note && (
                    <Chip
                      variant={"outlined"}
                      size={"small"}
                      color={"primary"}
                      label={member.table.note}
                    />
                  )}
                  {!isPrinting && (
                    <IconButton
                      onClick={() => onMemberRemoved(member)}
                      disabled={isLoading}
                    >
                      <DeleteOutlineIcon color={"error"} fontSize={"small"} />
                    </IconButton>
                  )}
                </Stack>
              ))}
            </fieldset>
          ))}
      </Stack>
      {!isPrinting && membersWithNoTable.length > 0 && (
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Autocomplete<MemberWithFamilyRef>
            disabled={isLoading}
            id="grouped-demo"
            options={membersWithNoTable.sort((a, b) =>
              getMemberDisplayName(a).localeCompare(getMemberDisplayName(b))
            )}
            groupBy={option => `${option.familyId} - ${option.family}`}
            getOptionLabel={member => `${member.firstName} ${member.lastName}`}
            sx={{ width: 300 }}
            renderInput={params => (
              <TextField {...params} label="aggiungi invitato" />
            )}
            onChange={(_, value) => {
              if (!value) {
                setSelectedMember(undefined);
                return;
              }
              setSelectedMember(value);
            }}
          />
          {selectedMember && (
            <TextField
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={"note"}
            />
          )}
          <Button
            size={"small"}
            disabled={!selectedMember || isLoading}
            onClick={() => {
              if (selectedMember) {
                onMemberAdded(selectedMember, table, note);
              }
            }}
          >
            aggiungi
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
