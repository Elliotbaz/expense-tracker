import React, { useState } from 'react';
import AuthDiv from '../components/AuthDiv';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useAuth } from 'reactfire';
import Auth from '../modules/Auth';
import Stack from '@mui/material/Stack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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
            const authModule = new Auth(auth)
            const { user } = await authModule.signIn(email, password);
            if (user) {
                setSuccess(true);
                navigate('/');
            }
        } catch (error) {
            console.error("Error signing in: ", error);
            setIncorrectCred(true);
        }
    };

    return (
        <AuthDiv>
            <h2 style={{ textAlign: 'center' }}> LOGIN</h2>
            <TextField fullWidth label="Email Address" id="Email" onChange={(e) => setEmail(e.target.value)} placeholder="enter email" />
            <TextField type='password' fullWidth label="Password" id="Password" onChange={(e) => setPassword(e.target.value)} placeholder="enter password" />
            <Stack direction="row" spacing={12}>
                <Button variant="contained" onClick={login} size="large" endIcon={<LoginIcon />} sx={{ width: '50%' }}>Login</Button>
                <Button variant="contained" onClick={() => navigate('/sign-up')} endIcon={<AddCircleOutlineIcon />} size="large" sx={{ width: '50%' }} color="error">Sign Up</Button>
            </Stack>
            <Snackbar open={validate || incorrectCred} autoHideDuration={5000} onClose={handleClose}>
                <Alert severity={success ? "success" : "error"} onClose={handleClose} sx={{ width: '100%' }} >
                    {success ? 'Login Successful! ' : incorrectCred ? 'Incorrect email or password!' : 'Please ensure you leave no field empty!'}
                </Alert>
            </Snackbar>
        </AuthDiv>
    )
}
