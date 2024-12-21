import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { QRCodeSVG } from 'qrcode.react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  Link,
  ButtonGroup,
  IconButton,
  Box,
  Rating,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  ListItemButton,
  Menu,
  ListItemIcon,
  Tooltip,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  ExitToApp as LogoutIcon,
  SwapHoriz as SwitchIcon,
  Refresh as RefreshIcon,
  ArrowDownward,
  ArrowUpward,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  RateReview as RateReviewIcon,
  ContentCopy as ContentCopyIcon,
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from './Layout';
import API_URL from '../config';

// Hjælpefunktioner
const ensureHttps = (url) => {
    if (!url) return url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
};

const prepareChartData = (stands) => {
  const monthlyClicks = stands.reduce((acc, stand) => {
    const clickHistory = stand.clickHistory || [];
    clickHistory.forEach(click => {
      const date = new Date(click.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
    });
    return acc;
  }, {});

  // Få de sidste 7 dage
  const last7Days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const formattedDate = date.toLocaleDateString('da-DK', { 
      day: 'numeric',
      month: 'short'
    });
    
    // Tæl kliks for denne dag
    const dayClicks = stands.reduce((total, stand) => {
      return total + (stand.clickHistory || []).filter(click => {
        const clickDate = new Date(click.timestamp);
        return clickDate.getFullYear() === date.getFullYear() &&
               clickDate.getMonth() === date.getMonth() &&
               clickDate.getDate() === date.getDate();
      }).length;
    }, 0);

    last7Days.push({
      month: formattedDate,
      clicks: dayClicks
    });
  }

  return last7Days;
};

