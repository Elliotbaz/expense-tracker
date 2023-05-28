import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Loading = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
        >
            <LinearProgress />
            <Typography variant="h6" component="div" sx={{ color: '#fff', marginTop: '20px' }}>
                Loading...
            </Typography>
        </Box>
    );


}

export default Loading
