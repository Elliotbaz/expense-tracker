import React, { useState } from 'react';
import { useAuth, useFirestore } from 'reactfire';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AuthDiv from '../components/AuthDiv';
import Auth from '../modules/Auth'
import Stack from '@mui/material/Stack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [validate, setValidate] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
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
            const authModule = new Auth(auth, firestore)
            authModule.signUp(name, email, password).then(() => {
                setSuccess(true);
                setValidate(true);
                navigate("/");
            }).catch((error) => {
                console.error("Error signing up: ", error);
            });
        } catch (error) {
            console.error("Error signing up: ", error);
        }
    };

    return (
        <AuthDiv>
            <h2 style={{ textAlign: 'center' }}> SIGN UP</h2>
            <TextField fullWidth label="Full Name" id="name" onChange={(e) => setName(e.target.value)} placeholder="name" />
            <TextField fullWidth label="Email Address" id="Email" onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <TextField fullWidth label="Password" id="Password" onChange={(e) => setPassword(e.target.value)} placeholder="password" />

            <Stack direction="row" spacing={12}>
                <Button variant="contained" onClick={signup} endIcon={<AddCircleOutlineIcon />} size="large" sx={{ width: '50%' }} color="error">Sign Up</Button>
                <Button variant="contained" onClick={() => navigate('/login')} size="large" endIcon={<LoginIcon />} sx={{ width: '50%' }}>Login</Button>
            </Stack>
            <Snackbar open={validate} autoHideDuration={5000} onClose={handleClose}>
                <Alert severity={success ? "success" : "error"} onClose={handleClose} sx={{ width: '100%' }} >
                    {success ? 'Your registration is successful' : 'Please ensure you leave no field empty!'}
                </Alert>
            </Snackbar>
        </AuthDiv>
    );
}
