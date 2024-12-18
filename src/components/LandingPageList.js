import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPageList = () => {
    const [landingPages, setLandingPages] = useState([]);
    const [selectedStands, setSelectedStands] = useState({});
    const [stands, setStands] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLandingPages();
        fetchStands();
    }, []);

    const fetchLandingPages = async () => {
        try {
            const response = await fetch('/api/landing-pages', {
                credentials: 'include'
            });
            const data = await response.json();
            setLandingPages(data);
        } catch (error) {
            console.error('Fejl ved hentning af landing pages:', error);
        }
    };

    const fetchStands = async () => {
        try {
            const response = await fetch('/api/stands', {
                credentials: 'include'
            });
            const data = await response.json();
            setStands(data);
        } catch (error) {
            console.error('Fejl ved hentning af produkter:', error);
        }
    };

    const handleAssignStands = async () => {
        try {
            await fetch(`/api/landing-pages/${selectedPage._id}/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    stands: Object.keys(selectedStands).filter(id => selectedStands[id])
                })
            });
            setOpenDialog(false);
            fetchLandingPages();
        } catch (error) {
            console.error('Fejl ved tildeling af produkter:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Er du sikker på at du vil slette denne landing page?')) {
            try {
                await fetch(`/api/landing-pages/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                fetchLandingPages();
            } catch (error) {
                console.error('Fejl ved sletning af landing page:', error);
            }
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Landing Pages</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/landing-page-editor/new')}
                >
                    Opret Ny Landing Page
                </Button>
            </Box>
            <List>
                {landingPages.map((page) => (
                    <ListItem key={page._id}>
                        <ListItemText
                            primary={page.title}
                            secondary={`Tilknyttet til ${page.stands?.length || 0} produkter`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                onClick={() => {
                                    setSelectedPage(page);
                                    setSelectedStands(
                                        stands.reduce((acc, stand) => ({
                                            ...acc,
                                            [stand._id]: page.stands?.includes(stand._id)
                                        }), {})
                                    );
                                    setOpenDialog(true);
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                edge="end"
                                onClick={() => handleDelete(page._id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Vælg Produkter</DialogTitle>
                <DialogContent>
                    <List>
                        {stands.map((stand) => (
                            <ListItem key={stand._id}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedStands[stand._id] || false}
                                            onChange={(e) => setSelectedStands({
                                                ...selectedStands,
                                                [stand._id]: e.target.checked
                                            })}
                                        />
                                    }
                                    label={`${stand.standerId} (${stand.productType})`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Annuller</Button>
                    <Button onClick={handleAssignStands} variant="contained">
                        Gem
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default LandingPageList; 