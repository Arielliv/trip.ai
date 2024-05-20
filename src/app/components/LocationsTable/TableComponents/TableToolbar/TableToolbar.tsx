import { GridToolbarContainer } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

export interface TableToolbarProps {
  addNewRow: () => void;
}

export const TableToolbar = ({ addNewRow }: TableToolbarProps) => {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={addNewRow}>
        Add new location row
      </Button>
    </GridToolbarContainer>
  );
};
