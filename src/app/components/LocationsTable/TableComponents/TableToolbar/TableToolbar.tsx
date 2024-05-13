import { GridToolbarContainer } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { GridRowModel } from '@mui/x-data-grid-pro';
import { Columns } from '@/app/components/constants/constants';

export interface TableToolbarProps {
  addNewRow: () => void;
}

export const createEmptyRow = (id: string): GridRowModel => ({
  id,
  [Columns.LocationName]: '',
  [Columns.AdditionalInfo]: '',
  [Columns.Type]: '',
  isNew: true,
});

export const TableToolbar = ({ addNewRow }: TableToolbarProps) => {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={addNewRow}>
        Add new location row
      </Button>
    </GridToolbarContainer>
  );
};
