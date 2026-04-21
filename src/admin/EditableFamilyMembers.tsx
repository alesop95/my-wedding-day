import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Paper
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { FamilyData, FamilyMember } from "../types/family";
import { useUpdateFamilyData } from "../hooks/useFamilyData";

type EditableFamilyMembersProps = {
  data: FamilyData;
  onDataUpdate?: (updatedData: FamilyData) => void;
};

type EditingMember = FamilyMember & {
  isEditing: boolean;
  originalData: FamilyMember;
};

export const EditableFamilyMembers: React.FC<EditableFamilyMembersProps> = ({
  data,
  onDataUpdate
}) => {
  const update = useUpdateFamilyData(data.id);
  const [editingMembers, setEditingMembers] = useState<EditingMember[]>(
    data.members.map(member => ({
      ...member,
      isEditing: false,
      originalData: { ...member }
    }))
  );

  const [newAllergy, setNewAllergy] = useState<{ [memberIndex: number]: string }>({});

  const startEditing = (index: number) => {
    setEditingMembers(prev =>
      prev.map((member, i) =>
        i === index
          ? { ...member, isEditing: true, originalData: { ...member } }
          : member
      )
    );
  };

  const cancelEditing = (index: number) => {
    setEditingMembers(prev =>
      prev.map((member, i) =>
        i === index
          ? { ...member.originalData, isEditing: false, originalData: member.originalData }
          : member
      )
    );
  };

  const saveChanges = async (index: number) => {
    const updatedMembers = editingMembers.map((member, i) =>
      i === index ? { ...member, isEditing: false } : member
    );

    const updatedFamilyData = {
      ...data,
      members: updatedMembers.map(({ isEditing, originalData, ...member }) => member)
    };

    try {
      await update(updatedFamilyData);
      setEditingMembers(updatedMembers);
      onDataUpdate?.(updatedFamilyData);
    } catch (error) {
      console.error("Error updating member:", error);
      // Reset to original data on error
      cancelEditing(index);
    }
  };

  const updateMemberField = (
    index: number,
    field: keyof FamilyMember,
    value: any
  ) => {
    setEditingMembers(prev =>
      prev.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  };

  const addAllergy = (memberIndex: number) => {
    const allergy = newAllergy[memberIndex]?.trim();
    if (!allergy) return;

    const currentAllergies = editingMembers[memberIndex].allergies || [];
    if (!currentAllergies.includes(allergy)) {
      updateMemberField(memberIndex, "allergies", [...currentAllergies, allergy]);
    }
    setNewAllergy(prev => ({ ...prev, [memberIndex]: "" }));
  };

  const removeAllergy = (memberIndex: number, allergyToRemove: string) => {
    const currentAllergies = editingMembers[memberIndex].allergies || [];
    updateMemberField(
      memberIndex,
      "allergies",
      currentAllergies.filter(a => a !== allergyToRemove)
    );
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 2,
        maxWidth: '100%',
        overflow: 'auto'
      }}
    >
      <Table size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 150 }}>Nome & Status</TableCell>
            <TableCell sx={{ minWidth: 100 }}>RSVP</TableCell>
            <TableCell sx={{ minWidth: 200 }}>Allergie</TableCell>
            <TableCell sx={{ minWidth: 150 }}>Note Alimentari</TableCell>
            <TableCell sx={{ minWidth: 130 }}>Cocktail</TableCell>
            <TableCell sx={{ minWidth: 80 }}>Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {editingMembers.map((member, index) => (
            <TableRow key={index}>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {member.firstName} {member.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {member.isChild && "bambino • "}
                    {member.infant && "neonato • "}
                    {member.rsvp === "yes" && "✅ Confermato"}
                    {member.rsvp === "no" && "❌ Rifiutato"}
                    {member.rsvp === "maybe" && "❓ Forse"}
                    {member.rsvp === "unknown" && "⏳ In attesa"}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {member.isEditing ? (
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={member.rsvp}
                      onChange={(e) => updateMemberField(index, "rsvp", e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="unknown">⏳ In attesa</MenuItem>
                      <MenuItem value="yes">✅ Confermato</MenuItem>
                      <MenuItem value="no">❌ Rifiutato</MenuItem>
                      <MenuItem value="maybe">❓ Forse</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body2" textAlign="center">
                    {member.rsvp === "yes" ? "✅" :
                     member.rsvp === "no" ? "❌" :
                     member.rsvp === "maybe" ? "❓" : "⏳"}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {member.isEditing ? (
                  <Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                      {(member.allergies || []).map((allergy, allergyIndex) => (
                        <Chip
                          key={allergyIndex}
                          label={allergy}
                          size="small"
                          color="error"
                          variant="outlined"
                          onDelete={() => removeAllergy(index, allergy)}
                        />
                      ))}
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Allergia</InputLabel>
                        <Select
                          value={newAllergy[index] || ""}
                          onChange={(e) => setNewAllergy(prev => ({ ...prev, [index]: e.target.value }))}
                          label="Allergia"
                        >
                          <MenuItem value="Glutine">Glutine</MenuItem>
                          <MenuItem value="Lattosio">Lattosio</MenuItem>
                          <MenuItem value="Frutta a guscio">Frutta a guscio</MenuItem>
                          <MenuItem value="Uova">Uova</MenuItem>
                          <MenuItem value="Pesce">Pesce</MenuItem>
                          <MenuItem value="Crostacei">Crostacei</MenuItem>
                          <MenuItem value="Soia">Soia</MenuItem>
                          <MenuItem value="Sesamo">Sesamo</MenuItem>
                          <MenuItem value="Sedano">Sedano</MenuItem>
                          <MenuItem value="Senape">Senape</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        placeholder="Altra allergia..."
                        value={newAllergy[index] || ""}
                        onChange={(e) => setNewAllergy(prev => ({ ...prev, [index]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && addAllergy(index)}
                        sx={{ minWidth: 120 }}
                      />
                      <IconButton size="small" onClick={() => addAllergy(index)}>
                        <AddIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(member.allergies || []).length > 0 ? (
                      member.allergies!.map((allergy, i) => (
                        <Chip
                          key={i}
                          label={allergy}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Nessuna
                      </Typography>
                    )}
                  </Stack>
                )}
              </TableCell>
              <TableCell>
                {member.isEditing ? (
                  <TextField
                    size="small"
                    multiline
                    rows={2}
                    placeholder="Es: vegetariano, vegano, senza glutine..."
                    value={member.dietaryNotes || ""}
                    onChange={(e) => updateMemberField(index, "dietaryNotes", e.target.value)}
                    fullWidth
                  />
                ) : (
                  <Typography variant="body2">
                    {member.dietaryNotes || "-"}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {member.isEditing ? (
                  <FormControl fullWidth size="small">
                    <InputLabel>Cocktail</InputLabel>
                    <Select
                      value={member.drinkPreference || ""}
                      onChange={(e) => updateMemberField(index, "drinkPreference", e.target.value)}
                      label="Cocktail"
                    >
                      <MenuItem value="">Nessuna preferenza</MenuItem>
                      <MenuItem value="Spritz">Spritz</MenuItem>
                      <MenuItem value="Gin Tonic">Gin Tonic</MenuItem>
                      <MenuItem value="Negroni">Negroni</MenuItem>
                      <MenuItem value="Mojito">Mojito</MenuItem>
                      <MenuItem value="Aperol">Aperol</MenuItem>
                      <MenuItem value="Prosecco">Prosecco</MenuItem>
                      <MenuItem value="Bellini">Bellini</MenuItem>
                      <MenuItem value="Hugo">Hugo</MenuItem>
                      <MenuItem value="Campari">Campari</MenuItem>
                      <MenuItem value="Manhattan">Manhattan</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body2">
                    {member.drinkPreference ? (
                      <Chip
                        label={member.drinkPreference}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ) : (
                      "-"
                    )}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {member.isEditing ? (
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => saveChanges(index)}
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => cancelEditing(index)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Stack>
                ) : (
                  <IconButton
                    size="small"
                    onClick={() => startEditing(index)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};