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
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Layout from './Layout';
import API_URL from '../config';

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
  const { t } = useLanguage();

  useEffect(() => {
    fetchStands();
  }, []);

  const fetchStands = async () => {
    try {
      const response = await fetch(`${API_URL}/stands`, {
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
      <Layout title={t('menu.statistics')}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title={t('menu.statistics')}>
      <Grid container spacing={3}>
        {/* Filtre */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t('statistics.timeRange')}</InputLabel>
              <Select
                value={selectedTimeRange}
                label={t('statistics.timeRange')}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <MenuItem value="week">{t('statistics.lastWeek')}</MenuItem>
                <MenuItem value="month">{t('statistics.lastMonth')}</MenuItem>
                <MenuItem value="year">{t('statistics.lastYear')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t('statistics.productType')}</InputLabel>
              <Select
                value={selectedProductType}
                label={t('statistics.productType')}
                onChange={(e) => setSelectedProductType(e.target.value)}
              >
                <MenuItem value="all">{t('statistics.allProducts')}</MenuItem>
                {Object.values(PRODUCT_TYPES).map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {t(type.value)}
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
                {t('statistics.totalClicks')}
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
                {t('statistics.productCount')}
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
                {t('statistics.avgClicksPerProduct')}
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
                {t('statistics.avgClicksPerDay')}
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
              {t('statistics.clicksOverTime')}
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
              {t('statistics.detailedOverview')}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('productId')}</TableCell>
                    <TableCell>{t('productType')}</TableCell>
                    <TableCell>{t('redirectUrl')}</TableCell>
                    <TableCell align="right">{t('statistics.totalClicks')}</TableCell>
                    <TableCell align="right">{t('clicks')}</TableCell>
                    <TableCell>{t('statistics.latestClick')}</TableCell>
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
                        ? new Date(stand.clickHistory[stand.clickHistory.length - 1].timestamp).toLocaleString()
                        : t('statistics.noClicks');

                      return (
                        <TableRow key={stand._id}>
                          <TableCell>{stand.standerId}</TableCell>
                          <TableCell>{t(stand.productType)}</TableCell>
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