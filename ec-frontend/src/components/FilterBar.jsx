import React from 'react';
import { TextField, Grid } from '@mui/material';

const FilterBar = ({ filters, onChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}><TextField name="name" label="Nom" value={filters.name} onChange={onChange} fullWidth /></Grid>
      <Grid item xs={12} sm={3}><TextField name="color" label="Couleur" value={filters.color} onChange={onChange} fullWidth /></Grid>
      <Grid item xs={12} sm={3}><TextField name="size" label="Taille" value={filters.size} onChange={onChange} fullWidth /></Grid>
      <Grid item xs={12} sm={3}><TextField name="description" label="Description" value={filters.description} onChange={onChange} fullWidth /></Grid>
    </Grid>
  );
};

export default FilterBar;