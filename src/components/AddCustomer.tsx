import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { Customer } from '../types';

type AddCustomerProps = {
    fetchCustomers: () => void;
};

export default function AddCustomer({ fetchCustomers }: AddCustomerProps) {
    const [open, setOpen] = useState(false);
    const [customer, setCustomer] = useState<Customer>({} as Customer);

    const handleClickOpen = () => {
        setOpen(true);
        setCustomer({} as Customer);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addCustomer = () => {
        fetch(import.meta.env.VITE_API_URL + "customers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(customer),
        })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error adding a new customer");

                return response.json();
            })
            .then(() => fetchCustomers())
            .then(() => setOpen(false))
            .catch(err => console.error(err));
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add Customer
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add a new customer</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        name="firstname"
                        value={customer.firstname || ''}
                        label="First Name"
                        onChange={e => setCustomer({ ...customer, firstname: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="lastname"
                        value={customer.lastname || ''}
                        label="Last Name"
                        onChange={e => setCustomer({ ...customer, lastname: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="streetaddress"
                        value={customer.streetaddress || ''}
                        label="Street Address"
                        onChange={e => setCustomer({ ...customer, streetaddress: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="postcode"
                        value={customer.postcode || ''}
                        label="Postcode"
                        onChange={e => setCustomer({ ...customer, postcode: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="city"
                        value={customer.city || ''}
                        label="City"
                        onChange={e => setCustomer({ ...customer, city: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="email"
                        value={customer.email || ''}
                        label="Email"
                        onChange={e => setCustomer({ ...customer, email: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="phone"
                        value={customer.phone || ''}
                        label="Phone"
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addCustomer}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
