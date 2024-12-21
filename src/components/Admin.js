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
  Switch
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Key as KeyIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import API_URL from '../config';

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
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