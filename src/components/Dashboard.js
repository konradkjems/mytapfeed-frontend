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
  CardMedia,
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
  MenuBook as GuideIcon,
  Star as StarIcon,
  Link as LinkIcon,
  Web as WebIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  TouchApp as TouchAppIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  CompareArrows as CompareArrowsIcon,
  TrendingUp as TrendingUpIcon,
  Update as UpdateIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from './Layout';
import API_URL from '../config';
import { useNavigate } from 'react-router-dom';

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
  const { userData } = useAuth();
  const [stands, setStands] = useState([]);
  const [unclaimedStands, setUnclaimedStands] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStand, setSelectedStand] = useState(null);
  const [qrDialog, setQrDialog] = useState({ open: false, standerId: null });
  const [newStand, setNewStand] = useState({ 
    standerId: '', 
    redirectUrl: '', 
    productType: 'stander',
    nickname: '',
    redirectType: 'redirect',
    landingPageId: ''
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalStands, setTotalStands] = useState(0);
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
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'
  const [editDialog, setEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editNickname, setEditNickname] = useState('');
  const [landingPages, setLandingPages] = useState([]);
  const [selectedLandingPage, setSelectedLandingPage] = useState('');
  const [editRedirectUrl, setEditRedirectUrl] = useState('');
  const [editType, setEditType] = useState('redirect'); // 'redirect' eller 'landing'
  const navigate = useNavigate();

  const PRODUCT_TYPES = {
    STANDER: { value: 'stander', label: 'Stander' },
    STICKER: { value: 'sticker', label: 'Sticker' },
    KORT: { value: 'kort', label: 'Kort' },
    PLATE: { value: 'plate', label: 'Plate' }
  };

  const prepareTimeSeriesData = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Konverter til UTC

    const ranges = {
      week: 7,
      month: 30,
      year: 365
    };
    const days = ranges[timeRange];

    // Initialiser arrays med dage og klik
    const data = Array(days).fill(0);
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - i - 1));
      return date.toLocaleDateString('da-DK', { 
        day: 'numeric',
        month: 'short'
      });
    });

    // Tæl klik for hver dag
    stands.forEach(stand => {
      (stand.clickHistory || []).forEach(click => {
        const clickDate = new Date(click.timestamp);
        clickDate.setHours(0, 0, 0, 0);
        clickDate.setMinutes(clickDate.getMinutes() - clickDate.getTimezoneOffset()); // Konverter til UTC
        const diffDays = Math.floor((now - clickDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays < days) {
          data[days - diffDays - 1]++;
        }
      });
    });

    return { data, labels };
  };

  const timeSeriesData = prepareTimeSeriesData();

  const fetchInitialData = async () => {
    try {
      const cachedData = sessionStorage.getItem('dashboardStands');
      const cacheTimestamp = sessionStorage.getItem('dashboardCacheTimestamp');
      const isCacheValid = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 60 * 1000; // Reducer til 1 minut

      if (isCacheValid && cachedData) {
        console.log('Bruger cached dashboard data');
        setStands(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/stands`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStands(data);
        sessionStorage.setItem('dashboardStands', JSON.stringify(data));
        sessionStorage.setItem('dashboardCacheTimestamp', Date.now().toString());
      } else {
        throw new Error('Kunne ikke hente produkter');
      }
    } catch (error) {
      console.error('Fejl ved hentning af produkter:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved hentning af produkter',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Tilføj automatisk opdatering hvert minut
  useEffect(() => {
    const interval = setInterval(() => {
      fetchInitialData();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      // Ryd cache
      sessionStorage.removeItem('dashboardStands');
      sessionStorage.removeItem('dashboardReviews');
      sessionStorage.removeItem('dashboardBusiness');
      sessionStorage.removeItem('dashboardCacheTimestamp');

      // Hent ny data
      await fetchInitialData();

      setAlert({
        open: true,
        message: 'Data opdateret succesfuldt',
        severity: 'success'
      });
    } catch (error) {
      console.error('Fejl ved opdatering af data:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved opdatering af data',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Opdater kun Google reviews når locationDialog lukkes
  useEffect(() => {
    let isSubscribed = true;
    let retryTimeout;

    const fetchGoogleReviews = async (retryCount = 0) => {
      try {
        const response = await fetch(`${API_URL}/api/business/google-reviews`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 429) {
          if (retryCount < 3) { // Max 3 forsøg
            console.log(`Rate limit nået, forsøg ${retryCount + 1}/3. Venter 60 sekunder...`);
            // Vent 60 sekunder før næste forsøg
            await new Promise(resolve => setTimeout(resolve, 60000));
            return await fetchGoogleReviews(retryCount + 1);
          } else {
            throw new Error('Rate limit nået - prøv igen senere');
          }
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (isSubscribed) {
          if (data.business) {
            setBusinessData(data.business);
            setReviews(data.reviews);
            
            // Gem i sessionStorage
            sessionStorage.setItem('dashboardReviews', JSON.stringify(data.reviews));
            sessionStorage.setItem('dashboardBusiness', JSON.stringify(data.business));
            sessionStorage.setItem('dashboardCacheTimestamp', Date.now().toString());
          }
        }
      } catch (error) {
        console.error('Fejl ved hentning af Google anmeldelser:', error);
        // Vis ikke fejl hvis der ikke er tilknyttet en virksomhed
        if (error.message !== 'HTTP error! status: 404' && isSubscribed) {
          setAlert({
            open: true,
            message: error.message || 'Der opstod en fejl ved hentning af anmeldelser',
            severity: 'error'
          });
        }
      }
    };

    // Tjek først om vi har cached data
    const cachedReviews = sessionStorage.getItem('dashboardReviews');
    const cachedBusiness = sessionStorage.getItem('dashboardBusiness');
    const cacheTimestamp = sessionStorage.getItem('dashboardCacheTimestamp');
    const isCacheValid = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 5 * 60 * 1000; // 5 minutter cache

    if (isCacheValid && cachedReviews && cachedBusiness) {
      setBusinessData(JSON.parse(cachedBusiness));
      setReviews(JSON.parse(cachedReviews));
    } else {
      fetchGoogleReviews();
    }

    return () => {
      isSubscribed = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  const fetchUnclaimedStands = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stands/unclaimed`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUnclaimedStands(data);
      }
    } catch (error) {
      console.error('Fejl ved hentning af unclaimed produkter:', error);
    }
  };

  useEffect(() => {
    if (openDialog) {
      fetchUnclaimedStands();
    }
  }, [openDialog]);

  // Hjælpefunktion til at generere landing page URL
  const getLandingPageUrl = (landingPageId) => {
    const selectedPage = landingPages.find(page => page._id === landingPageId);
    return selectedPage?.urlPath 
      ? `${window.location.origin}/${selectedPage.urlPath}`
      : `${window.location.origin}/landing/${landingPageId}`;
  };

  const handleAddStand = async () => {
    try {
      const unclaimedStand = unclaimedStands.find(
        stand => stand.standerId === newStand.standerId
      );

      if (!unclaimedStand) {
        setAlert({
          open: true,
          message: 'Dette Produkt ID findes ikke i listen over tilgængelige produkter. Kontakt support hvis du har brug for flere produkter.',
          severity: 'error'
        });
        return;
      }

      // Bestem redirect URL baseret på valgt type
      const redirectUrl = newStand.redirectType === 'landing' && newStand.landingPageId
        ? getLandingPageUrl(newStand.landingPageId)
        : newStand.redirectUrl;

      const response = await fetch(`${API_URL}/api/stands/${unclaimedStand._id}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          nickname: newStand.nickname,
          redirectUrl: redirectUrl,
          productType: newStand.productType,
          landingPageId: newStand.redirectType === 'landing' ? newStand.landingPageId : null
        })
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Produkt aktiveret succesfuldt',
          severity: 'success'
        });
        setOpenDialog(false);
        setNewStand({
          standerId: '',
          redirectUrl: '',
          productType: 'stander',
          nickname: '',
          redirectType: 'redirect',
          landingPageId: ''
        });
        
        fetchStands();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Kunne ikke aktivere produkt');
      }
    } catch (error) {
      console.error('Fejl ved aktivering af produkt:', error);
      setAlert({
        open: true,
        message: error.message || 'Der opstod en fejl ved aktivering af produkt',
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
          nickname: stand.nickname,
          landingPageId: stand.landingPageId
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

  const guides = [
    {
      id: 'reviews',
      title: 'Få flere Google anmeldelser',
      description: 'Lær hvordan du kan bruge TapFeed til at få flere positive anmeldelser på Google.',
      thumbnail: 'https://images.pexels.com/photos/6894066/pexels-photo-6894066.jpeg',
      icon: <StarIcon />,
      content: (
        <>
          <Typography variant="h6" gutterBottom>
            Sådan får du flere Google anmeldelser med TapFeed
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText 
                primary="1. Find dit Produkt ID" 
                secondary="Lokaliser det unikke Produkt ID på dit TapFeed produkt (f.eks. 'XYZ123'). Dette ID er trykt på produktet."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText 
                primary="2. Tilføj din Google anmeldelsesside" 
                secondary="Find din virksomheds Google anmeldelsesside under 'Google Maps Anmeldelser' på dit dashboard. Her kan du kopiere linket direkte og indsætte det i 'Redirect URL' feltet når du opretter eller redigerer et produkt."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <LocationIcon />
              </ListItemIcon>
              <ListItemText 
                primary="3. Placer produktet strategisk" 
                secondary="Placer dit TapFeed produkt hvor dine kunder naturligt vil se det, f.eks. ved udgangen, på bordene eller ved kassen."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <RateReviewIcon />
              </ListItemIcon>
              <ListItemText 
                primary="4. Aktiver kunderne" 
                secondary="Opfordr dine kunder til at bruge TapFeed produktet ved at scanne QR koden eller holde deres telefon mod NFC chippen for at dele deres oplevelse på Google."
              />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tips til succes:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  secondary="• Placer flere TapFeed produkter forskellige steder i din virksomhed"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  secondary="• Følg op på nye anmeldelser og svar på dem"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  secondary="• Brug statistikken til at se hvilke placeringer der virker bedst"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  secondary="• Opdater jævnligt placeringen af dine TapFeed produkter for maksimal effekt"
                />
              </ListItem>
            </List>
          </Box>
        </>
      )
    },
    {
      id: 'landing-pages',
      title: 'Opret effektive landing pages',
      description: 'Få tips til at lave engagerende landing pages der konverterer besøgende til kunder.',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      icon: <WebIcon />,
      content: (
        <>
          <Typography variant="h6" gutterBottom>
            Guide til at lave effektive landing pages
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <TitleIcon />
              </ListItemIcon>
              <ListItemText 
                primary="1. Skriv en fængende titel" 
                secondary="Brug en klar og handlingsorienteret titel der fortæller hvad besøgende kan få eller opnå."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText 
                primary="2. Lav en overbevisende beskrivelse" 
                secondary="Forklar kort og præcist værditilbuddet og hvorfor besøgende skal vælge din virksomhed."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="3. Tilføj visuelt indhold" 
                secondary="Upload et professionelt logo og et relevant baggrundsbillede der understøtter dit budskab."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <TouchAppIcon />
              </ListItemIcon>
              <ListItemText 
                primary="4. Skab tydelige handlingsknapper" 
                secondary="Tilføj knapper med klare opfordringer til handling, f.eks. 'Book nu' eller 'Se menu'."
              />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tips til optimering:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  secondary="• Hold designet enkelt og fokuseret på ét primært mål"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  secondary="• Brug farver der matcher din brandidentitet"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  secondary="• Test forskellige versioner for at se hvad der virker bedst"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  secondary="• Tilføj sociale medier for at øge troværdigheden"
                />
              </ListItem>
            </List>
          </Box>
        </>
      )
    },
    {
      id: 'statistics',
      title: 'Forstå din statistik',
      description: 'Lær at analysere din data og optimere dine resultater med TapFeed statistik.',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
      icon: <BarChartIcon />,
      content: (
        <>
          <Typography variant="h6" gutterBottom>
            Sådan bruger du TapFeed statistik
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText 
                primary="1. Følg dine klik over tid" 
                secondary="Se hvordan antallet af interaktioner udvikler sig dag for dag, uge for uge eller måned for måned."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CompareArrowsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="2. Sammenlign produkter" 
                secondary="Analyser hvilke produkter og placeringer der genererer flest interaktioner."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText 
                primary="3. Identificer trends" 
                secondary="Find mønstre i brugeradfærd og identificer de mest effektive tidspunkter og placeringer."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <UpdateIcon />
              </ListItemIcon>
              <ListItemText 
                primary="4. Optimer løbende" 
                secondary="Brug indsigterne til at justere dine produkters placering og strategi."
              />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Nøgletal at holde øje med:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  secondary="• Totale antal klik per produkt"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  secondary="• Gennemsnitlige daglige interaktioner"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  secondary="• Højt og lavt performende placeringer"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  secondary="• Sæsonmæssige udsving i aktivitet"
                />
              </ListItem>
            </List>
          </Box>
        </>
      )
    }
  ];

  const fetchDashboard = async () => {
    try {
      console.log('Henter dashboard data...');
      setIsLoading(true);
      
      // Hent brugerens stands
      const standsResponse = await fetch(`${API_URL}/api/stands`, {
        credentials: 'include'
      });

      if (!standsResponse.ok) {
        throw new Error('Kunne ikke hente produkter');
      }

      const standsData = await standsResponse.json();
      console.log('Produkter hentet:', standsData);
      
      // Beregn totaler
      const totalStandsCount = standsData.length;
      const totalClicksCount = standsData.reduce((sum, stand) => sum + (stand.clicks || 0), 0);

      // Opdater state
      setStands(standsData);
      setTotalStands(totalStandsCount);
      setTotalClicks(totalClicksCount);
      setDashboardData({
        stands: standsData,
        totalStands: totalStandsCount,
        totalClicks: totalClicksCount
      });
      
      // Gem i sessionStorage
      sessionStorage.setItem('dashboardStands', JSON.stringify(standsData));
      sessionStorage.setItem('dashboardCacheTimestamp', Date.now().toString());
    } catch (error) {
      console.error('Fejl ved hentning af dashboard data:', error);
      setError('Der opstod en fejl ved hentning af dashboard data');
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved hentning af data',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchGoogleReviews();
  }, []);

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setEditNickname(product.nickname || '');
    setEditRedirectUrl(product.redirectUrl || '');
    if (product.landingPageId) {
      setEditType('landing');
      setSelectedLandingPage(product.landingPageId);
    } else {
      setEditType('redirect');
      setSelectedLandingPage('');
    }
    setEditDialog(true);
  };

  const handleEditProduct = async () => {
    try {
      // Bestem redirect URL baseret på valgt type
      const redirectUrl = editType === 'landing' && selectedLandingPage
        ? getLandingPageUrl(selectedLandingPage)
        : editRedirectUrl;

      const response = await fetch(`${API_URL}/api/stands/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          nickname: editNickname,
          landingPageId: editType === 'landing' ? selectedLandingPage : null,
          redirectUrl: editType === 'redirect' ? redirectUrl : null
        })
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Produkt opdateret',
          severity: 'success'
        });
        setEditDialog(false);
        fetchStands();
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

  const fetchGoogleReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const response = await fetch(`${API_URL}/api/business/google-reviews`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Kunne ikke hente anmeldelser');
      }
      
      const data = await response.json();
      setBusinessData(data.business);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Fejl ved hentning af Google anmeldelser:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved hentning af anmeldelser',
        severity: 'error'
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  return (
    <Layout title="Dashboard">
      <Grid container spacing={2}>
        {/* Statistik sektion */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 1,
              mb: 2
            }}>
              <Typography variant="h6" color="primary">
                Statistik
              </Typography>
              <Button
                variant="outlined"
                onClick={handleRefreshData}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {isLoading ? 'Opdaterer...' : 'Opdater Data'}
              </Button>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 2
            }}>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Totale klik
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {totalClicks}
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Aktive produkter
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {totalStands}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 300 }}>
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: timeSeriesData.labels,
                    tickLabelStyle: { 
                      fill: mode === 'dark' ? 'white' : 'black',
                      fontSize: { xs: 10, sm: 12 }
                    }
                  }]}
                  series={[{
                    data: timeSeriesData.data,
                    color: mode === 'dark' ? '#4CAF50' : '#2E7D32'
                  }]}
                  height={250}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Google Maps Anmeldelser sektion */}
        <Grid item xs={12}>
          <Paper sx={{ p: 1 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Google Maps Anmeldelser
            </Typography>
            <Grid container spacing={1}>
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
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      gap: 1,
                      mb: 1
                    }}>
                      <Typography variant="h6">
                        Seneste anmeldelser
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1,
                        width: { xs: '100%', sm: 'auto' }
                      }}>
                        <Button
                          variant="outlined"
                          onClick={() => setReviewSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                          startIcon={reviewSortOrder === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                          fullWidth={'xs'}
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
                            return (a.time - b.time) * sortMultiplier;
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
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Typography component="span" variant="subtitle2">
                                        {review.author_name}
                                      </Typography>
                                      <Rating value={review.rating} size="small" readOnly />
                                      <Typography variant="body2" color="textSecondary">
                                        {new Date(review.time * 1000).toLocaleDateString('da-DK')}
                                      </Typography>
                                    </Box>
                                  }
                                  secondary={
                                    <>
                                      <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                      >
                                        {review.text}
                                      </Typography>
                                    </>
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

        {/* Produkter sektion */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 1, sm: 2 } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 1,
              mb: 2
            }}>
              <Typography variant="h6" color="primary">
                Produkter
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Button
                  variant="outlined"
                  onClick={() => setBulkDialog(true)}
                  startIcon={<CloudUploadIcon />}
                  fullWidth={'xs'}
                >
                  Bulk Upload
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpenDialog(true)}
                  startIcon={<AddIcon />}
                  fullWidth={'xs'}
                >
                  Tilføj nyt produkt
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Navn</TableCell>
                      <TableCell>TapFeed URL</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Klik</TableCell>
                      <TableCell>Handlinger</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stands.map((stand) => (
                      <TableRow key={stand._id}>
                        <TableCell>
                          <Tooltip title={stand.standerId} arrow>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {stand.standerId}
                            </Typography>
                          </Tooltip>
                        </TableCell>
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
                              size="small"
                              placeholder="Kaldenavn"
                            />
                          ) : (
                            <Typography variant="body2">
                              {stand.nickname || '-'}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`https://api.tapfeed.dk/${stand.standerId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ textDecoration: 'none' }}
                          >
                            <Typography variant="body2" color="primary">
                              api.tapfeed.dk/{stand.standerId}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {PRODUCT_TYPES[stand.productType.toUpperCase()]?.label || stand.productType}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {stand.clicks || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Rediger" arrow>
                              <IconButton
                                onClick={() => openEditDialog(stand)}
                                size="small"
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="QR kode" arrow>
                              <IconButton
                                onClick={() => handleQrDownload(stand.standerId)}
                                size="small"
                                color="secondary"
                              >
                                <QrCodeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Slet" arrow>
                              <IconButton
                                onClick={() => handleDelete(stand._id)}
                                size="small"
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Guides sektion */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GuideIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Guides & Tips
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {guides.map((guide) => (
                <Grid item xs={12} sm={6} md={4} key={guide.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: (theme) => theme.shadows[4]
                      }
                    }}
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={guide.thumbnail}
                      alt={guide.title}
                      sx={{
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {guide.icon}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {guide.title}
                        </Typography>
                      </Box>
                      <Typography color="text.secondary">
                        {guide.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogs og Snackbar */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Tilføj Nyt Produkt</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Produkt ID"
              value={newStand.standerId}
              onChange={(e) => setNewStand({ ...newStand, standerId: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Kaldenavn"
              value={newStand.nickname}
              onChange={(e) => setNewStand({ ...newStand, nickname: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Produkt Type</InputLabel>
              <Select
                value={newStand.productType}
                onChange={(e) => setNewStand({ ...newStand, productType: e.target.value })}
                label="Produkt Type"
              >
                {Object.values(PRODUCT_TYPES).map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Redirect Type</InputLabel>
              <Select
                value={newStand.redirectType}
                onChange={(e) => setNewStand({ ...newStand, redirectType: e.target.value })}
                label="Redirect Type"
              >
                <MenuItem value="redirect">Almindeligt Redirect URL</MenuItem>
                <MenuItem value="landing">Landing Page</MenuItem>
              </Select>
              <FormHelperText>
                • Almindeligt Redirect URL: Send besøgende direkte til en specifik webadresse (f.eks. dit Google Review Link eller din hjemmeside)<br />
                • Landing Page: Send besøgende til en specialdesignet MyTapFeed landing page med mere information
              </FormHelperText>
            </FormControl>

            {newStand.redirectType === 'redirect' ? (
              <TextField
                fullWidth
                label="Redirect URL"
                value={newStand.redirectUrl}
                onChange={(e) => setNewStand({ ...newStand, redirectUrl: e.target.value })}
                helperText="Indtast den URL som produktet skal linke til (f.eks. din hjemmeside eller sociale medier)"
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Landing Page</InputLabel>
                <Select
                  value={newStand.landingPageId}
                  onChange={(e) => setNewStand({ ...newStand, landingPageId: e.target.value })}
                  label="Landing Page"
                >
                  <MenuItem value="">
                    <em>Ingen landing page</em>
                  </MenuItem>
                  {landingPages.map((page) => (
                    <MenuItem key={page._id} value={page._id}>
                      {page.title}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Vælg en landing page som produktet skal linke til
                </FormHelperText>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuller</Button>
          <Button onClick={handleAddStand} variant="contained" color="primary">
            Tilføj
          </Button>
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

      {/* Guide dialog */}
      <Dialog
        open={!!selectedGuide}
        onClose={() => setSelectedGuide(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {selectedGuide?.icon}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {selectedGuide?.title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedGuide?.content}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedGuide(null)}>
            Luk
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rediger Produkt Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Rediger Produkt</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Kaldenavn"
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Redirect Type</InputLabel>
              <Select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                label="Redirect Type"
              >
                <MenuItem value="redirect">Almindeligt Redirect URL</MenuItem>
                <MenuItem value="landing">Landing Page</MenuItem>
              </Select>
              <FormHelperText>
                • Almindeligt Redirect URL: Send besøgende direkte til en specifik webadresse (f.eks. dit Google Review Link eller din hjemmeside)<br />
                • Landing Page: Send besøgende til en specialdesignet MyTapFeed landing page med mere information
              </FormHelperText>
            </FormControl>

            {editType === 'redirect' ? (
              <TextField
                fullWidth
                label="Redirect URL"
                value={editRedirectUrl}
                onChange={(e) => setEditRedirectUrl(e.target.value)}
                helperText="Indtast den URL som produktet skal linke til (f.eks. din hjemmeside eller sociale medier)"
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Landing Page</InputLabel>
                <Select
                  value={selectedLandingPage}
                  onChange={(e) => setSelectedLandingPage(e.target.value)}
                  label="Landing Page"
                >
                  <MenuItem value="">
                    <em>Ingen landing page</em>
                  </MenuItem>
                  {landingPages.map((page) => (
                    <MenuItem key={page._id} value={page._id}>
                      {page.title}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Vælg en landing page som produktet skal linke til
                </FormHelperText>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>
            Annuller
          </Button>
          <Button onClick={handleEditProduct} variant="contained" color="primary">
            Gem
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Dashboard; 