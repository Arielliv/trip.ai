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
import { mapRowToLocation } from '@/models/mappers/mapRowToLocation';
import { LocationInTripFormData } from '@/app/hooks/useTripForm';

const initRows: GridRowModel[] = [];

export const createEmptyRow = (id: string): GridRowModel => ({
  id,
  [Columns.AdditionalInfo]: '',
  [Columns.Type]: '',
  isNew: true,
});

export interface ManageLocationTableHook {
  handleRowModesModelChange: (newRowModesModel: GridRowModesModel) => void;
  processRowUpdate: (
    newRow: GridRowModel,
    updateLocationById: (id: string, updatedLocation: LocationInTripFormData) => void,
  ) => GridRowModel & { isNew: boolean };
  handleCancelClick: (id: GridRowId) => () => void;
  handleDeleteClick: (id: GridRowId, deleteLocationById: (id: string) => void) => () => void;
  handleSaveClick: (id: GridRowId) => () => void;
  handleEditClick: (id: GridRowId) => () => void;
  handleRowEditStop: GridEventListener<'rowEditStop'>;
  updateRowPosition: (
    initialIndex: number,
    newIndex: number,
    rows: Array<GridRowModel>,
  ) => Promise<Array<GridRowModel>>;
  handleRowOrderChange: (
    params: GridRowOrderChangeParams,
    moveLocationInArray: (from: number, to: number) => void,
  ) => Promise<void>;
  addNewRow: (append: (location: LocationInTripFormData) => void) => void;
  isRowInEditMode: (id: GridRowId) => boolean;
  rows: GridRowModel[];
  rowModesModel: GridRowModesModel;
  loadTripLocations: (locations: LocationInTripFormData[]) => void;
  clearTripLocations: () => void;
}

export const useManageLocationTable = (): ManageLocationTableHook => {
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

  const handleDeleteClick = (id: GridRowId, deleteLocationById: (id: string) => void) => () => {
    deleteLocationById(id.toString());
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

  const processRowUpdate = (
    newRow: GridRowModel,
    updateLocationById: (id: string, updatedLocation: LocationInTripFormData) => void,
  ) => {
    const updatedRow: GridRowModel & { isNew: boolean } = { ...newRow, isNew: false };
    updateLocationById(updatedRow.id, mapRowToLocation(newRow));
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

  const handleRowOrderChange = async (
    params: GridRowOrderChangeParams,
    moveLocationInArray: (from: number, to: number) => void,
  ) => {
    setLoading(true);
    moveLocationInArray(params.oldIndex, params.targetIndex);
    const newRows = await updateRowPosition(params.oldIndex, params.targetIndex, rows);
    setRows(newRows);
    setLoading(false);
  };

  const addNewRow = (append: (location: LocationInTripFormData) => void) => {
    const id = uuidv4().toString();
    const newRow = createEmptyRow(id);
    append(mapRowToLocation(newRow));
    setRows((oldRows) => [...oldRows, newRow]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: Columns.ConnectedLocationData },
    }));
  };

  const isEditMode = (id: GridRowId) => {
    return rowModesModel[id]?.mode === GridRowModes.Edit;
  };

  const loadTripLocations = (locations: LocationInTripFormData[]) => {
    const rows = locations.map((location) => {
      return {
        id: location.id,
        [Columns.ConnectedLocationData]: location?.connectedLocationData?.name,
        [Columns.Date]: location?.date,
        [Columns.Duration]: location?.duration,
        [Columns.AdditionalInfo]: location?.additionalInfo,
        [Columns.Cost]: location?.cost,
        [Columns.Type]: location?.connectedLocationData?.type,
      };
    });
    setRows(rows);
  };

  const clearTripLocations = () => {
    setRows([]);
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
    isRowInEditMode: isEditMode,
    loadTripLocations,
    clearTripLocations,
  };
};
