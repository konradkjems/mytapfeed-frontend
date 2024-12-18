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
  Snackbar
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users', {
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
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}/${isBlocked ? 'unblock' : 'block'}`, {
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
                              onClick={() => navigate(`/admin/users/${user._id}`)}
                              color="primary"
                            >
                              <PersonIcon />
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