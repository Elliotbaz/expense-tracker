// Form.js

import React from 'react';
import { TextField, MenuItem, Button } from '@mui/material';

const Entry = ({ type, setType, title, setTitle, amount, setAmount, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit}>
            <TextField
                select
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{ maxWidth: '500px' }}
            >
                <MenuItem value="Profit">Profit</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
            </TextField>
            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{ maxWidth: '500px' }}
            />
            <TextField
                label="Amount"
                value={amount}
                type='number'
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{ maxWidth: '500px' }}
            />
            <Button type="submit" variant="contained">Add Entry</Button>
        </form>
    )
}

export default Entry;
