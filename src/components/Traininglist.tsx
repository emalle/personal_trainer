import { useEffect, useState } from "react";

import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-material.css';

import type { ColDef } from '@ag-grid-community/core';




import { getTrainings } from "../trainingapi";
import type { Training } from "../types";

import dayjs from "dayjs";



ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Traininglist() {
    const [trainings, setTrainings] = useState<Training[]>([]);

    useEffect(() => {
        getTrainings()
            .then((data) => setTrainings(data))
            .catch((err) => console.error("Failed to fetch trainings:", err));
    }, []);

    const [colDefs] = useState<ColDef<Training>[]>([
        {
            headerName: "Date",
            field: "date",
            filter: true,
            sortable: true,
            valueFormatter: (params) =>
                dayjs(params.value).format("DD.MM.YYYY HH:mm")
        },
        { field: "activity", filter: true, sortable: true },
        { field: "duration", filter: true, sortable: true },
        {
            headerName: "Customer",
            valueGetter: (params) => {
                const customer = params.data?.customer;
                return customer
                    ? `${customer.firstname} ${customer.lastname}`
                    : "N/A";
            },
            filter: true,
        },
    ]);

    return (
        <div className="ag-theme-material" style={{ height: 600, width: "100%" }}>
            <AgGridReact
                rowData={trainings}
                columnDefs={colDefs}
                pagination={true}
                paginationAutoPageSize={true}
            />
        </div>
    );
}

export default Traininglist;
