import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { Customer, CustomerData } from '../types';

type EditCustomerProps = {
    data: CustomerData;
    fetchCustomers: () => void;
};

export default function EditCustomer({ data, fetchCustomers }: EditCustomerProps) {
    const [open, setOpen] = useState(false);
    const [customer, setCustomer] = useState<Customer>(data);

    const handleClickOpen = () => {
        setOpen(true);
        setCustomer(data);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateCustomer = () => {
        fetch(data._links.self.href, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(customer),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error when updating customer");
                return response.json();
            })
            .then(() => fetchCustomers())
            .then(() => setOpen(false))
            .catch((err) => console.error(err));
    };

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                Edit
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit customer</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        label="First Name"
                        value={customer.firstname || ''}
                        onChange={(e) => setCustomer({ ...customer, firstname: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Last Name"
                        value={customer.lastname || ''}
                        onChange={(e) => setCustomer({ ...customer, lastname: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Street Address"
                        value={customer.streetaddress || ''}
                        onChange={(e) => setCustomer({ ...customer, streetaddress: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Postcode"
                        value={customer.postcode || ''}
                        onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        label="City"
                        value={customer.city || ''}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Email"
                        value={customer.email || ''}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Phone"
                        value={customer.phone || ''}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={updateCustomer}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
