import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { LoginBackground } from '../modules/images-index'

import Stack from '@mui/material/Stack';


export default function AuthDiv(props) {
    return (
        <div style={{
            backgroundImage: `url(${LoginBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100vh',
            position: 'fixed',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
        }}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Box sx={{
                    bgcolor: '#cfe8fc', height: 'auto', margin: "auto", marginTop: '40%', borderRadius: '10px', boxShadow: '5px 5px 15px 5px #000000;'

                }}>
                    <Stack spacing={5} direction="column">
                        <Box height="1rem" />

                        {props.children}

                    </Stack>
                </Box>
            </Container>

        </div>
    );
}