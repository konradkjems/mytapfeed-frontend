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
  CircularProgress,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { LineChart } from '@mui/x-charts';
import { useTheme } from '../context/ThemeContext';
import Layout from './Layout';

const PRODUCT_TYPES = {
  STANDER: { value: 'stander', label: 'Stander' },
  STICKER: { value: 'sticker', label: 'Sticker' },
  KORT: { value: 'kort', label: 'Kort' },
  PLATE: { value: 'plate', label: 'Plate' }
};

const Statistics = () => {
  const [stands, setStands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedProductType, setSelectedProductType] = useState('all');
  const { mode } = useTheme();

  useEffect(() => {
    fetchStands();
  }, []);

  const fetchStands = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stands', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStands(data);
      } else {
        throw new Error('Kunne ikke hente produkter');
      }
    } catch (error) {
      console.error('Fejl ved hentning af produkter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const prepareTimeSeriesData = () => {
    const now = new Date();
    const timeRanges = {
      week: 7,
      month: 30,
      year: 365
    };
    const days = timeRanges[selectedTimeRange];
    const filteredStands = selectedProductType === 'all' 
      ? stands 
      : stands.filter(stand => stand.productType === selectedProductType);

    const data = Array(days).fill(0);
    const labels = Array(days).fill('');

    filteredStands.forEach(stand => {
      (stand.clickHistory || []).forEach(click => {
        const clickDate = new Date(click.timestamp);
        const diffDays = Math.floor((now - clickDate) / (1000 * 60 * 60 * 24));
        if (diffDays < days) {
          data[days - diffDays - 1]++;
        }
      });
    });

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - i - 1));
      labels[i] = date.toLocaleDateString('da-DK', { 
        month: 'short', 
        day: 'numeric'
      });
    }

    return { data, labels };
  };

  const calculateStatistics = () => {
    const filteredStands = selectedProductType === 'all' 
      ? stands 
      : stands.filter(stand => stand.productType === selectedProductType);

    const totalClicks = filteredStands.reduce((sum, stand) => sum + (stand.clicks || 0), 0);
    const totalProducts = filteredStands.length;
    const avgClicksPerProduct = totalProducts ? (totalClicks / totalProducts).toFixed(1) : 0;

    // Beregn klik per dag
    const clicksPerDay = {};
    filteredStands.forEach(stand => {
      (stand.clickHistory || []).forEach(click => {
        const date = new Date(click.timestamp).toLocaleDateString('da-DK');
        clicksPerDay[date] = (clicksPerDay[date] || 0) + 1;
      });
    });
    const avgClicksPerDay = Object.values(clicksPerDay).length 
      ? (Object.values(clicksPerDay).reduce((a, b) => a + b, 0) / Object.values(clicksPerDay).length).toFixed(1)
      : 0;

    return {
      totalClicks,
      totalProducts,
      avgClicksPerProduct,
      avgClicksPerDay
    };
  };

  const stats = calculateStatistics();
  const timeSeriesData = prepareTimeSeriesData();

  if (isLoading) {
    return (
      <Layout title="Statistik">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Statistik">
      <Grid container spacing={3}>
        {/* Filtre */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tidsperiode</InputLabel>
              <Select
                value={selectedTimeRange}
                label="Tidsperiode"
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <MenuItem value="week">Sidste 7 dage</MenuItem>
                <MenuItem value="month">Sidste 30 dage</MenuItem>
                <MenuItem value="year">Sidste år</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Produkttype</InputLabel>
              <Select
                value={selectedProductType}
                label="Produkttype"
                onChange={(e) => setSelectedProductType(e.target.value)}
              >
                <MenuItem value="all">Alle produkter</MenuItem>
                {Object.values(PRODUCT_TYPES).map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Statistik kort */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Totale klik
              </Typography>
              <Typography variant="h4">
                {stats.totalClicks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Antal produkter
              </Typography>
              <Typography variant="h4">
                {stats.totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Gennemsnit klik per produkt
              </Typography>
              <Typography variant="h4">
                {stats.avgClicksPerProduct}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Gennemsnit klik per dag
              </Typography>
              <Typography variant="h4">
                {stats.avgClicksPerDay}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Grafer */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Klik over tid
            </Typography>
            <BarChart
              xAxis={[{
                scaleType: 'band',
                data: timeSeriesData.labels,
                tickLabelStyle: { 
                  fill: mode === 'dark' ? 'white' : 'black'
                }
              }]}
              series={[{
                data: timeSeriesData.data,
                color: mode === 'dark' ? '#4CAF50' : '#2E7D32'
              }]}
              height={400}
              sx={{
                '.MuiChartsAxis-label': { 
                  fill: mode === 'dark' ? 'white' : 'black'
                },
                '.MuiChartsAxis-tick': { 
                  fill: mode === 'dark' ? 'white' : 'black'
                },
                '.MuiChartsAxis-line': { 
                  stroke: mode === 'dark' ? 'white' : 'black'
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Detaljeret tabel */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Detaljeret produktoversigt
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produkt ID</TableCell>
                    <TableCell>Produkttype</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell align="right">Totale klik</TableCell>
                    <TableCell align="right">Klik i perioden</TableCell>
                    <TableCell>Seneste klik</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stands
                    .filter(stand => selectedProductType === 'all' || stand.productType === selectedProductType)
                    .map((stand) => {
                      const clicksInPeriod = (stand.clickHistory || []).filter(click => {
                        const clickDate = new Date(click.timestamp);
                        const diffDays = Math.floor((new Date() - clickDate) / (1000 * 60 * 60 * 24));
                        return diffDays < (selectedTimeRange === 'week' ? 7 : selectedTimeRange === 'month' ? 30 : 365);
                      }).length;

                      const latestClick = stand.clickHistory && stand.clickHistory.length > 0
                        ? new Date(stand.clickHistory[stand.clickHistory.length - 1].timestamp).toLocaleString('da-DK')
                        : 'Ingen klik';

                      return (
                        <TableRow key={stand._id}>
                          <TableCell>{stand.standerId}</TableCell>
                          <TableCell>{PRODUCT_TYPES[stand.productType.toUpperCase()]?.label || stand.productType}</TableCell>
                          <TableCell>{stand.redirectUrl}</TableCell>
                          <TableCell align="right">{stand.clicks || 0}</TableCell>
                          <TableCell align="right">{clicksInPeriod}</TableCell>
                          <TableCell>{latestClick}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Statistics; 