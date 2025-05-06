import { useEffect, useRef, useState } from "react";
import { AgGridReact } from '@ag-grid-community/react';
import { CsvExportModule } from '@ag-grid-community/csv-export';
import type { ColDef } from "@ag-grid-community/core";
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import Button from "@mui/material/Button";

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-material.css';

import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import { getCustomers, deleteCustomer } from "../customerapi";
import type { CustomerData } from "../types";

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

function Customerlist() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const gridRef = useRef<AgGridReact<CustomerData>>(null);

  const fetchCustomers = () => {
    getCustomers()
      .then((data) => setCustomers(data._embedded.customers))
      .catch((err) => console.error("Failed to fetch customers:", err));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = (customer: CustomerData) => {
    const url = customer._links?.self.href;
    if (!url) {
      console.error("Delete failed: no self link");
      return;
    }

    if (window.confirm("Do you want to delete this customer?")) {
      deleteCustomer(url)
        .then(() => fetchCustomers())
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  const handleExport = () => {
    gridRef.current?.api.exportDataAsCsv({
      fileName: "customers.csv",
      columnKeys: [
        "firstname",
        "lastname",
        "streetaddress",
        "postcode",
        "city",
        "email",
        "phone",
      ],
    });
  };

  const [colDefs] = useState<ColDef<CustomerData>[]>([
    { field: "firstname", filter: true, sortable: true },
    { field: "lastname", filter: true, sortable: true },
    { field: "streetaddress", filter: true },
    { field: "postcode", filter: true },
    { field: "city", filter: true },
    { field: "email", filter: true, sortable: true },
    { field: "phone", filter: true },
    {
      headerName: "Edit",
      cellRenderer: (params: any) => (
        <EditCustomer data={params.data} fetchCustomers={fetchCustomers} />
      ),
      width: 150,
    },
    {
      headerName: "Delete",
      cellRenderer: (params: any) => (
        <Button
          size="small"
          color="error"
          onClick={() => handleDelete(params.data)}
        >
          Delete
        </Button>
      ),
      width: 150,
    },
  ]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <AddCustomer fetchCustomers={fetchCustomers} />
        <Button variant="outlined" onClick={handleExport}>
          Export to CSV
        </Button>
      </div>

      <div className="ag-theme-material" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={customers}
          columnDefs={colDefs}
          rowModelType="clientSide"
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>
    </>
  );
}

export default Customerlist;
