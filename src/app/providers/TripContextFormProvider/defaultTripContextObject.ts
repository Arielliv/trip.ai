import { TripsManagerContextObject } from '@/app/hooks/useManageTrips';
import { ITrip } from '@/models/Trip';
import { ManageLocationTableHook } from '@/app/hooks/useManageLocationTable';
import { LocationInTripFormData } from '@/app/hooks/useTripForm';

const defaultManageLocationTableHook: ManageLocationTableHook = {
  handleRowModesModelChange: () => {},
  processRowUpdate: (newRow) => ({ ...newRow, isNew: false }),
  handleCancelClick: () => () => {},
  handleDeleteClick: () => () => {},
  handleSaveClick: () => () => {},
  handleEditClick: () => () => {},
  handleRowEditStop: () => {},
  updateRowPosition: async (_initialIndex, newIndex, rows) => rows,
  handleRowOrderChange: async () => {},
  addNewRow: () => {},
  isRowInEditMode: () => false,
  rows: [],
  rowModesModel: {},
  loadTripLocationsIntoTable: (_locations: LocationInTripFormData[]) => {},
  clearTripLocationsFromTable: () => {},
};

const defaultSavedTripsContext: TripsManagerContextObject = {
  trips: [],
  currentTripId: '',
  addTrip: (_newTrip: ITrip) => {},
  editTrip: (_updatedTrip: ITrip) => {},
  isEditMode: false,
  isLoading: false,
  hasNextPage: false,
  removeTrip: (_id: string) => {},
  setCurrentTripId: (_id: string | undefined) => {},
};

export const defaultTripContext = {
  ...defaultSavedTripsContext,
  ...defaultManageLocationTableHook,
  clearFormOnEditState: () => {},
};
