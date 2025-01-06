import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  People as PeopleIcon,
  QrCode2 as QrCodeIcon,
  TrendingUp as TrendingUpIcon,
  Web as WebIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL;

const ChartComponent = ({ data, options }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const initChart = async () => {
      if (!data || !data.datasets || !data.labels) return;

      try {
        const { Chart: ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = await import('chart.js');
        const { Line } = await import('react-chartjs-2');

        ChartJS.register(
          CategoryScale,
          LinearScale,
          PointElement,
          LineElement,
          Title,
          Tooltip,
          Legend
        );

        if (chartRef.current) {
          const newChartInstance = new Line(chartRef.current, {
            data,
            options
          });
          setChartInstance(newChartInstance);
        }
      } catch (err) {
        console.error('Fejl ved initialisering af graf:', err);
      }
    };

    initChart();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data, options]);

  if (!data || !data.datasets || !data.labels) {
    return <Typography color="error">Ingen data tilgængelig for graf</Typography>;
  }

  return <canvas ref={chartRef} />;
};

const AdminStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/statistics`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Kunne ikke hente statistik');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Fejl ved hentning af statistik:', error);
      setError('Der opstod en fejl ved hentning af statistik');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
    );
  }

  if (!stats) {
    return null;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // Konfigurer data til bruger-tilmeldingsgraf
  const signupChartData = {
    labels: Object.keys(stats.users.signupsOverTime || {}),
    datasets: [{
      label: 'Nye brugere',
      data: Object.values(stats.users.signupsOverTime || {}),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
    }]
  };

  // Konfigurer data til klik-over-tid graf
  const clicksChartData = {
    labels: Object.keys(stats.engagement.clicksOverTime || {}),
    datasets: [{
      label: 'Klik',
      data: Object.values(stats.engagement.clicksOverTime || {}),
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
      fill: false
    }]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        System Statistik
      </Typography>

      {/* Overordnede tal */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Brugere</Typography>
              </Box>
              <Typography variant="h4">{stats.users.total}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.users.active} aktive i sidste måned
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <QrCodeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Produkter</Typography>
              </Box>
              <Typography variant="h4">{stats.stands.total}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.stands.claimed} aktiverede
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Klik</Typography>
              </Box>
              <Typography variant="h4">{stats.engagement.totalClicks}</Typography>
              <Typography variant="body2" color="text.secondary">
                Gns. {stats.stands.averageClicksPerStand} per produkt
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WebIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Landing Pages</Typography>
              </Box>
              <Typography variant="h4">{stats.content.totalLandingPages}</Typography>
              <Typography variant="body2" color="text.secondary">
                Gns. {stats.content.averageLandingPagesPerUser} per bruger
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grafer */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Nye Brugere Over Tid
            </Typography>
            <Box sx={{ height: 300 }}>
              <ChartComponent data={signupChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Klik Over Tid
            </Typography>
            <Box sx={{ height: 300 }}>
              <ChartComponent data={clicksChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Detaljeret statistik */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Produkt Fordeling
            </Typography>
            <List>
              {Object.entries(stats.stands.productTypeDistribution || {}).map(([type, count]) => (
                <ListItem key={type}>
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={type.charAt(0).toUpperCase() + type.slice(1)} 
                    secondary={`${count} produkter (${((count / stats.stands.total) * 100).toFixed(1)}%)`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStatistics; 