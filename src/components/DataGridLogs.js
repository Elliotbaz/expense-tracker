
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataGridComponent = ({ rows, columns }) => {
    return (

        <DataGrid rows={rows} columns={columns} initialState={{
            pagination: {
                paginationModel: {
                    pageSize: 5,
                },
            },

        }}
            pageSizeOptions={[5]} />

    );
}

export default DataGridComponent;
