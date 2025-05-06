import { useEffect, useState } from "react";

import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-material.css';

import { getTrainings, deleteTraining, addTraining } from "../trainingapi";
import type { Training } from "../types";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from "dayjs";
import type { ColDef } from '@ag-grid-community/core';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Traininglist() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [open, setOpen] = useState(false);

    const [newTraining, setNewTraining] = useState({
        date: dayjs(),
        activity: "",
        duration: 0,
        customer: ""
    });

    const fetchTrainings = () => {
        getTrainings()
            .then((data) => setTrainings(data))
            .catch((err) => console.error("Failed to fetch trainings:", err));
    };

    useEffect(() => {
        fetchTrainings();
    }, []);

    const handleDelete = (url: string) => {
        if (window.confirm("Do you want to delete this training?")) {
            deleteTraining(url)
                .then(() => fetchTrainings())
                .catch((err) => console.error("Failed to delete training:", err));
        }
    };

    const handleSave = () => {
        const trainingToSave = {
            ...newTraining,
            date: newTraining.date.toISOString()
        };

        addTraining(trainingToSave)
            .then(() => {
                fetchTrainings();
                setOpen(false);
            })
            .catch((err) => console.error("Failed to add training:", err));
    };

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
        {
            headerName: "Delete",
            cellRenderer: (params: any) => (
                <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(params.data.links.training.href)}
                >
                    Delete
                </Button>
            ),
            width: 150,
        },
    ]);

    return (
        <>
            <Button variant="outlined" onClick={() => setOpen(true)} style={{ marginBottom: "1rem" }}>
                Add Training
            </Button>

            <div className="ag-theme-material" style={{ height: 600, width: "100%" }}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationAutoPageSize={true}
                />
            </div>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Training</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Date and time"
                            value={newTraining.date}
                            onChange={(newValue) => setNewTraining({ ...newTraining, date: newValue! })}
                            sx={{ mt: 2, mb: 2, width: "100%" }}
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        label="Activity"
                        fullWidth
                        value={newTraining.activity}
                        onChange={(e) => setNewTraining({ ...newTraining, activity: e.target.value })}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Duration (minutes)"
                        fullWidth
                        type="number"
                        value={newTraining.duration}
                        onChange={(e) => setNewTraining({ ...newTraining, duration: Number(e.target.value) })}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        label="Customer URL"
                        fullWidth
                        value={newTraining.customer}
                        onChange={(e) => setNewTraining({ ...newTraining, customer: e.target.value })}
                        helperText="Provide customer URL (e.g. _links.customer.href)"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Traininglist;
