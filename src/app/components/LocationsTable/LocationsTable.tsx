import { GridColDef, GridSlots } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useManageLocations } from '@/app/hooks/useManageLocations';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DateRangeInput } from '@/app/components/LocationsTable/TableComponents/Date/DateRangeInput/DateRangeInput';
import { DurationInput } from '@/app/components/LocationsTable/TableComponents/Duration/DurationInput/DurationInput';
import { TableToolbar } from '@/app/components/LocationsTable/TableComponents/TableToolbar/TableToolbar';
import { Columns } from '@/app/components/constants/constants';
import { currencyFormatter } from '@/app/components/currencyFormatter/currencyFormatter';
import { useGetTableActions } from '@/app/components/getTableActions/useGetTableActions';
import { DurationView } from '@/app/components/LocationsTable/TableComponents/Duration/DurationView/DurationView';
import { DateView } from '@/app/components/LocationsTable/TableComponents/Date/DateView/DateView';
import { useManageLocationTable } from '@/app/hooks/useManageLocationTable';

export const LocationsTable = () => {
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
    isEditMode: isInEditMode,
  } = useManageLocationTable();
  const { getTableActions } = useGetTableActions({
    isInEditMode,
    handleEditClick,
    handleDeleteClick,
    handleSaveClick,
    handleCancelClick,
  });
  const { locations, loadLocations } = useManageLocations();

  useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  const columns: GridColDef[] = [
    {
      field: Columns.connectedLocationData,
      headerName: Columns.connectedLocationData,
      type: 'singleSelect',
      editable: true,
      align: 'left',
      width: 175,
      valueGetter: (_value, row) => {
        if (row[Columns.connectedLocationData]) {
          return row[Columns.connectedLocationData];
        } else {
          return 'Not specified';
        }
      },
      valueSetter: (value, row) => {
        const selectedLocation = locations.find((location) => location.name === value);
        return { ...row, [Columns.connectedLocationData]: selectedLocation };
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
        if (row[Columns.connectedLocationData]) {
          return row[Columns.connectedLocationData].type;
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
        processRowUpdate={processRowUpdate}
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
