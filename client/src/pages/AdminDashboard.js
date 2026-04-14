import React, { useEffect, useState } from 'react';
import { 
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
    ListItem, ListItemButton, ListItemIcon, ListItemText, 
    Container, Grid, Paper, Avatar, Button, Card, CardContent 
} from '@mui/material';
import { 
    Dashboard as DashIcon, 
    People as PeopleIcon, 
    Security as LockIcon, 
    Logout as LogoutIcon,
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminDashboard = () => {
    const [data, setData] = useState('Loading secure data...');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/admin/data', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data.message);
            } catch (err) {
                setData("Session expired. Please login again.");
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            {/* Top Bar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1976d2' }}>
                <Toolbar>
                    <AdminIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        RBAC Control Center
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>Welcome, Aditya</Typography>
                    <Avatar sx={{ bgcolor: '#fff', color: '#1976d2', fontWeight: 'bold' }}>A</Avatar>
                </Toolbar>
            </AppBar>

            {/* Sidebar Navigation */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', mt: 2 }}>
                    <List>
                        {[
                            { text: 'Dashboard', icon: <DashIcon color="primary" /> },
                            { text: 'User Management', icon: <PeopleIcon /> },
                            { text: 'Permissions', icon: <LockIcon /> },
                        ].map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Main Content Area */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        {/* Status Card */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', borderRadius: 3, borderLeft: '6px solid #4caf50' }}>
                                <Typography variant="h5" gutterBottom color="success.main" sx={{ fontWeight: 'bold' }}>
                                    System Status: Active
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {data}
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Stats Widgets (Fake data to look professional) */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>Total Users</Typography>
                                    <Typography variant="h4">1,284</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>Active Tokens</Typography>
                                    <Typography variant="h4">42</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>Security Threats</Typography>
                                    <Typography variant="h4" color="error">0</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboard;