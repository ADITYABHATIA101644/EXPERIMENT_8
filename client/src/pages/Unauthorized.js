import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h2" color="error">403</Typography>
            <Typography variant="h5">Access Denied</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>You do not have permission to view this page.</Typography>
            <Button variant="contained" onClick={() => navigate('/')}>Go to Login</Button>
        </Box>
    );
};

export default Unauthorized;