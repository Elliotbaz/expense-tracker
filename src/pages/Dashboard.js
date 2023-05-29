import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { useSigninCheck, useFirestore, useFirestoreDocData, useAuth } from 'reactfire';
import { styled } from '@mui/material/styles';
import { TextField, MenuItem, IconButton, Paper, Grid, Container, Box, CssBaseline } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { months } from '../modules/MonthsData';
import Entry from '../components/Entry';
import DataGridLogs from '../components/DataGridLogs'


export default function Dashboard() {
    const { data: signInCheckResult } = useSigninCheck();
    const firestore = useFirestore();
    const dateTimeNow = new Date();
    const [type, setType] = useState('Expense');
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);
    const navigate = useNavigate();

    const [monthsData, setMonthsData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(dateTimeNow.getMonth());
    let uid;
    if (signInCheckResult?.user?.uid) {
        uid = signInCheckResult?.user?.uid;
    }
    const auth = useAuth();

    const handleSignOut = async () => {
        try {
            await auth.signOut(auth);
            navigate('/login');
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
        try {
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
        } catch (err) {
            console.error(err);
        }
    }

    const handleMonthChange = async (event) => {
        setSelectedMonth(event.target.value);
    }

    if (status === 'loading') {
        return <Loading />;
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <div style={{ backgroundColor: '#fff' }}>
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
                                <h1>👋 Welcome, {data?.name}</h1>
                                <b style={{ float: 'left', color: 'green' }}> Total Income: ${(monthsData[selectedMonth]?.profit || 0)}</b>
                                <TextField
                                    select
                                    label="Select a month"
                                    value={selectedMonth}
                                    onChange={handleMonthChange}

                                    margin="normal"
                                    required
                                    size="small"
                                    sx={{ width: "30%", margin: 0 }}
                                >
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index}>
                                            {month}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                    <Grid container>
                        <Grid item xs={12} sm={3} md={4}></Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Entry
                                type={type}
                                setType={setType}
                                title={title}
                                setTitle={setTitle}
                                amount={amount}
                                setAmount={setAmount}
                                handleSubmit={handleSubmit}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={4}></Grid>
                    </Grid>
                    <br />
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGridLogs rows={filteredLogs} columns={columns} />
                    </div>
                </Box>
            </Container>
        </div>
    );
}
