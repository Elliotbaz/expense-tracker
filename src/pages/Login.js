import React, { useState } from 'react';
import AuthDiv from '../components/AuthDiv';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from 'reactfire';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validate, setValidate] = useState(false);
    const [success, setSuccess] = useState(false);
    const [incorrectCred, setIncorrectCred] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValidate(false);
    };

    const login = async () => {
        if (!email || !password) {
            return setValidate(true)
        }

        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            if (user) {
                setSuccess(true);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Error signing in: ", error);
            setIncorrectCred(true);
        }
    };
    return (
        <AuthDiv>
            <TextField fullWidth label="Email Address" id="Email" onChange={(e) => setEmail(e.target.value)} placeholder="enter email" />
            <TextField type='password' fullWidth label="Password" id="Password" onChange={(e) => setPassword(e.target.value)} placeholder="enter password" />
            <Button variant="contained" onClick={login} size="large" endIcon={<LoginIcon />}>Login</Button>

            <Snackbar open={validate || incorrectCred} autoHideDuration={5000} onClose={handleClose}>
                <Alert severity={success ? "success" : "error"} onClose={handleClose} sx={{ width: '100%' }} >
                    {success ? 'Login Successful! ' : incorrectCred ? 'Incorrect email or password!' : 'Please ensure you leave no field empty!'}
                </Alert>
            </Snackbar>
        </AuthDiv>
    )
}
