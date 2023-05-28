import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { useSigninCheck, useFirestore, useFirestoreDocData, useAuth } from 'reactfire';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { DataGrid } from '@mui/x-data-grid';


export default function Dashboard() {
    const { data: signInCheckResult } = useSigninCheck();
    const firestore = useFirestore();
    const dateTimeNow = new Date();
    const [type, setType] = useState('Expense');
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);


    const [monthsData, setMonthsData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(dateTimeNow.getMonth());
    let uid;
    if (signInCheckResult) {
        uid = signInCheckResult.user.uid;
    }
    const auth = useAuth();
    const handleSignOut = async () => {
        try {
            auth.signOut();
        } catch (error) {
            console.error('Error signing out', error);
        }
    };
    const columns = [

        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'amount', headerName: 'Amount', width: 130 },
        { field: 'timestamp', headerName: 'Timestamp', width: 200 },
    ];


    let rows = [];
    Object.keys(monthsData).forEach(month => {
        monthsData[month].entries.forEach((entry, index) => {
            const date = new Date(entry.timestamp.seconds * 1000); // convert to milliseconds
            rows.push({
                id: index,
                type: entry.type,
                title: entry.title,
                amount: entry.amount,
                timestamp: date.toLocaleString() // format date
            });
        });
    });



    const userDocRef = doc(firestore, 'users', uid);
    const { status, data } = useFirestoreDocData(userDocRef);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        if (data) {
            const updatedMonthsData = { ...data.monthsData };
            Object.keys(updatedMonthsData).forEach(month => {
                let profit = 0;
                let expenses = 0;
                updatedMonthsData[month].entries.forEach(entry => {
                    if (entry.type === 'Profit') {
                        profit += entry.amount;
                    } else if (entry.type === 'Expense') {
                        expenses += entry.amount;
                    }
                });
                updatedMonthsData[month].profit = profit;
                updatedMonthsData[month].expenses = expenses;
            });
            setMonthsData(updatedMonthsData);
        }
    }, [data]);

    useEffect(() => {
        if (data && data.monthsData) {
            const updatedMonthsData = { ...data.monthsData };
            Object.keys(updatedMonthsData).forEach(month => {
                let profit = 0;
                let expenses = 0;
                updatedMonthsData[month].entries.forEach(entry => {
                    if (entry.type === 'Profit') {
                        profit += entry.amount;
                    } else if (entry.type === 'Expense') {
                        expenses += entry.amount;
                    }
                });
                updatedMonthsData[month].profit = profit;
                updatedMonthsData[month].expenses = expenses;
            });
            setMonthsData(updatedMonthsData);

            const logsForSelectedMonth = data.monthsData[selectedMonth]?.entries || [];
            setFilteredLogs(logsForSelectedMonth.map((entry, index) => ({
                id: index + 1,
                type: entry.type,
                title: entry.title,
                amount: entry.amount,
                timestamp: new Date(entry.timestamp.seconds * 1000).toLocaleString(),
            })));
        }
    }, [data, selectedMonth]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const timestamp = new Date();
        const currentMonthData = monthsData[selectedMonth] || { expenses: 0, profit: 0, entries: [] };

        const newEntry = {
            type,
            title,
            amount: Number(amount),
            timestamp
        };

        const updatedMonthData = {
            ...currentMonthData,
            [type.toLowerCase()]: currentMonthData[type.toLowerCase()] + Number(amount),
            entries: [...currentMonthData.entries, newEntry]
        };

        await updateDoc(userDocRef, {
            monthsData: {
                ...monthsData,
                [selectedMonth]: updatedMonthData
            }
        });

        setMonthsData(prevMonthsData => ({
            ...prevMonthsData,
            [selectedMonth]: updatedMonthData
        }));
        setAmount('');
        setTitle('');
    }

    const handleMonthChange = async (event) => {
        setSelectedMonth(event.target.value);
    }

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <div style={{ backgroundColor: '#000' }}>
            <CssBaseline />
            <Container maxWidth="xl">
                <Box sx={{ bgcolor: '#fff', height: '100vh' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Item>
                                <h3>
                                    Total Balance: <span style={{ color: ((monthsData[selectedMonth]?.profit || 0) - (monthsData[selectedMonth]?.expenses || 0)) > 0 ? 'green' : 'red' }}>$
                                        {(monthsData[selectedMonth]?.profit || 0) - (monthsData[selectedMonth]?.expenses || 0)}
                                    </span>
                                </h3>
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item sx={{ paddingBottom: '30px' }}>
                                <h1>👋 Welcome, {data.name}</h1>
                                <b style={{ float: 'left', color: 'green' }}> Total Income: ${(monthsData[selectedMonth]?.profit || 0)}</b>
                                <b style={{ float: 'right', color: 'red' }}> Total Expenses: ${(monthsData[selectedMonth]?.expenses || 0)}</b>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <b>{dateTimeNow.toLocaleDateString()} | {dateTimeNow.toLocaleTimeString()} </b> <br />
                                <IconButton onClick={handleSignOut} sx={{ color: 'red', borderRadius: '100%', backgroundColor: 'black' }}>
                                    <LogoutIcon />
                                </IconButton>
                            </Item>

                        </Grid>
                    </Grid>
                    <TextField
                        select
                        label="Select a month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        fullWidth
                        margin="normal"
                        required
                    >
                        {months.map((month, index) => (
                            <MenuItem key={index} value={index}>
                                {month}
                            </MenuItem>
                        ))}
                    </TextField>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            select
                            label="Type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
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
                        />
                        <TextField
                            label="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <Button type="submit" variant="contained">Add Entry</Button>
                    </form>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid rows={filteredLogs} columns={columns} initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },

                        }}
                            pageSizeOptions={[5]} />
                    </div>
                </Box>


            </Container>
        </div>
    );
}