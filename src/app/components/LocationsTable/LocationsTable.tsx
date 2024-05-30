import { GridColDef, GridSlots } from '@mui/x-data-grid';
import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useManageLocations } from '@/app/hooks/useManageLocations';
import { DataGridPro, GridRowModel } from '@mui/x-data-grid-pro';
import { DateRangeInput } from '@/app/components/LocationsTable/TableComponents/Date/DateRangeInput/DateRangeInput';
import { DurationInput } from '@/app/components/LocationsTable/TableComponents/Duration/DurationInput/DurationInput';
import { TableToolbar } from '@/app/components/LocationsTable/TableComponents/TableToolbar/TableToolbar';
import { Columns } from '@/app/components/constants/constants';
import { currencyFormatter } from '@/app/utils/currencyFormatter';
import { useGetTableActions } from '@/app/components/getTableActions/useGetTableActions';
import { DurationView } from '@/app/components/LocationsTable/TableComponents/Duration/DurationView/DurationView';
import { DateView } from '@/app/components/LocationsTable/TableComponents/Date/DateView/DateView';
import { useTripContext } from '@/app/providers/TripContextFormProvider/TripContextFormProvider';
import { useFormContext } from 'react-hook-form';
import { TripFormData } from '@/app/hooks/useTripForm';
import { useOnTripFormSubmit } from '@/app/hooks/useOnTripFormSubmit';

export const LocationsTable = () => {
  const { onSubmit } = useOnTripFormSubmit();
  const { handleSubmit } = useFormContext<TripFormData>();
  const {
    processRowUpdate,
    handleRowEditStop,
    handleRowModesModelChange,
    handleRowOrderChange,
    rows,
    rowModesModel,
    handleEditClick,
    handleDeleteClick,
    handleSaveClick,
    handleCancelClick,
    addNewRow,
    isRowInEditMode,
  } = useTripContext();

  const onProcessRowUpdate = useCallback(
    async (newRow: GridRowModel) => {
      const updatedRow = processRowUpdate(newRow);
      await handleSubmit(onSubmit)(); // The extra parentheses are used to call the returned function immediately

      return updatedRow;
    },
    [processRowUpdate, handleSubmit, onSubmit],
  );

  const { getTableActions } = useGetTableActions({
    isRowInEditMode,
    handleEditClick,
    handleDeleteClick,
    handleSaveClick,
    handleCancelClick,
  });
  const { locations } = useManageLocations();

  const columns: GridColDef[] = [
    {
      field: Columns.ConnectedLocationData,
      headerName: Columns.ConnectedLocationData,
      type: 'singleSelect',
      editable: true,
      align: 'left',
      width: 175,
      valueGetter: (_value, row) => {
        if (row[Columns.ConnectedLocationData]) {
          return row[Columns.ConnectedLocationData];
        } else {
          return 'Not specified';
        }
      },
      valueSetter: (value, row) => {
        const selectedLocation = locations.find((location) => location.name === value);
        return { ...row, [Columns.ConnectedLocationData]: selectedLocation };
      },
      renderCell: ({ value }) => {
        if (value) {
          return value.name;
        }
      },
      valueOptions: () => locations.map((location) => location.name),
    },
    {
      field: Columns.Duration,
      type: 'custom',
      headerName: Columns.Duration,
      width: 220,
      editable: true,
      renderEditCell: (params) => <DurationInput {...params} />,
      renderCell: ({ value }) => <DurationView value={value} />,
    },
    {
      field: Columns.Date,
      type: 'custom',
      editable: true,
      align: 'left',
      headerName: Columns.Date,
      width: 300,
      renderEditCell: (params) => <DateRangeInput {...params} />,
      renderCell: ({ value }) => <DateView value={value} />,
    },
    {
      field: Columns.AdditionalInfo,
      headerName: Columns.AdditionalInfo,
      type: 'string',
      editable: true,
      valueFormatter: (value) => (value ? value : 'No additional info was provided'),
      align: 'left',
      width: 200,
    },
    {
      field: Columns.Cost,
      headerName: Columns.Cost,
      type: 'number',
      align: 'left',
      editable: true,
      width: 100,
      valueFormatter: (value) => currencyFormatter.format(value ? value : 0),
      cellClassName: 'font-tabular-nums',
    },
    {
      field: Columns.Type,
      headerName: Columns.Type,
      type: 'singleSelect',
      align: 'left',
      editable: false,
      width: 150,
      valueGetter: (_value, row) => {
        if (row[Columns.ConnectedLocationData]) {
          return row[Columns.ConnectedLocationData].type;
        } else {
          return 'Not specified';
        }
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return getTableActions(id);
      },
    },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGridPro
        rowHeight={75}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        rowReordering
        onRowOrderChange={handleRowOrderChange}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={onProcessRowUpdate}
        slots={{
          toolbar: TableToolbar as GridSlots['toolbar'],
        }}
        slotProps={{
          toolbar: { addNewRow },
        }}
      />
    </Box>
  );
};
