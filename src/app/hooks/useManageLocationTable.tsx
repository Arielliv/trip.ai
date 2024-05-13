import { useState } from 'react';
import { GridRowModel, GridRowOrderChangeParams } from '@mui/x-data-grid-pro';
import {
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { Columns } from '@/app/components/constants/constants';
import { createEmptyRow } from '@/app/components/LocationsTable/TableComponents/TableToolbar/TableToolbar';

const initRows: GridRowModel[] = [
  { [Columns.Id]: 1, [Columns.LocationName]: 'Hello' },
  { [Columns.Id]: 2, [Columns.LocationName]: 'DataGridPro' },
  { [Columns.Id]: 3, [Columns.LocationName]: 'MUI' },
];

export const useManageLocationTable = () => {
  const [rows, setRows] = useState<GridRowModel[]>(initRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [loading, setLoading] = useState(false);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row: GridRowModel) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const updateRowPosition = (initialIndex: number, newIndex: number, rows: Array<GridRowModel>): Promise<any> => {
    return new Promise((resolve) => {
      const rowsClone = [...rows];
      const row = rowsClone.splice(initialIndex, 1)[0];
      rowsClone.splice(newIndex, 0, row);
      resolve(rowsClone);
    });
  };

  const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
    setLoading(true);
    const newRows = await updateRowPosition(params.oldIndex, params.targetIndex, rows);
    setRows(newRows);
    setLoading(false);
  };

  const addNewRow = () => {
    const id = uuidv4().toString();
    setRows((oldRows) => [...oldRows, createEmptyRow(id)]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: Columns.LocationName },
    }));
  };

  const isEditMode = (id: GridRowId) => {
    return rowModesModel[id]?.mode === GridRowModes.Edit;
  };

  return {
    handleRowModesModelChange,
    processRowUpdate,
    handleCancelClick,
    handleDeleteClick,
    handleSaveClick,
    handleEditClick,
    handleRowEditStop,
    updateRowPosition,
    handleRowOrderChange,
    rows,
    rowModesModel,
    addNewRow,
    isEditMode,
  };
};
