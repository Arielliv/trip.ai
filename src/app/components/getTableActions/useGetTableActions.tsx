import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';

export interface TableActionsParams {
  isInEditMode: (id: GridRowId) => boolean;
  handleSaveClick: (id: GridRowId) => void;
  handleCancelClick: (id: GridRowId) => void;
  handleEditClick: (id: GridRowId) => void;
  handleDeleteClick: (id: GridRowId) => void;
}
export const useGetTableActions = ({
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
  handleDeleteClick,
  isInEditMode,
}: TableActionsParams) => {
  const getTableActions = (id: GridRowId) => {
    if (isInEditMode(id)) {
      return [
        <GridActionsCellItem
          key={`${id}-save`}
          icon={<SaveIcon />}
          label="Save"
          sx={{
            color: 'primary.main',
          }}
          // @ts-ignore
          onClick={handleSaveClick(id)}
        />,
        <GridActionsCellItem
          key={`${id}-Cancel`}
          icon={<CancelIcon />}
          label="Cancel"
          className="textPrimary"
          // @ts-ignore
          onClick={handleCancelClick(id)}
          color="inherit"
        />,
      ];
    }

    return [
      <GridActionsCellItem
        key={`${id}-Edit`}
        icon={<EditIcon />}
        label="Edit"
        className="textPrimary"
        // @ts-ignore
        onClick={handleEditClick(id)}
        color="inherit"
      />,
      <GridActionsCellItem
        key={`${id}-Delete`}
        icon={<DeleteIcon />}
        label="Delete"
        // @ts-ignore
        onClick={handleDeleteClick(id)}
        color="inherit"
      />,
    ];
  };

  return { getTableActions };
};
