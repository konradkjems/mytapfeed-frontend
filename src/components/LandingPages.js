import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  ColorPicker
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  ColorLens as ColorLensIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import Layout from './Layout';
import API_URL from '../config';

const LandingPages = () => {
  const [pages, setPages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [newPage, setNewPage] = useState({
    title: '',
    description: '',
    logo: null,
    backgroundImage: null,
    backgroundColor: '#ffffff',
    buttonColor: '#000000',
    buttonTextColor: '#ffffff'
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/landing-pages`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Fejl ved hentning af landing pages:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved hentning af landing pages',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePage = async () => {
    try {
      const formData = new FormData();
      Object.keys(newPage).forEach(key => {
        if (key === 'logo' || key === 'backgroundImage') {
          if (newPage[key]) formData.append(key, newPage[key]);
        } else {
          formData.append(key, newPage[key]);
        }
      });

      const response = await fetch(`${API_URL}/landing-pages`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Landing page oprettet succesfuldt',
          severity: 'success'
        });
        setOpenDialog(false);
        setNewPage({
          title: '',
          description: '',
          logo: null,
          backgroundImage: null,
          backgroundColor: '#ffffff',
          buttonColor: '#000000',
          buttonTextColor: '#ffffff'
        });
        fetchPages();
      }
    } catch (error) {
      console.error('Fejl ved oprettelse af landing page:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved oprettelse af landing page',
        severity: 'error'
      });
    }
  };

  const handleDeletePage = async (id) => {
    if (window.confirm('Er du sikker på, at du vil slette denne landing page?')) {
      try {
        const response = await fetch(`${API_URL}/landing-pages/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setAlert({
            open: true,
            message: 'Landing page slettet succesfuldt',
            severity: 'success'
          });
          fetchPages();
        }
      } catch (error) {
        console.error('Fejl ved sletning af landing page:', error);
        setAlert({
          open: true,
          message: 'Der opstod en fejl ved sletning af landing page',
          severity: 'error'
        });
      }
    }
  };

  const handleFileChange = (event, field) => {
    const file = event.target.files[0];
    setNewPage(prev => ({
      ...prev,
      [field]: file
    }));
  };

  return (
    <Layout title="Landing Pages">
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1">
                Landing Pages
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Opret ny landing page
              </Button>
            </Box>
          </Grid>

          {isLoading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : pages.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  Ingen landing pages oprettet endnu
                </Typography>
              </Paper>
            </Grid>
          ) : (
            pages.map(page => (
              <Grid item xs={12} sm={6} md={4} key={page._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={page.backgroundImage || '/placeholder.jpg'}
                    alt={page.title}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {page.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {page.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => setSelectedPage(page)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePage(page._id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton href={`/landing/${page._id}`} target="_blank">
                      <PreviewIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Opret ny landing page</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titel"
                value={newPage.title}
                onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beskrivelse"
                multiline
                rows={4}
                value={newPage.description}
                onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                fullWidth
              >
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'logo')}
                />
              </Button>
              {newPage.logo && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Valgt fil: {newPage.logo.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                fullWidth
              >
                Upload Baggrundsbillede
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'backgroundImage')}
                />
              </Button>
              {newPage.backgroundImage && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Valgt fil: {newPage.backgroundImage.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Baggrundsfarve</InputLabel>
                <input
                  type="color"
                  value={newPage.backgroundColor}
                  onChange={(e) => setNewPage({ ...newPage, backgroundColor: e.target.value })}
                  style={{ width: '100%', height: '56px' }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Knapfarve</InputLabel>
                <input
                  type="color"
                  value={newPage.buttonColor}
                  onChange={(e) => setNewPage({ ...newPage, buttonColor: e.target.value })}
                  style={{ width: '100%', height: '56px' }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Knap tekstfarve</InputLabel>
                <input
                  type="color"
                  value={newPage.buttonTextColor}
                  onChange={(e) => setNewPage({ ...newPage, buttonTextColor: e.target.value })}
                  style={{ width: '100%', height: '56px' }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuller</Button>
          <Button onClick={handleCreatePage} variant="contained" color="primary">
            Opret
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default LandingPages; 