const LocationSelectionDialog = ({ open, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearch = async (query) => {
    try {
      if (!query?.trim()) {
        setPlaces([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/business/search?searchQuery=${encodeURIComponent(query)}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        throw new Error(`For mange søgninger. Vent venligst ${retryAfter} sekunder før du prøver igen.`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Kunne ikke udføre søgning');
      }

      setPlaces(data.places || []);
    } catch (error) {
      console.error('Søgefejl:', error);
      setError(error.message || 'Der opstod en fejl ved søgning. Prøv igen.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce søgningen
  useEffect(() => {
    if (searchQuery) {
      if (searchTimeout) clearTimeout(searchTimeout);
      const newTimeout = setTimeout(() => {
        handleSearch(searchQuery);
      }, 500);
      setSearchTimeout(newTimeout);
    } else {
      setPlaces([]);
    }
  }, [searchQuery]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Søg efter din virksomhed
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Søg efter navn eller adresse"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
            placeholder="F.eks. 'Min Restaurant København' eller 'Butikken Vestergade 1'"
          />
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : places.length > 0 ? (
          <List>
            {places.map((place) => (
              <ListItemButton
                key={place.placeId}
                onClick={() => onSelect(place)}
                sx={{ 
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <BusinessIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={place.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {place.address}
                      </Typography>
                      {place.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Rating value={place.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            ({place.userRatingsTotal} anmeldelser)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        ) : searchQuery.trim() ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">
              Ingen resultater fundet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">
              Indtast søgeord for at finde din virksomhed
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Luk</Button>
      </DialogActions>
    </Dialog>
  );
};

const LoadingButton = ({ loading, disabled, onClick, children, variant = "contained", startIcon }) => (
  <Button
    onClick={onClick}
    disabled={disabled || loading}
    variant={variant}
    startIcon={loading ? <CircularProgress size={20} /> : startIcon}
  >
    {loading ? 'Uploader...' : children}
  </Button>
);

const Dashboard = () => {
  const [stands, setStands] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStand, setSelectedStand] = useState(null);
  const [qrDialog, setQrDialog] = useState({ open: false, standerId: null });
  const [newStand, setNewStand] = useState({ 
    standerId: '', 
    redirectUrl: '', 
    productType: 'stander',
    nickname: ''
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = useTheme();
  const [businessData, setBusinessData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [locationDialog, setLocationDialog] = useState(false);
  const [businessMenu, setBusinessMenu] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [reviewSortOrder, setReviewSortOrder] = useState('desc');
  const [bulkDialog, setBulkDialog] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const PRODUCT_TYPES = {
    STANDER: { value: 'stander', label: 'Stander' },
    STICKER: { value: 'sticker', label: 'Sticker' },
    KORT: { value: 'kort', label: 'Kort' },
    PLATE: { value: 'plate', label: 'Plate' }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setIsLoadingReviews(true);

        // Tjek først sessionStorage for cached data
        const cachedStands = sessionStorage.getItem('dashboardStands');
        const cachedReviews = sessionStorage.getItem('dashboardReviews');
        const cachedBusinessData = sessionStorage.getItem('dashboardBusiness');
        const cacheTimestamp = sessionStorage.getItem('dashboardCacheTimestamp');

        // Tjek om cache er gyldig (mindre end 5 minutter gammel)
        const isCacheValid = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 5 * 60 * 1000;

        if (isCacheValid && cachedStands && cachedReviews && cachedBusinessData) {
          console.log('Bruger cached dashboard data');
          setStands(JSON.parse(cachedStands));
          setReviews(JSON.parse(cachedReviews));
          setBusinessData(JSON.parse(cachedBusinessData));
          setIsLoading(false);
          setIsLoadingReviews(false);
          setIsInitialLoad(false);
          return;
        }

        // Hvis ingen gyldig cache, hent ny data
        const [standsResponse, reviewsResponse] = await Promise.all([
          fetch(`${API_URL}/api/stands`, {
            credentials: 'include'
          }),
          fetch(`${API_URL}/api/business/google-reviews`, {
            credentials: 'include'
          })
        ]);

        if (standsResponse.ok) {
          const standsData = await standsResponse.json();
          setStands(standsData);
          sessionStorage.setItem('dashboardStands', JSON.stringify(standsData));
        }

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setBusinessData(reviewsData.business);
          setReviews(reviewsData.reviews);
          sessionStorage.setItem('dashboardReviews', JSON.stringify(reviewsData.reviews));
          sessionStorage.setItem('dashboardBusiness', JSON.stringify(reviewsData.business));
        }

        // Gem timestamp for cachen
        sessionStorage.setItem('dashboardCacheTimestamp', Date.now().toString());

      } catch (error) {
        console.error('Fejl ved indlæsning af data:', error);
        setAlert({
          open: true,
          message: 'Der opstod en fejl ved indlæsning af data',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
        setIsLoadingReviews(false);
        setIsInitialLoad(false);
      }
    };

    if (isInitialLoad) {
      fetchInitialData();
    }
  }, [isInitialLoad]);

  // Funktion til at tvinge genindlæsning af data
  const handleRefreshData = async () => {
    // Ryd cache
    sessionStorage.removeItem('dashboardStands');
    sessionStorage.removeItem('dashboardReviews');
    sessionStorage.removeItem('dashboardBusiness');
    sessionStorage.removeItem('dashboardCacheTimestamp');
    
    // Sæt isInitialLoad til true for at tvinge genindlæsning
    setIsInitialLoad(true);
  };

  // Opdater kun Google reviews når locationDialog lukkes
  useEffect(() => {
    let isSubscribed = true;
    let retryTimeout;

    const fetchGoogleReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/business/google-reviews`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 429) {
          // Vent 60 sekunder før næste forsøg ved rate limiting
          console.log('Rate limit nået, venter 60 sekunder...');
          await new Promise(resolve => setTimeout(resolve, 60000));
          return await fetchGoogleReviews();
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.business) {
          setBusinessData(data.business);
          setReviews(data.reviews);
          
          // Gem i sessionStorage
          sessionStorage.setItem('dashboardReviews', JSON.stringify(data.reviews));
          sessionStorage.setItem('dashboardBusiness', JSON.stringify(data.business));
          sessionStorage.setItem('dashboardCacheTimestamp', Date.now().toString());
        }
      } catch (error) {
        console.error('Fejl ved hentning af Google anmeldelser:', error);
        // Vis ikke fejl hvis der ikke er tilknyttet en virksomhed
        if (error.message !== 'HTTP error! status: 404') {
          setAlert({
            open: true,
            message: 'Der opstod en fejl ved hentning af anmeldelser. Prøver igen om lidt...',
            severity: 'error'
          });
        }
      }
    };

    const fetchData = async () => {
      if (isSubscribed) {
        await fetchGoogleReviews();
      }
    };

    fetchData();

    return () => {
      isSubscribed = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  const handleAddStand = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newStand)
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Produkt tilføjet succesfuldt',
          severity: 'success'
        });
        setOpenDialog(false);
        setNewStand({
          standerId: '',
          redirectUrl: '',
          productType: 'stander',
          nickname: ''
        });
        
        // Hent opdateret liste af stands
        const standsResponse = await fetch(`${API_URL}/api/stands`, {
          credentials: 'include'
        });
        if (standsResponse.ok) {
          const standsData = await standsResponse.json();
          setStands(standsData);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Kunne ikke tilføje produkt');
      }
    } catch (error) {
      console.error('Fejl ved tilføjelse af produkt:', error);
      setAlert({
        open: true,
        message: error.message || 'Der opstod en fejl ved tilføjelse af produkt',
        severity: 'error'
      });
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    try {
      const stand = stands.find(s => s._id === id);
      if (!stand) return;

      const response = await fetch(`${API_URL}/api/stands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          standerId: stand.standerId,
          redirectUrl: stand.redirectUrl,
          productType: stand.productType,
          nickname: stand.nickname
        })
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Produkt opdateret succesfuldt',
          severity: 'success'
        });
        setEditingId(null);
        
        // Hent opdateret liste af stands
        const standsResponse = await fetch(`${API_URL}/api/stands`, {
          credentials: 'include'
        });
        if (standsResponse.ok) {
          const standsData = await standsResponse.json();
          setStands(standsData);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Kunne ikke opdatere produkt');
      }
    } catch (error) {
      console.error('Fejl ved opdatering af produkt:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved opdatering af produkt',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Er du sikker på, at du vil slette dette produkt?')) {
      try {
        const response = await fetch(`${API_URL}/api/stands/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setAlert({
            open: true,
            message: 'Produkt slettet succesfuldt',
            severity: 'success'
          });
          
          // Hent opdateret liste af stands
          const standsResponse = await fetch(`${API_URL}/api/stands`, {
            credentials: 'include'
          });
          if (standsResponse.ok) {
            const standsData = await standsResponse.json();
            setStands(standsData);
          }
        } else {
          throw new Error('Kunne ikke slette produkt');
        }
      } catch (error) {
        console.error('Fejl ved sletning af produkt:', error);
        setAlert({
          open: true,
          message: 'Der opstod en fejl ved sletning af produkt',
          severity: 'error'
        });
      }
    }
  };

  const handleQrDownload = (standerId) => {
    const qrSvg = document.createElement('div');
    qrSvg.innerHTML = ReactDOMServer.renderToString(
      <QRCodeSVG
        value={`https://api.tapfeed.dk/${standerId}`}
        size={1000}
        level="H"
      />
    );
    const svg = qrSvg.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `qr-${standerId}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  const handleSetupGoogleMaps = () => {
    setLocationDialog(true);
  };

  const handleLocationSelect = async (location) => {
    try {
      setIsLoadingReviews(true);
      const response = await fetch(`${API_URL}/api/business/setup-google-maps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ placeId: location.placeId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kunne ikke opsætte Google Maps integration');
      }

      setBusinessData(data.business);
      setReviews(data.reviews);
      setAlert({
        open: true,
        message: `Google Maps integration opsat succesfuldt for "${location.name}"`,
        severity: 'success'
      });
      
      // Luk dialogen efter vi har sat dataen
      setTimeout(() => {
        setLocationDialog(false);
      }, 100);
    } catch (error) {
      console.error('Fejl ved opsætning af Google Maps:', error);
      setAlert({
        open: true,
        message: error.message || 'Der opstod en fejl ved opsætning af Google Maps integration',
        severity: 'error'
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleBusinessMenuClick = (event) => {
    setBusinessMenu(event.currentTarget);
  };

  const handleBusinessMenuClose = () => {
    setBusinessMenu(null);
  };

  const handleLogoutBusiness = async () => {
    try {
      const response = await fetch(`${API_URL}/api/business/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Kunne ikke logge ud af Google Business');
      }

      setBusinessData(null);
      setReviews([]);
      setAlert({
        open: true,
        message: 'Logget ud af Google Business Profile',
        severity: 'success'
      });
    } catch (error) {
      console.error('Fejl ved logout:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved logout',
        severity: 'error'
      });
    } finally {
      handleBusinessMenuClose();
    }
  };

  const fetchStands = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/stands`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStands(data);
      }
    } catch (error) {
      console.error('Fejl ved hentning af stands:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved hentning af produkter',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;

    setBulkLoading(true);
    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      const response = await fetch(`${API_URL}/api/stands/bulk`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Kunne ikke uploade produkter');
      }

      const result = await response.json();
      setAlert({
        open: true,
        message: `${result.added} produkter tilføjet succesfuldt`,
        severity: 'success'
      });

      setBulkDialog(false);
      setBulkFile(null);
      await fetchStands();
    } catch (error) {
      console.error('Fejl ved bulk upload:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved upload af produkter',
        severity: 'error'
      });
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <Layout title="Dashboard">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleRefreshData}
          disabled={isLoading}
          startIcon={<RefreshIcon />}
        >
          {isLoading ? 'Opdaterer...' : 'Opdater data'}
        </Button>
      </Box>
      <Grid container spacing={3}>
        {/* Statistik sektion */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 360 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Samlet trafik oversigt
            </Typography>
            <BarChart
              xAxis={[{
                scaleType: 'band',
                data: prepareChartData(stands).map(item => item.month),
                label: 'Dage',
                tickLabelStyle: { 
                  fill: mode === 'dark' ? 'white' : 'black'
                },
                labelStyle: { 
                  fill: mode === 'dark' ? 'white' : 'black'
                }
              }]}
              yAxis={[{
                tickLabelStyle: { 
                  fill: mode === 'dark' ? 'white' : 'black'
                },
                labelStyle: { 
                  fill: mode === 'dark' ? 'white' : 'black'
                }
              }]}
              series={[{
                data: prepareChartData(stands).map(item => item.clicks),
                label: 'Antal klik',
                color: mode === 'dark' ? '#4CAF50' : '#2E7D32'
              }]}
              height={300}
              sx={{
                '.MuiChartsAxis-label': { 
                  fill: mode === 'dark' ? 'white' : 'black'
                },
                '.MuiChartsAxis-tick': { 
                  fill: mode === 'dark' ? 'white' : 'black'
                },
                '.MuiChartsAxis-line': { 
                  stroke: mode === 'dark' ? 'white' : 'black'
                },
                '.MuiChartsLegend-label': { 
                  fill: mode === 'dark' ? 'white' : 'black'
                },
                '.MuiChartsLegend-root': { 
                  color: mode === 'dark' ? 'white' : 'black'
                }
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Google Maps Anmeldelser
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Virksomhedsoplysninger
                    </Typography>
                    {businessData ? (
                      <>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                          <Typography variant="h3" color="primary" gutterBottom>
                            {businessData?.rating || '-'}
                          </Typography>
                          <Typography variant="subtitle1" gutterBottom>
                            Gennemsnitlig vurdering
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            <Rating
                              value={businessData?.rating || 0}
                              precision={0.1}
                              readOnly
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Baseret på {businessData?.user_ratings_total || 0} anmeldelser
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <BusinessIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Virksomhedsnavn"
                              secondary={businessData.name}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <LocationIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Adresse"
                              secondary={businessData.formatted_address}
                            />
                          </ListItem>
                          {businessData.formatted_phone_number && (
                            <ListItem>
                              <ListItemIcon>
                                <PhoneIcon />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Telefon"
                                secondary={businessData.formatted_phone_number}
                              />
                            </ListItem>
                          )}
                          {businessData.website && (
                            <ListItem>
                              <ListItemIcon>
                                <LanguageIcon />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Hjemmeside"
                                secondary={
                                  <Link href={businessData.website} target="_blank" rel="noopener noreferrer">
                                    {businessData.website}
                                  </Link>
                                }
                              />
                            </ListItem>
                          )}
                          <ListItem>
                            <ListItemIcon>
                              <RateReviewIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Review Link"
                              secondary={
                                <Button
                                  size="small"
                                  startIcon={<ContentCopyIcon />}
                                  onClick={() => {
                                    const reviewUrl = `https://search.google.com/local/writereview?placeid=${businessData.place_id}`;
                                    navigator.clipboard.writeText(reviewUrl);
                                    setAlert({
                                      open: true,
                                      message: 'Review link kopieret til udklipsholder',
                                      severity: 'success'
                                    });
                                  }}
                                >
                                  Kopier review link
                                </Button>
                              }
                            />
                          </ListItem>
                        </List>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography color="text.secondary">
                          Ingen virksomhedsdata tilgængelig
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Seneste anmeldelser
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          onClick={() => setReviewSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                          startIcon={reviewSortOrder === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                        >
                          {reviewSortOrder === 'desc' ? 'Nyeste først' : 'Ældste først'}
                        </Button>
                        {businessData?.place_id ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              startIcon={<LaunchIcon />}
                              href={`https://search.google.com/local/reviews?placeid=${businessData.place_id}`}
                              target="_blank"
                            >
                              Se alle anmeldelser
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={handleBusinessMenuClick}
                              startIcon={<BusinessIcon />}
                            >
                              Administrer lokation
                            </Button>
                            <Menu
                              anchorEl={businessMenu}
                              open={Boolean(businessMenu)}
                              onClose={handleBusinessMenuClose}
                            >
                              <MenuItem onClick={() => {
                                handleBusinessMenuClose();
                                setLocationDialog(true);
                              }}>
                                <ListItemIcon>
                                  <SwitchIcon fontSize="small" />
                                </ListItemIcon>
                                Skift lokation
                              </MenuItem>
                              <MenuItem onClick={handleLogoutBusiness}>
                                <ListItemIcon>
                                  <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Log ud af Google Business
                              </MenuItem>
                            </Menu>
                          </Box>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={handleSetupGoogleMaps}
                            startIcon={<AddIcon />}
                          >
                            Tilknyt din virksomhed
                          </Button>
                        )}
                      </Box>
                    </Box>
                    {isLoadingReviews ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : reviews.length > 0 ? (
                      <List>
                        {[...reviews]
                          .sort((a, b) => {
                            const sortMultiplier = reviewSortOrder === 'desc' ? -1 : 1;
                            return sortMultiplier * (a.time - b.time);
                          })
                          .map((review, index) => (
                            <React.Fragment key={review.time}>
                              <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                  <Avatar src={review.profile_photo_url} alt={review.author_name}>
                                    {review.author_name[0]}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography component="span" variant="subtitle2">
                                        {review.author_name}
                                      </Typography>
                                      <Rating value={review.rating} size="small" readOnly />
                                      <Typography variant="caption" color="text.secondary">
                                        {new Date(review.time * 1000).toLocaleDateString('da-DK')}
                                      </Typography>
                                    </Box>
                                  }
                                  secondary={
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      {review.text}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              {index < reviews.length - 1 && <Divider />}
                            </React.Fragment>
                          ))}
                      </List>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography color="text.secondary">
                          Ingen anmeldelser at vise
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Top 5 mest besøgte produkter
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produkttype</TableCell>
                    <TableCell>Kaldenavn</TableCell>
                    <TableCell align="right">Produkt ID</TableCell>
                    <TableCell align="right">Antal klik</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stands
                    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                    .slice(0, 5)
                    .map(stand => (
                      <TableRow key={stand._id}>
                        <TableCell>
                          <Tooltip title={stand.nickname || 'Intet kaldenavn'} arrow>
                            <Box component="span" sx={{ cursor: 'help' }}>
                              {PRODUCT_TYPES[stand.productType.toUpperCase()]?.label || stand.productType}
                            </Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{stand.nickname || '-'}</TableCell>
                        <TableCell align="right">
                          <Tooltip title={stand.nickname || 'Intet kaldenavn'} arrow>
                            <Box component="span" sx={{ cursor: 'help' }}>
                              {stand.standerId}
                            </Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{stand.clicks || 0}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Klik per produkttype
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produkttype</TableCell>
                    <TableCell align="right">Antal produkter</TableCell>
                    <TableCell align="right">Samlet antal klik</TableCell>
                    <TableCell align="right">Gennemsnit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(PRODUCT_TYPES).map(type => {
                    const productsOfType = stands.filter(s => s.productType === type.value);
                    const totalClicks = productsOfType.reduce((sum, stand) => sum + (stand.clicks || 0), 0);
                    const avgClicks = productsOfType.length ? (totalClicks / productsOfType.length).toFixed(1) : 0;
                    
                    return (
                      <TableRow key={type.value}>
                        <TableCell>
                          <Tooltip 
                            title={
                              productsOfType.length > 0 
                                ? `Produkter: ${productsOfType.map(p => p.nickname || p.standerId).join(', ')}` 
                                : 'Ingen produkter'
                            } 
                            arrow
                          >
                            <Box component="span" sx={{ cursor: 'help' }}>
                              {type.label}
                            </Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{productsOfType.length}</TableCell>
                        <TableCell align="right">{totalClicks}</TableCell>
                        <TableCell align="right">{avgClicks}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Produkter sektion */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary">
                Produkter
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => setBulkDialog(true)}
                >
                  Bulk Upload
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Tilføj Produkt
                </Button>
              </Box>
            </Box>
            {isLoading ? (
              <CircularProgress />
            ) : stands.length === 0 ? (
              <Typography>Ingen produkter tilføjet endnu</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Tooltip title="Et unikt ID for dit produkt" arrow placement="top">
                          <Box component="span" sx={{ cursor: 'help' }}>
                            Produkt ID
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Et valgfrit navn til at identificere dit produkt" arrow placement="top">
                          <Box component="span" sx={{ cursor: 'help' }}>
                            Kaldenavn
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Den URL som QR koden peger på" arrow placement="top">
                          <Box component="span" sx={{ cursor: 'help' }}>
                            TapFeed URL
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Den URL som brugeren bliver sendt videre til" arrow placement="top">
                          <Box component="span" sx={{ cursor: 'help' }}>
                            Redirect URL
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Typen af fysisk produkt" arrow placement="top">
                          <Box component="span" sx={{ cursor: 'help' }}>
                            Produkttype
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Antal gange QR koden er blevet scannet" arrow placement="top">
                          <Box component="span" sx={{ cursor: 'help' }}>
                            Antal Klik
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>Handlinger</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stands.map((stand) => (
                      <TableRow key={stand._id}>
                        <TableCell>{stand.standerId}</TableCell>
                        <TableCell>
                          {editingId === stand._id ? (
                            <TextField
                              value={stand.nickname || ''}
                              onChange={(e) => {
                                const updatedStands = stands.map(s =>
                                  s._id === stand._id ? { ...s, nickname: e.target.value } : s
                                );
                                setStands(updatedStands);
                              }}
                              fullWidth
                              placeholder="Tilføj kaldenavn"
                            />
                          ) : (
                            stand.nickname || '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`https://api.tapfeed.dk/${stand.standerId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            api.tapfeed.dk/{stand.standerId}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {editingId === stand._id ? (
                            <TextField
                              value={stand.redirectUrl}
                              onChange={(e) => {
                                const updatedStands = stands.map(s =>
                                  s._id === stand._id ? { ...s, redirectUrl: e.target.value } : s
                                );
                                setStands(updatedStands);
                              }}
                              fullWidth
                            />
                          ) : (
                            <Link href={ensureHttps(stand.redirectUrl)} target="_blank" rel="noopener noreferrer">
                              {stand.redirectUrl}
                            </Link>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === stand._id ? (
                            <FormControl fullWidth>
                              <Select
                                value={stand.productType}
                                onChange={(e) => {
                                  const updatedStands = stands.map(s =>
                                    s._id === stand._id ? { ...s, productType: e.target.value } : s
                                  );
                                  setStands(updatedStands);
                                }}
                              >
                                {Object.values(PRODUCT_TYPES).map(type => (
                                  <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            PRODUCT_TYPES[stand.productType.toUpperCase()]?.label || stand.productType
                          )}
                        </TableCell>
                        <TableCell>{stand.clicks || 0}</TableCell>
                        <TableCell>
                          <ButtonGroup>
                            {editingId === stand._id ? (
                              <Tooltip title="Gem ændringer" arrow>
                                <IconButton
                                  onClick={() => handleSave(stand._id)}
                                  color="primary"
                                >
                                  <SaveIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Rediger produkt" arrow>
                                <IconButton
                                  onClick={() => handleEdit(stand._id)}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Download QR kode" arrow>
                              <IconButton
                                onClick={() => handleQrDownload(stand.standerId)}
                                color="secondary"
                              >
                                <QrCodeIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Slet produkt" arrow>
                              <IconButton
                                onClick={() => handleDelete(stand._id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogs og Snackbar */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Tilføj Nyt Produkt</DialogTitle>
        <DialogContent>
          <Tooltip title="Et unikt ID der identificerer dit produkt i systemet" arrow placement="top-start">
            <TextField
              autoFocus
              margin="dense"
              label="Produkt ID"
              fullWidth
              value={newStand.standerId}
              onChange={(e) => setNewStand({ ...newStand, standerId: e.target.value })}
              helperText="F.eks. 'cafe-bord-1' eller 'butik-vestergade'"
            />
          </Tooltip>
          <Tooltip title="Et valgfrit navn der gør det lettere at genkende produktet" arrow placement="top-start">
            <TextField
              margin="dense"
              label="Kaldenavn (valgfrit)"
              fullWidth
              value={newStand.nickname}
              onChange={(e) => setNewStand({ ...newStand, nickname: e.target.value })}
              placeholder="F.eks. 'Butik Vestergade' eller 'Café bord 1'"
              helperText="Gør det lettere at identificere produktet i oversigten"
            />
          </Tooltip>
          <Tooltip title="Den URL som brugeren bliver sendt videre til når de scanner QR koden" arrow placement="top-start">
            <TextField
              margin="dense"
              label="Redirect URL"
              fullWidth
              value={newStand.redirectUrl}
              onChange={(e) => setNewStand({ ...newStand, redirectUrl: e.target.value })}
              helperText="F.eks. 'https://minbutik.dk/menu' eller 'https://facebook.com/minside'"
            />
          </Tooltip>
          <Tooltip title="Vælg den type produkt du vil oprette" arrow placement="top-start">
            <FormControl fullWidth margin="dense">
              <InputLabel>Produkttype</InputLabel>
              <Select
                value={newStand.productType}
                onChange={(e) => setNewStand({ ...newStand, productType: e.target.value })}
              >
                {Object.values(PRODUCT_TYPES).map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Vælg den type fysisk produkt du vil bruge</FormHelperText>
            </FormControl>
          </Tooltip>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuller</Button>
          <Button onClick={handleAddStand} variant="contained">Tilføj</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={qrDialog.open} 
        onClose={() => setQrDialog({ open: false, standerId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>QR Kode</DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            p: 2 
          }}>
            <Box sx={{ 
              bgcolor: 'white', 
              p: 3, 
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <QRCodeSVG
                value={`https://api.tapfeed.dk/${qrDialog.standerId}`}
                size={200}
                level="H"
              />
            </Box>
            <Typography variant="body1" color="text.secondary">
              Denne QR kode leder til:
            </Typography>
            <Link 
              href={`https://api.tapfeed.dk/${qrDialog.standerId}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mb: 2 }}
            >
              api.tapfeed.dk/{qrDialog.standerId}
            </Link>
            <Button
              variant="contained"
              onClick={() => handleQrDownload(qrDialog.standerId)}
              startIcon={<DownloadIcon />}
            >
              Download QR Kode
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialog({ open: false, standerId: null })}>
            Luk
          </Button>
        </DialogActions>
      </Dialog>

      <LocationSelectionDialog
        open={locationDialog}
        onClose={() => setLocationDialog(false)}
        onSelect={handleLocationSelect}
      />

      <Dialog open={bulkDialog} onClose={() => setBulkDialog(false)}>
        <DialogTitle>Bulk Upload af Produkter</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" gutterBottom>
              Upload en CSV fil med følgende kolonner:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 2 }}>
              <ul>
                <li>standerId (påkrævet)</li>
                <li>redirectUrl (påkrævet)</li>
                <li>productType (valgfri, standard er 'stander')</li>
                <li>nickname (valgfri)</li>
              </ul>
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Vælg CSV Fil
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => setBulkFile(e.target.files[0])}
              />
            </Button>
            {bulkFile && (
              <Typography variant="body2" color="text.secondary">
                Valgt fil: {bulkFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialog(false)}>Annuller</Button>
          <LoadingButton
            onClick={handleBulkUpload}
            loading={bulkLoading}
            disabled={!bulkFile}
          >
            Upload
          </LoadingButton>
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

export default Dashboard; 