import { useEffect, useState } from "react";
import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import Button from "@mui/material/Button";

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-material.css';

import type { ColDef } from '@ag-grid-community/core';
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import { getCustomers, deleteCustomer } from "../customerapi";
import type { CustomerData } from "../types";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Customerlist() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);

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
      <AddCustomer fetchCustomers={fetchCustomers} />
      <div className="ag-theme-material" style={{ height: 600, width: "100%" }}>
        <AgGridReact
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
