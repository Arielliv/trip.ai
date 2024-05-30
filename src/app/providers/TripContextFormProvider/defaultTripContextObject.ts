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
  loadTripLocations: (_locations: LocationInTripFormData[]) => {},
  clearTripLocations: () => {},
};

const defaultSavedTripsContext: TripsManagerContextObject = {
  trips: [],
  loadTrips: () => {},
  editTrip: (_updatedTrip: ITrip) => {},
  addTrip: (_newTrip: ITrip) => {},
  removeTrip: (_id: string) => {},
  isEditMode: false,
  loading: false,
  hasMore: false,
  currentTripId: '',
};

export const defaultTripContext = {
  ...defaultSavedTripsContext,
  ...defaultManageLocationTableHook,
  clearFormOnEditState: () => {},
};
