import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  ButtonGroup,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControlLabel,
  Switch,
  Tooltip,
  FormHelperText,
  Link,
  Checkbox,
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Key as KeyIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import API_URL from '../config';

const PRODUCT_TYPES = {
  STANDER: { value: 'stander', label: 'Stander' },
  STICKER: { value: 'sticker', label: 'Sticker' },
  KORT: { value: 'kort', label: 'Kort' },
  PLATE: { value: 'plate', label: 'Plate' }
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsDialog, setUserDetailsDialog] = useState(false);
  const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [userLandingPages, setUserLandingPages] = useState([]);
  const [editUserData, setEditUserData] = useState({
    username: '',
    email: '',
    isAdmin: false
  });
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    standerId: '',
    productType: 'stander'
  });
  const [bulkCreate, setBulkCreate] = useState({
    startId: '',
    count: 1,
    productType: 'stander'
  });
  const [bulkDialog, setBulkDialog] = useState(false);
  const [unclaimedProducts, setUnclaimedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteUnclaimedDialog, setDeleteUnclaimedDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchUnclaimedProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error('Kunne ikke hente brugere');
      }
    } catch (error) {
      console.error('Fejl ved hentning af brugere:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved hentning af brugere',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnclaimedProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stands/unclaimed`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Kunne ikke hente unclaimed produkter');
      const data = await response.json();
      setUnclaimedProducts(data);
    } catch (error) {
      console.error('Fejl ved hentning af unclaimed produkter:', error);
      setError('Kunne ikke hente unclaimed produkter');
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/${isBlocked ? 'unblock' : 'block'}`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (response.ok) {
        setUsers(users.map(user =>
          user._id === userId
            ? { ...user, isBlocked: !isBlocked }
            : user
        ));
        setAlert({
          open: true,
          message: `Bruger ${isBlocked ? 'genaktiveret' : 'deaktiveret'} succesfuldt`,
          severity: 'success'
        });
      } else {
        throw new Error('Kunne ikke opdatere bruger status');
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved opdatering af bruger status',
        severity: 'error'
      });
    }
  };

  const handleViewUserDetails = async (user) => {
    setSelectedUser(user);
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${user._id}/landing-pages`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserLandingPages(data);
      }
    } catch (error) {
      console.error('Fejl ved hentning af brugerens landing pages:', error);
    }
    setUserDetailsDialog(true);
  };

  const handleEditUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(editUserData)
      });

      if (response.ok) {
        setUsers(users.map(user =>
          user._id === selectedUser._id
            ? { ...user, ...editUserData }
            : user
        ));
        setAlert({
          open: true,
          message: 'Bruger opdateret succesfuldt',
          severity: 'success'
        });
        setEditUserDialog(false);
      } else {
        throw new Error('Kunne ikke opdatere bruger');
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved opdatering af bruger',
        severity: 'error'
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${selectedUser._id}/reset-password`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Adgangskode nulstillet og sendt til brugerens email',
          severity: 'success'
        });
        setResetPasswordDialog(false);
      } else {
        throw new Error('Kunne ikke nulstille adgangskode');
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved nulstilling af adgangskode',
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${selectedUser._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== selectedUser._id));
        setAlert({
          open: true,
          message: 'Bruger slettet succesfuldt',
          severity: 'success'
        });
        setDeleteUserDialog(false);
      } else {
        throw new Error('Kunne ikke slette bruger');
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved sletning af bruger',
        severity: 'error'
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newProduct,
          status: 'unclaimed'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Kunne ikke oprette produkt');
      }

      setAlert({
        open: true,
        message: 'Produkt oprettet succesfuldt',
        severity: 'success'
      });
      setOpenProductDialog(false);
      setNewProduct({
        standerId: '',
        productType: 'stander'
      });
    } catch (error) {
      console.error('Fejl ved oprettelse af produkt:', error);
      setAlert({
        open: true,
        message: error.message || 'Der opstod en fejl ved oprettelse af produkt',
        severity: 'error'
      });
    }
  };

  const handleBulkCreate = async () => {
    try {
      const { startId, count, productType } = bulkCreate;
      const baseId = startId.replace(/\d+$/, ''); // Fjern eventuelle tal fra slutningen
      const startNumber = parseInt(startId.match(/\d+$/)?.[0] || '1'); // Find startnummer eller brug 1

      const products = Array.from({ length: count }, (_, index) => ({
        standerId: `${baseId}${(startNumber + index).toString().padStart(3, '0')}`,
        productType,
        status: 'unclaimed'
      }));

      const response = await fetch(`${API_URL}/api/stands/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ products })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Kunne ikke oprette produkter');
      }

      setAlert({
        open: true,
        message: `${count} produkter oprettet succesfuldt`,
        severity: 'success'
      });
      setBulkDialog(false);
      setBulkCreate({
        startId: '',
        count: 1,
        productType: 'stander'
      });
    } catch (error) {
      console.error('Fejl ved oprettelse af produkter:', error);
      setAlert({
        open: true,
        message: error.message || 'Der opstod en fejl ved oprettelse af produkter',
        severity: 'error'
      });
    }
  };

  const handleDownloadCSV = () => {
    if (selectedProducts.length === 0) {
        setAlert({
            open: true,
            message: 'Vælg mindst ét produkt at downloade',
            severity: 'warning'
        });
        return;
    }
    const ids = selectedProducts.join(',');
    window.location.href = `${API_URL}/api/stands/unclaimed/csv?ids=${ids}`;
  };

  const handleDownloadQR = () => {
    if (selectedProducts.length === 0) {
        setAlert({
            open: true,
            message: 'Vælg mindst ét produkt at downloade',
            severity: 'warning'
        });
        return;
    }
    const ids = selectedProducts.join(',');
    window.location.href = `${API_URL}/api/stands/unclaimed/qr-codes?ids=${ids}`;
  };

  const confirmDeleteUnclaimed = () => {
    setDeleteUnclaimedDialog(true);
  };

  const handleDeleteUnclaimed = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/stands/unclaimed`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          ids: selectedProducts.length > 0 ? selectedProducts : undefined 
        })
      });

      if (!response.ok) throw new Error('Kunne ikke slette produkter');
      
      const data = await response.json();
      setAlert({
        open: true,
        message: data.message,
        severity: 'success'
      });
      
      // Opdater listen af unclaimed produkter
      await fetchUnclaimedProducts();
      // Nulstil valgte produkter
      setSelectedProducts([]);
      // Luk dialogen
      setDeleteUnclaimedDialog(false);
    } catch (error) {
      console.error('Fejl ved sletning af produkter:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved sletning af produkter',
        severity: 'error'
      });
    }
  };

  return (
    <Layout title="Admin Panel">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Brugeradministration
            </Typography>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Brugernavn</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell>Oprettet</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Handlinger</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.isAdmin ? 'Admin' : 'Bruger'}
                            color={user.isAdmin ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('da-DK')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isBlocked ? 'Deaktiveret' : 'Aktiv'}
                            color={user.isBlocked ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <ButtonGroup>
                            <IconButton
                              onClick={() => handleBlockUser(user._id, user.isBlocked)}
                              color={user.isBlocked ? 'success' : 'error'}
                              disabled={user.isAdmin}
                              title={user.isAdmin ? 'Kan ikke deaktivere admin' : ''}
                            >
                              {user.isBlocked ? <UnblockIcon /> : <BlockIcon />}
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setSelectedUser(user);
                                setEditUserData({
                                  username: user.username,
                                  email: user.email,
                                  isAdmin: user.isAdmin
                                });
                                setEditUserDialog(true);
                              }}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleViewUserDetails(user)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setSelectedUser(user);
                                setResetPasswordDialog(true);
                              }}
                              color="warning"
                            >
                              <KeyIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setSelectedUser(user);
                                setDeleteUserDialog(true);
                              }}
                              color="error"
                              disabled={user.isAdmin}
                            >
                              <DeleteIcon />
                            </IconButton>
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

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Unclaimed Produkter
              </Typography>
              <Box>
                <ButtonGroup variant="contained" sx={{ mr: 1 }}>
                  <Button
                    onClick={handleDownloadCSV}
                    startIcon={<DownloadIcon />}
                    disabled={unclaimedProducts.length === 0}
                  >
                    Download CSV
                  </Button>
                  <Button
                    onClick={handleDownloadQR}
                    startIcon={<DownloadIcon />}
                    disabled={unclaimedProducts.length === 0}
                  >
                    Download QR
                  </Button>
                  <Button
                    onClick={confirmDeleteUnclaimed}
                    startIcon={<DeleteIcon />}
                    disabled={unclaimedProducts.length === 0}
                    color="error"
                  >
                    {selectedProducts.length > 0 
                      ? `Slet ${selectedProducts.length} valgte` 
                      : 'Slet alle'}
                  </Button>
                </ButtonGroup>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenProductDialog(true)}
                  sx={{ mr: 1 }}
                >
                  Tilføj Produkt
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setBulkDialog(true)}
                >
                  Opret Flere Produkter
                </Button>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Her kan du oprette nye produkter som endnu ikke er tilknyttet en bruger. 
              Når en bruger scanner produktet første gang, vil de få mulighed for at aktivere det.
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedProducts.length === unclaimedProducts.length}
                        indeterminate={selectedProducts.length > 0 && selectedProducts.length < unclaimedProducts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(unclaimedProducts.map(p => p._id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Produkt ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Oprettet</TableCell>
                    <TableCell>TapFeed URL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unclaimedProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProducts.includes(product._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product._id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{product.standerId}</TableCell>
                      <TableCell>{PRODUCT_TYPES[product.productType.toUpperCase()]?.label || product.productType}</TableCell>
                      <TableCell>{new Date(product.createdAt).toLocaleString('da-DK')}</TableCell>
                      <TableCell>
                        <Link href={`${API_URL}/${product.standerId}`} target="_blank">
                          {`${API_URL}/${product.standerId}`}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Brugerdetaljer Dialog */}
      <Dialog
        open={userDetailsDialog}
        onClose={() => setUserDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Brugerdetaljer - {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Email: {selectedUser?.email}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Admin: {selectedUser?.isAdmin ? 'Admin' : 'Bruger'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Status: {selectedUser?.isBlocked ? 'Deaktiveret' : 'Aktiv'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Oprettet: {selectedUser && new Date(selectedUser.createdAt).toLocaleDateString('da-DK')}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Landing Pages ({userLandingPages.length})
          </Typography>
          <List>
            {userLandingPages.map((page) => (
              <ListItem key={page._id}>
                <ListItemText
                  primary={page.title}
                  secondary={`Oprettet: ${new Date(page.createdAt).toLocaleDateString('da-DK')}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => navigate(`/landing/${page._id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDetailsDialog(false)}>
            Luk
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rediger Bruger Dialog */}
      <Dialog
        open={editUserDialog}
        onClose={() => setEditUserDialog(false)}
      >
        <DialogTitle>Rediger Bruger</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Brugernavn"
              value={editUserData.username}
              onChange={(e) => setEditUserData({ ...editUserData, username: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={editUserData.email}
              onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editUserData.isAdmin}
                  onChange={(e) => setEditUserData({ ...editUserData, isAdmin: e.target.checked })}
                />
              }
              label="Admin rettigheder"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialog(false)}>
            Annuller
          </Button>
          <Button onClick={handleEditUser} variant="contained" color="primary">
            Gem
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nulstil Adgangskode Dialog */}
      <Dialog
        open={resetPasswordDialog}
        onClose={() => setResetPasswordDialog(false)}
      >
        <DialogTitle>Nulstil Adgangskode</DialogTitle>
        <DialogContent>
          <Typography>
            Er du sikker på, at du vil nulstille adgangskoden for {selectedUser?.username}?
            En ny midlertidig adgangskode vil blive sendt til brugerens email.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordDialog(false)}>
            Annuller
          </Button>
          <Button onClick={handleResetPassword} variant="contained" color="warning">
            Nulstil Adgangskode
          </Button>
        </DialogActions>
      </Dialog>

      {/* Slet Bruger Dialog */}
      <Dialog
        open={deleteUserDialog}
        onClose={() => setDeleteUserDialog(false)}
      >
        <DialogTitle>Slet Bruger</DialogTitle>
        <DialogContent>
          <Typography>
            Er du sikker på, at du vil slette brugeren {selectedUser?.username}?
            Denne handling kan ikke fortrydes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserDialog(false)}>
            Annuller
          </Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Slet Bruger
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog til oprettelse af unclaimed produkter */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
        <DialogTitle>Opret Nyt Unclaimed Produkt</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Tooltip title="Indtast det unikke ID som er trykt på TapFeed produktet" arrow placement="top-start">
                <TextField
                  fullWidth
                  label="Produkt ID"
                  value={newProduct.standerId}
                  onChange={(e) => setNewProduct({ ...newProduct, standerId: e.target.value })}
                  required
                  helperText="Det unikke ID der er trykt på produktet"
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Vælg hvilken type TapFeed produkt det er" arrow placement="top-start">
                <FormControl fullWidth>
                  <InputLabel>Produkttype</InputLabel>
                  <Select
                    value={newProduct.productType}
                    onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value })}
                  >
                    {Object.values(PRODUCT_TYPES).map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Vælg den type fysisk produkt</FormHelperText>
                </FormControl>
              </Tooltip>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Annuller</Button>
          <Button onClick={handleAddProduct} variant="contained">Opret</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog til bulk oprettelse af produkter */}
      <Dialog open={bulkDialog} onClose={() => setBulkDialog(false)}>
        <DialogTitle>Opret Flere Unclaimed Produkter</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Tooltip title="Indtast start ID'et for produkterne (f.eks. 'TF001')" arrow placement="top-start">
                <TextField
                  fullWidth
                  label="Start ID"
                  value={bulkCreate.startId}
                  onChange={(e) => setBulkCreate({ ...bulkCreate, startId: e.target.value })}
                  required
                  helperText="De efterfølgende produkter vil få fortløbende numre"
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Antal produkter der skal oprettes" arrow placement="top-start">
                <TextField
                  fullWidth
                  label="Antal produkter"
                  type="number"
                  value={bulkCreate.count}
                  onChange={(e) => setBulkCreate({ ...bulkCreate, count: parseInt(e.target.value) || 1 })}
                  required
                  inputProps={{ min: 1, max: 1000 }}
                  helperText="Vælg hvor mange produkter der skal oprettes (max 1000)"
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Vælg hvilken type TapFeed produkt det er" arrow placement="top-start">
                <FormControl fullWidth>
                  <InputLabel sx={{ mt: -1 }}>Produkttype</InputLabel>
                  <Select
                    value={bulkCreate.productType}
                    onChange={(e) => setBulkCreate({ ...bulkCreate, productType: e.target.value })}
                  >
                    {Object.values(PRODUCT_TYPES).map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Vælg den type fysisk produkt</FormHelperText>
                </FormControl>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Dette vil oprette {bulkCreate.count} produkter med ID'er fra {bulkCreate.startId} til {
                  (() => {
                    const baseId = bulkCreate.startId.replace(/\d+$/, '');
                    const startNumber = parseInt(bulkCreate.startId.match(/\d+$/)?.[0] || '1');
                    const endNumber = startNumber + bulkCreate.count - 1;
                    return `${baseId}${endNumber.toString().padStart(3, '0')}`;
                  })()
                }
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialog(false)}>Annuller</Button>
          <Button 
            onClick={handleBulkCreate} 
            variant="contained"
            disabled={!bulkCreate.startId || bulkCreate.count < 1}
          >
            Opret Produkter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bekræft sletning af unclaimed produkter */}
      <Dialog
        open={deleteUnclaimedDialog}
        onClose={() => setDeleteUnclaimedDialog(false)}
      >
        <DialogTitle>Bekræft Sletning</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedProducts.length > 0 
              ? `Er du sikker på at du vil slette ${selectedProducts.length} valgte produkter?`
              : 'Er du sikker på at du vil slette alle unclaimed produkter?'}
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            Denne handling kan ikke fortrydes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUnclaimedDialog(false)}>
            Annuller
          </Button>
          <Button onClick={handleDeleteUnclaimed} variant="contained" color="error">
            Slet
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

export default Admin; 