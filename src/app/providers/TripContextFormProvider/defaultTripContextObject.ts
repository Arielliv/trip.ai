import { TripsManagerContextObject } from '@/app/hooks/useManageTrips';
import { ITrip } from '@/models/Trip';
import { ManageLocationTableHook } from '@/app/hooks/useManageLocationTable';
import { LocationInTripFormData } from '@/app/hooks/forms/useTripForm';
import { manageMyTripsQueryParams } from '@/app/hooks/useManageMyTripsQueryParams';

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

const defaultManageMyTripsQueryParams: manageMyTripsQueryParams = {
  tripId: undefined,
  setTripId: (_newTripId: string) => {},
  selectedTab: '0',
  setSelectedTab: (_tab: string) => {},
};

export const defaultTripContext = {
  ...defaultSavedTripsContext,
  ...defaultManageLocationTableHook,
  ...defaultManageMyTripsQueryParams,
  clearFormOnEditState: () => {},
  selectedTab: '0',
  handleSelectTab: (_newTab: string) => {},
};
