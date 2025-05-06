import { useEffect, useState } from "react";

import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-material.css';

import type { ColDef } from '@ag-grid-community/core';




import { getCustomers } from "../customerapi";
import type { Customer } from "../types";


ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Customerlist() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    getCustomers()
      .then((data) => setCustomers(data._embedded.customers))
      .catch((err) => console.error("Failed to fetch customers:", err));
  }, []);

  const [colDefs] = useState<ColDef<Customer>[]>([
    { field: "firstname", filter: true, sortable: true },
    { field: "lastname", filter: true, sortable: true },
    { field: "streetaddress", filter: true },
    { field: "postcode", filter: true },
    { field: "city", filter: true },
    { field: "email", filter: true, sortable: true },
    { field: "phone", filter: true }
  ]);

  return (

    <div className="ag-theme-material" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={customers}
        columnDefs={colDefs}
        rowModelType="clientSide"
        pagination={true}
        paginationAutoPageSize={true}
      />
    </div>
  );
}

export default Customerlist;