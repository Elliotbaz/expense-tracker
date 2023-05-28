import React, { useState } from 'react';
import { useAuth, useFirestore } from 'reactfire';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AuthDiv from '../components/AuthDiv';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [validate, setValidate] = useState(false);
    const [success, setSuccess] = useState(false);
    const history = useNavigate();
    const auth = useAuth();
    const firestore = useFirestore();

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValidate(false);
    };

    const signup = async () => {
        if (!name || !email || !password) {
            return setValidate(true)
        }

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(firestore, 'users', user.uid);

            // Set current month
            const currentMonth = new Date().getMonth();

            await setDoc(userDocRef, {
                name: name,
                monthsData: {
                    [currentMonth]: {
                        profit: 0,
                        expenses: 0,
                        entries: []
                    }
                }
            }).then(() => {
                setSuccess(true);
                setValidate(true);
                history("/");
            }).catch((error) => {
                console.error("Error signing up: ", error);
            });
        } catch (error) {
            console.error("Error signing up: ", error);
        }
    };

    return (
        <AuthDiv>
            <TextField fullWidth label="Full Name" id="name" onChange={(e) => setName(e.target.value)} placeholder="name" />
            <TextField fullWidth label="Email Address" id="Email" onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <TextField fullWidth label="Password" id="Password" onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            <Button variant="contained" onClick={signup} size="large" endIcon={<SendIcon />}>Sign Up</Button>

            <Snackbar open={validate} autoHideDuration={5000} onClose={handleClose}>
                <Alert severity={success ? "success" : "error"} onClose={handleClose} sx={{ width: '100%' }} >
                    {success ? 'Your registration is successful' : 'Please ensure you leave no field empty!'}
                </Alert>
            </Snackbar>
        </AuthDiv>
    );
}
