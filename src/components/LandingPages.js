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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Twitter as TwitterIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import Layout from './Layout';
import API_URL from '../config';
import iPhoneBezel from '../assets/Iphone bezel.png';
import logo from '../assets/tapfeed logo dark wide transparent.svg';

const LandingPages = () => {
  const [pages, setPages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [newPage, setNewPage] = useState({
    title: '',
    description: '',
    urlPath: '',
    logo: null,
    backgroundImage: null,
    backgroundColor: '#ffffff',
    buttonColor: '#000000',
    buttonTextColor: '#ffffff',
    titleColor: '#000000',
    descriptionColor: '#000000',
    titleFont: 'Inter',
    descriptionFont: 'Inter',
    buttonFont: 'Inter',
    buttons: [],
    showTitle: false,
    socialLinks: {
      instagram: '',
      facebook: '',
      youtube: '',
      twitter: ''
    }
  });
  const [newButton, setNewButton] = useState({ text: '', url: '' });
  const [editingButton, setEditingButton] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      console.log('Henter landing pages...');
      
      const response = await fetch(`${API_URL}/api/landing-pages`, {
        credentials: 'include'
      });
      
      console.log('Landing pages response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.status === 429) {
        console.log('Rate limit nået, venter 60 sekunder...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        return await fetchPages();
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Landing pages data:', data);
      setPages(data);
    } catch (error) {
      console.error('Detaljeret fejl ved hentning af landing pages:', {
        error: error.message,
        stack: error.stack
      });
      setAlert({
        open: true,
        message: `Der opstod en fejl ved hentning af landing pages: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePage = async () => {
    try {
      console.log('Creating page, showTitle value:', newPage.showTitle);
      const formData = new FormData();
      formData.append('title', newPage.title);
      formData.append('description', newPage.description);
      formData.append('urlPath', newPage.urlPath);
      formData.append('backgroundColor', newPage.backgroundColor);
      formData.append('buttonColor', newPage.buttonColor);
      formData.append('buttonTextColor', newPage.buttonTextColor);
      formData.append('titleColor', newPage.titleColor);
      formData.append('descriptionColor', newPage.descriptionColor);
      formData.append('showTitle', newPage.showTitle ? 'true' : 'false');
      formData.append('buttons', JSON.stringify(newPage.buttons));
      formData.append('socialLinks', JSON.stringify(newPage.socialLinks));
      formData.append('titleFont', newPage.titleFont);
      formData.append('descriptionFont', newPage.descriptionFont);
      formData.append('buttonFont', newPage.buttonFont);

      console.log('FormData showTitle value:', formData.get('showTitle'));

      if (newPage.logo) {
        formData.append('logo', newPage.logo);
      }
      if (newPage.backgroundImage) {
        formData.append('backgroundImage', newPage.backgroundImage);
      }

      const response = await fetch(`${API_URL}/api/landing-pages`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Landing page oprettet',
          severity: 'success'
        });
        setOpenDialog(false);
        resetNewPage();
        fetchPages();
      } else {
        throw new Error('Fejl ved oprettelse af landing page');
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

  const resetNewPage = () => {
    setNewPage({
      title: '',
      description: '',
      urlPath: '',
      logo: null,
      backgroundImage: null,
      backgroundColor: '#ffffff',
      buttonColor: '#000000',
      buttonTextColor: '#ffffff',
      titleColor: '#000000',
      descriptionColor: '#000000',
      titleFont: 'Inter',
      descriptionFont: 'Inter',
      buttonFont: 'Inter',
      buttons: [],
      showTitle: false,
      socialLinks: {
        instagram: '',
        facebook: '',
        youtube: '',
        twitter: ''
      }
    });
  };

  const handleAddButton = () => {
    if (newButton.text && newButton.url) {
      if (editingButton !== null) {
        setNewPage(prev => ({
          ...prev,
          buttons: prev.buttons.map((button, i) => 
            i === editingButton.index ? { ...newButton } : button
          )
        }));
        setEditingButton(null);
      } else {
        setNewPage(prev => ({
          ...prev,
          buttons: [...prev.buttons, { ...newButton }]
        }));
      }
      setNewButton({ text: '', url: '' });
    }
  };

  const handleRemoveButton = (index) => {
    setNewPage(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (event, field) => {
    const file = event.target.files[0];
    setNewPage(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setNewPage(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value.trim()
      }
    }));
  };

  const handleDeletePage = async (id) => {
    if (window.confirm('Er du sikker på, at du vil slette denne landing page?')) {
      try {
        const response = await fetch(`${API_URL}/api/landing-pages/${id}`, {
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

  const handleEdit = (page) => {
    console.log('Original page showTitle:', page.showTitle);
    setNewPage({
      title: page.title,
      description: page.description,
      urlPath: page.urlPath || '',
      backgroundColor: page.backgroundColor,
      buttonColor: page.buttonColor,
      buttonTextColor: page.buttonTextColor,
      titleColor: page.titleColor,
      descriptionColor: page.descriptionColor,
      titleFont: page.titleFont || 'Inter',
      descriptionFont: page.descriptionFont || 'Inter',
      buttonFont: page.buttonFont || 'Inter',
      buttons: page.buttons || [],
      showTitle: page.showTitle === undefined ? false : page.showTitle,
      socialLinks: page.socialLinks || {}
    });
    console.log('New page showTitle after edit:', page.showTitle === undefined ? false : page.showTitle);
    setSelectedPage(page);
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    try {
      console.log('Updating page, showTitle value:', newPage.showTitle);
      const formData = new FormData();
      formData.append('title', newPage.title);
      formData.append('description', newPage.description);
      formData.append('urlPath', newPage.urlPath);
      formData.append('backgroundColor', newPage.backgroundColor);
      formData.append('buttonColor', newPage.buttonColor);
      formData.append('buttonTextColor', newPage.buttonTextColor);
      formData.append('titleColor', newPage.titleColor);
      formData.append('descriptionColor', newPage.descriptionColor);
      formData.append('showTitle', newPage.showTitle ? 'true' : 'false');
      formData.append('buttons', JSON.stringify(newPage.buttons));
      formData.append('socialLinks', JSON.stringify(newPage.socialLinks));
      formData.append('titleFont', newPage.titleFont);
      formData.append('descriptionFont', newPage.descriptionFont);
      formData.append('buttonFont', newPage.buttonFont);

      console.log('FormData showTitle value:', formData.get('showTitle'));

      if (newPage.logo instanceof File) {
        formData.append('logo', newPage.logo);
      }
      if (newPage.backgroundImage instanceof File) {
        formData.append('backgroundImage', newPage.backgroundImage);
      }

      const response = await fetch(`${API_URL}/api/landing-pages/${selectedPage._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const updatedPage = await response.json();
        console.log('Updated page response:', updatedPage);
        setAlert({
          open: true,
          message: 'Landing page opdateret',
          severity: 'success'
        });
        setOpenDialog(false);
        resetNewPage();
        setSelectedPage(null);
        fetchPages();
      } else {
        throw new Error('Fejl ved opdatering af landing page');
      }
    } catch (error) {
      console.error('Fejl ved opdatering af landing page:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved opdatering af landing page',
        severity: 'error'
      });
    }
  };

  const handleEditButton = (button, index) => {
    setEditingButton({ ...button, index });
    setNewButton({ text: button.text, url: button.url });
  };

  const handlePreview = (id) => {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://my.tapfeed.dk'
      : 'http://localhost:3001';
    window.open(`${baseUrl}/landing/${id}`, '_blank');
  };

  const LivePreview = () => {
    const getImageUrl = (image) => {
      if (!image) return '';
      if (typeof image === 'string') return image;
      return URL.createObjectURL(image);
    };

    const socialLinks = newPage.socialLinks || selectedPage?.socialLinks || {};
    const activeSocialLinks = Object.entries(socialLinks).filter(([_, url]) => url && url.trim() !== '');
    const showTitleValue = newPage.showTitle === undefined ? false : newPage.showTitle;

    console.log('LivePreview showTitleValue:', showTitleValue, typeof showTitleValue);

    return (
      <Box
        sx={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: newPage.backgroundColor,
          backgroundImage: newPage.backgroundImage ? `url(${getImageUrl(newPage.backgroundImage)})` : 
                         selectedPage?.backgroundImage ? `url(${selectedPage.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '20px'
        }}
      >
        {(newPage.logo || selectedPage?.logo) && (
          <Box
            component="img"
            src={newPage.logo ? getImageUrl(newPage.logo) : selectedPage?.logo}
            alt="Logo"
            sx={{
              width: 'auto',
              maxWidth: '200px',
              height: 'auto',
              maxHeight: '100px',
              mb: 2
            }}
          />
        )}
        
        {showTitleValue && (
          <Typography 
            variant="h4" 
            component="h1" 
            align="center"
            sx={{ 
              mb: 2,
              color: newPage.titleColor,
              wordBreak: 'break-word',
              fontFamily: newPage.titleFont
            }}
          >
            {newPage.title || selectedPage?.title || ''}
          </Typography>
        )}

        {(newPage.description || selectedPage?.description) && (
          <Typography 
            variant="body1" 
            align="center"
            sx={{ 
              mb: 3,
              color: newPage.descriptionColor,
              wordBreak: 'break-word',
              fontFamily: newPage.descriptionFont
            }}
          >
            {newPage.description || selectedPage?.description || ''}
          </Typography>
        )}

        <Stack spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
          {(newPage.buttons || selectedPage?.buttons || []).map((button, index) => (
            <Button
              key={index}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: newPage.buttonColor,
                color: newPage.buttonTextColor,
                fontFamily: newPage.buttonFont,
                '&:hover': {
                  backgroundColor: newPage.buttonColor,
                  opacity: 0.9
                }
              }}
            >
              {button.text}
            </Button>
          ))}
        </Stack>

        {activeSocialLinks.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Stack direction="row" spacing={2} justifyContent="center">
              {activeSocialLinks.map(([platform, url]) => {
                const Icon = {
                  instagram: InstagramIcon,
                  facebook: FacebookIcon,
                  youtube: YouTubeIcon,
                  twitter: TwitterIcon
                }[platform];
                
                return Icon && (
                  <IconButton
                    key={platform}
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      color: newPage.buttonColor,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)'
                      }
                    }}
                  >
                    <Icon />
                  </IconButton>
                );
              })}
            </Stack>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Layout title="Landing Pages">
      <Box sx={{ mt: 3, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Opret ny landing page
        </Button>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
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
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundImage: `url(${page.backgroundImage || '/placeholder.jpg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)'
                      }
                    }}
                  >
                    {page.logo && (
                      <Box
                        component="img"
                        src={page.logo}
                        alt="Logo"
                        sx={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          width: '50px',
                          height: '50px',
                          objectFit: 'contain',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          padding: '4px'
                        }}
                      />
                    )}
                    <Typography
                      variant="h6"
                      sx={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        right: '10px',
                        color: 'white',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {page.title}
                    </Typography>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.primary' }}>
                      {page.description || 'Ingen beskrivelse'}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.primary' }}>
                          Links: {page.buttons?.length || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.primary' }}>
                          Sociale medier: {Object.values(page.socialLinks || {}).filter(Boolean).length}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                    <Box>
                      <Tooltip title="Rediger">
                        <IconButton 
                          onClick={() => handleEdit(page)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Slet">
                        <IconButton 
                          onClick={() => handleDeletePage(page._id)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Tooltip title="Åbn preview">
                      <IconButton 
                        onClick={() => handlePreview(page._id)}
                        size="small"
                        color="primary"
                      >
                        <PreviewIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPage ? 'Rediger Landing Page' : 'Opret Ny Landing Page'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Titel"
              value={newPage.title}
              onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="URL Sti"
              value={newPage.urlPath}
              onChange={(e) => setNewPage({ ...newPage, urlPath: e.target.value.toLowerCase() })}
              helperText={
                <>
                  Din landing page vil være tilgængelig på: {window.location.origin}/{newPage.urlPath || 'dinvirksomhed'}<br />
                  Brug kun små bogstaver, tal og bindestreger
                </>
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Beskrivelse"
              multiline
              rows={4}
              value={newPage.description}
              onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={newPage.showTitle}
                  onChange={(e) => {
                    console.log('Switch changed to:', e.target.checked);
                    setNewPage(prev => ({
                      ...prev,
                      showTitle: e.target.checked
                    }));
                  }}
                />
              }
              label="Vis titel på landing page"
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 4 }}>
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
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Anbefalet størrelse: 500x500 pixels. Maksimal filstørrelse: 5MB
                      </Typography>
                      {newPage.logo && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Valgt fil: {newPage.logo.name}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 4 }}>
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
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Anbefalet størrelse: 1080x1920 pixels (9:16 format). For bedste visning på mobil. Maksimal filstørrelse: 5MB
                      </Typography>
                      {newPage.backgroundImage && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Valgt fil: {newPage.backgroundImage.name}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ px: 2 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel shrink>Baggrundsfarve</InputLabel>
                            <input
                              type="color"
                              value={newPage.backgroundColor}
                              onChange={(e) => setNewPage({ ...newPage, backgroundColor: e.target.value })}
                              style={{ width: '100%', height: '56px', marginTop: '16px' }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel shrink>Knapfarve</InputLabel>
                            <input
                              type="color"
                              value={newPage.buttonColor}
                              onChange={(e) => setNewPage({ ...newPage, buttonColor: e.target.value })}
                              style={{ width: '100%', height: '56px', marginTop: '16px' }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel shrink>Knap tekstfarve</InputLabel>
                            <input
                              type="color"
                              value={newPage.buttonTextColor}
                              onChange={(e) => setNewPage({ ...newPage, buttonTextColor: e.target.value })}
                              style={{ width: '100%', height: '56px', marginTop: '16px' }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel shrink>Titel farve</InputLabel>
                            <input
                              type="color"
                              value={newPage.titleColor}
                              onChange={(e) => setNewPage({ ...newPage, titleColor: e.target.value })}
                              style={{ width: '100%', height: '56px', marginTop: '16px' }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel shrink>Beskrivelse farve</InputLabel>
                            <input
                              type="color"
                              value={newPage.descriptionColor}
                              onChange={(e) => setNewPage({ ...newPage, descriptionColor: e.target.value })}
                              style={{ width: '100%', height: '56px', marginTop: '16px' }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Tilføj Links
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Link tekst"
                          value={newButton.text}
                          onChange={(e) => setNewButton({ ...newButton, text: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="URL"
                          value={newButton.url}
                          onChange={(e) => setNewButton({ ...newButton, url: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          startIcon={editingButton !== null ? <EditIcon /> : <AddIcon />}
                          onClick={handleAddButton}
                          disabled={!newButton.text || !newButton.url}
                          sx={{ mr: 1 }}
                        >
                          {editingButton !== null ? 'Opdater Link' : 'Tilføj Link'}
                        </Button>
                        {editingButton !== null && (
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              setEditingButton(null);
                              setNewButton({ text: '', url: '' });
                            }}
                          >
                            Annuller Redigering
                          </Button>
                        )}
                      </Grid>
                    </Grid>

                    <List>
                      {newPage.buttons.map((button, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={button.text}
                            secondary={button.url}
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleEditButton(button, index)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleRemoveButton(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Sociale Medier
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Instagram URL"
                          value={newPage.socialLinks.instagram}
                          onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                          InputProps={{
                            startAdornment: <InstagramIcon sx={{ mr: 1 }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Facebook URL"
                          value={newPage.socialLinks.facebook}
                          onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                          InputProps={{
                            startAdornment: <FacebookIcon sx={{ mr: 1 }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="YouTube URL"
                          value={newPage.socialLinks.youtube}
                          onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                          InputProps={{
                            startAdornment: <YouTubeIcon sx={{ mr: 1 }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Twitter URL"
                          value={newPage.socialLinks.twitter}
                          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                          InputProps={{
                            startAdornment: <TwitterIcon sx={{ mr: 1 }} />
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Titel Font</InputLabel>
                      <Select
                        value={newPage.titleFont}
                        onChange={(e) => setNewPage({ ...newPage, titleFont: e.target.value })}
                        label="Titel Font"
                      >
                        <MenuItem value="Inter">Inter (Standard)</MenuItem>
                        <MenuItem value="Roboto">Roboto</MenuItem>
                        <MenuItem value="Playfair Display">Playfair Display</MenuItem>
                        <MenuItem value="Montserrat">Montserrat</MenuItem>
                        <MenuItem value="Lato">Lato</MenuItem>
                        <MenuItem value="Open Sans">Open Sans</MenuItem>
                        <MenuItem value="Raleway">Raleway</MenuItem>
                        <MenuItem value="Poppins">Poppins</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Beskrivelse Font</InputLabel>
                      <Select
                        value={newPage.descriptionFont}
                        onChange={(e) => setNewPage({ ...newPage, descriptionFont: e.target.value })}
                        label="Beskrivelse Font"
                      >
                        <MenuItem value="Inter">Inter (Standard)</MenuItem>
                        <MenuItem value="Roboto">Roboto</MenuItem>
                        <MenuItem value="Playfair Display">Playfair Display</MenuItem>
                        <MenuItem value="Montserrat">Montserrat</MenuItem>
                        <MenuItem value="Lato">Lato</MenuItem>
                        <MenuItem value="Open Sans">Open Sans</MenuItem>
                        <MenuItem value="Raleway">Raleway</MenuItem>
                        <MenuItem value="Poppins">Poppins</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Knap Font</InputLabel>
                      <Select
                        value={newPage.buttonFont}
                        onChange={(e) => setNewPage({ ...newPage, buttonFont: e.target.value })}
                        label="Knap Font"
                      >
                        <MenuItem value="Inter">Inter (Standard)</MenuItem>
                        <MenuItem value="Roboto">Roboto</MenuItem>
                        <MenuItem value="Playfair Display">Playfair Display</MenuItem>
                        <MenuItem value="Montserrat">Montserrat</MenuItem>
                        <MenuItem value="Lato">Lato</MenuItem>
                        <MenuItem value="Open Sans">Open Sans</MenuItem>
                        <MenuItem value="Raleway">Raleway</MenuItem>
                        <MenuItem value="Poppins">Poppins</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    height: '750px',
                    overflow: 'hidden',
                    position: 'relative',
                    '@media (max-width: 600px)': {
                      height: '700px'
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    Live Preview (Mobil format)
                  </Typography>
                  <Box 
                    sx={{ 
                      height: 'calc(100% - 48px)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      p: 0,
                      mt: 0
                    }}
                  >
                    <Box
                      sx={{
                        width: '300px',
                        height: '600px',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '50px',
                        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          right: '12px',
                          bottom: '12px',
                          width: 'calc(100% - 24px)',
                          height: 'calc(100% - 24px)',
                          overflow: 'auto',
                          backgroundColor: '#fff',
                          borderRadius: '50px',
                          '&::-webkit-scrollbar': {
                            display: 'none'
                          },
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          '& > div': {
                            padding: '20px',
                            paddingTop: '60px',
                            paddingBottom: '40px'
                          }
                        }}
                      >
                        <LivePreview />
                      </Box>
                      <Box
                        component="img"
                        src={iPhoneBezel}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none',
                          zIndex: 1,
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            resetNewPage();
            setSelectedPage(null);
          }}>
            Annuller
          </Button>
          <Button
            onClick={selectedPage ? handleUpdate : handleCreatePage}
            variant="contained"
            color="primary"
            disabled={!newPage.title}
          >
            {selectedPage ? 'Opdater' : 'Opret'}
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