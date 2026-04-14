import { Box, CircularProgress, Grid } from "@mui/material";
import { CreateNewTable } from "./CreateNewTable";
import { RestaurantTable } from "./type";
import {
  isPrinting,
  useLoadTables,
  useUpdateTables
} from "../hooks/useRestaurant";
import { MemberWithFamilyRef, Tables } from "./Tables";
import React, { createContext } from "react";
import { useUpdateFamilyDataEnhanced } from "../hooks/useFamilyData";

type RestaurantContextT = {
  isLoading: boolean;
};
export const RestaurantContext = createContext<RestaurantContextT>({
  isLoading: false
});
export const Restaurant = () => {
  const updateTables = useUpdateTables();
  const [tables, families, fetchTables] = useLoadTables();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const updateFamilyData = useUpdateFamilyDataEnhanced();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();
  const familiesInvited = families?.filter(f => !f.onlyInfo) || [];
  const handleNewTable = async (newTable: RestaurantTable) => {
    if (tables?.some(t => t.id === newTable.id)) {
      setErrorMessage("Il tavolo esiste già");
      return;
    }
    await updateTables([...(tables || []), newTable]);
    fetchTables();
  };

  const handleOnMemberAdded = async (
    member: MemberWithFamilyRef,
    table: RestaurantTable,
    note?: string
  ) => {
    const family = families?.find(f => member.familyId === f.id);
    if (!family) {
      return;
    }
    setIsLoading(true);
    const members =
      family?.members.filter(m => m.firstName !== member.firstName) || [];
    const updateMembers = [
      ...members,
      {
        ...member,
        table: {
          tableId: table.id,
          note: note ?? null
        }
      }
    ];
    await updateFamilyData(member.familyId)({
      ...family,
      members: updateMembers
    });
    fetchTables();
    setIsLoading(false);
  };

  const handleOnMemberRemoved = async (member: MemberWithFamilyRef) => {
    const family = families?.find(f => member.familyId === f.id);
    if (!family) {
      return;
    }
    setIsLoading(true);
    const members =
      family?.members.filter(m => m.firstName !== member.firstName) || [];
    const updateMembers = [
      ...members,
      {
        ...member,
        table: null
      }
    ];
    await updateFamilyData(member.familyId)({
      ...family,
      members: updateMembers
    });

    fetchTables();
    setIsLoading(false);
  };

  return (
    <RestaurantContext.Provider value={{ isLoading }}>
      <Grid container xs={12} p={2} columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          {(!tables || !families) && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flex: 1,
                flexDirection: "column"
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {tables && (
            <Tables
              tables={tables}
              families={familiesInvited}
              onMemberAdded={handleOnMemberAdded}
              onMemberRemoved={handleOnMemberRemoved}
            />
          )}
        </Grid>
        {!isPrinting && (
          <Grid item xs={3}>
            <CreateNewTable
              onNewTable={handleNewTable}
              errorMessage={errorMessage}
            />
          </Grid>
        )}
      </Grid>
    </RestaurantContext.Provider>
  );
};
