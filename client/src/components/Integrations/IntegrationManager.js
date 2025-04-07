import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { Refresh, Sync, Error as ErrorIcon, CheckCircle } from '@mui/icons-material';
import axios from 'axios';

const IntegrationManager = () => {
    const [integrations, setIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [syncStatus, setSyncStatus] = useState({});

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const fetchIntegrations = async () => {
        try {
            const response = await axios.get('/api/integrations');
            setIntegrations(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch integrations');
            setLoading(false);
        }
    };

    const handleSync = async (system) => {
        try {
            setSyncStatus(prev => ({ ...prev, [system]: 'syncing' }));
            const response = await axios.post(`/api/integrations/${system}/sync`);
            setSyncStatus(prev => ({ ...prev, [system]: 'success' }));
            setTimeout(() => {
                setSyncStatus(prev => ({ ...prev, [system]: null }));
            }, 3000);
        } catch (err) {
            setSyncStatus(prev => ({ ...prev, [system]: 'error' }));
            setTimeout(() => {
                setSyncStatus(prev => ({ ...prev, [system]: null }));
            }, 3000);
        }
    };

    const handleConfigUpdate = async (system, config) => {
        try {
            await axios.post('/api/integrations', { system, config });
            fetchIntegrations();
        } catch (err) {
            setError('Failed to update integration configuration');
        }
    };

    const getStatusIcon = (system) => {
        const status = syncStatus[system];
        if (status === 'syncing') return <CircularProgress size={20} />;
        if (status === 'success') return <CheckCircle color="success" />;
        if (status === 'error') return <ErrorIcon color="error" />;
        return null;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Integration Manager
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {integrations.map((integration) => (
                    <Grid item xs={12} md={6} key={integration.system}>
                        <Card>
                            <CardHeader
                                title={integration.system === 'adorbit' ? 'Ad Orbit' : 'OMEDA'}
                                subheader={`Last sync: ${integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}`}
                                action={
                                    <Box>
                                        <Tooltip title="Sync Now">
                                            <IconButton onClick={() => handleSync(integration.system)}>
                                                {getStatusIcon(integration.system) || <Sync />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Refresh Status">
                                            <IconButton onClick={fetchIntegrations}>
                                                <Refresh />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="API Key"
                                            type="password"
                                            value={integration.config.apiKey}
                                            onChange={(e) => handleConfigUpdate(integration.system, {
                                                ...integration.config,
                                                apiKey: e.target.value
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="API URL"
                                            value={integration.config.apiUrl}
                                            onChange={(e) => handleConfigUpdate(integration.system, {
                                                ...integration.config,
                                                apiUrl: e.target.value
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Sync Interval (seconds)"
                                            type="number"
                                            value={integration.config.syncInterval}
                                            onChange={(e) => handleConfigUpdate(integration.system, {
                                                ...integration.config,
                                                syncInterval: parseInt(e.target.value)
                                            })}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default IntegrationManager; 