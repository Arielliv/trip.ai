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
import { LocationInTripFormData, TripFormData } from '@/app/hooks/forms/useTripForm';
import { Control } from 'react-hook-form';
import { useLocationsInTripController } from '@/app/hooks/formControllers/useLocationsInTripController';

const initRows: GridRowModel[] = [];

export const createEmptyRow = (id: string): GridRowModel => ({
  id,
  [Columns.AdditionalInfo]: '',
  [Columns.Type]: '',
  isNew: true,
});

export interface ManageLocationTableHook {
  handleRowModesModelChange: (newRowModesModel: GridRowModesModel) => void;
  processRowUpdate: (newRow: GridRowModel) => GridRowModel & { isNew: boolean };
  handleCancelClick: (id: GridRowId) => () => void;
  handleDeleteClick: (id: GridRowId) => () => void;
  handleSaveClick: (id: GridRowId) => () => void;
  handleEditClick: (id: GridRowId) => () => void;
  handleRowEditStop: GridEventListener<'rowEditStop'>;
  updateRowPosition: (
    initialIndex: number,
    newIndex: number,
    rows: Array<GridRowModel>,
  ) => Promise<Array<GridRowModel>>;
  handleRowOrderChange: (params: GridRowOrderChangeParams) => Promise<void>;
  addNewRow: () => void;
  isRowInEditMode: (id: GridRowId) => boolean;
  rows: GridRowModel[];
  rowModesModel: GridRowModesModel;
  loadTripLocationsIntoTable: (locations: LocationInTripFormData[]) => void;
  clearTripLocationsFromTable: () => void;
}

export const useManageLocationTable = (control?: Control<TripFormData>): ManageLocationTableHook => {
  const { append, deleteLocationById, updateLocationById, moveLocationInArray } = useLocationsInTripController(control);
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

  const processRowUpdate = (newRow: GridRowModel) => {
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

  const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
    setLoading(true);
    moveLocationInArray(params.oldIndex, params.targetIndex);
    const newRows = await updateRowPosition(params.oldIndex, params.targetIndex, rows);
    setRows(newRows);
    setLoading(false);
  };

  const addNewRow = () => {
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
    loadTripLocationsIntoTable: loadTripLocations,
    clearTripLocationsFromTable: clearTripLocations,
  };
};
