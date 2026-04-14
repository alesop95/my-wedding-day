import {
  Button,
  Card,
  Chip,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import React, { useMemo } from "react";
import { generateId } from "../utils/family";
import { RestaurantTable } from "./type";

type Props = {
  onNewTable: (table: RestaurantTable) => void;
  errorMessage?: string;
};
export const CreateNewTable: React.FC<Props> = ({
  onNewTable,
  errorMessage
}) => {
  const tableId = useMemo(() => generateId(), []);
  const [tableName, setTableName] = React.useState<string>("");
  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Chip label={tableId} variant={"outlined"} color={"primary"} />
        <TextField
          label={"Nome tavolo"}
          placeholder={"nome tavolo"}
          variant={"outlined"}
          value={tableName}
          onChange={({ target }) => setTableName(target.value)}
        />
        <Button
          variant={"contained"}
          disabled={!tableName}
          onClick={() => onNewTable({ name: tableName, id: tableId })}
        >
          salva
        </Button>
        {errorMessage && (
          <Typography color={"error"}>{errorMessage}</Typography>
        )}
      </Stack>
    </Card>
  );
};
