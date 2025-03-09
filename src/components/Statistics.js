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
  InputLabel,
  Button,
  Snackbar,
  Alert,
  TextField,
  Tooltip
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { LineChart } from '@mui/x-charts';
import { useTheme } from '../context/ThemeContext';
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [useCustomDateRange, setUseCustomDateRange] = useState(false);
  const { mode } = useTheme();
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchStands();
  }, []);

  useEffect(() => {
    // Når timeRange ændres, nulstil custom dato range
    if (selectedTimeRange !== 'custom') {
      setUseCustomDateRange(false);
    }
  }, [selectedTimeRange]);

  // Sæt standard datoer når komponenten indlæses
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(lastMonth.toISOString().split('T')[0]);
  }, []);

  const fetchStands = async () => {
    try {
      const cachedData = sessionStorage.getItem('statisticsData');
      const cacheTimestamp = sessionStorage.getItem('statisticsCacheTimestamp');
      const isCacheValid = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 60 * 1000;

      if (isCacheValid && cachedData) {
        console.log('Bruger cached statistik data');
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
        sessionStorage.setItem('statisticsData', JSON.stringify(data));
        sessionStorage.setItem('statisticsCacheTimestamp', Date.now().toString());
      } else {
        throw new Error('Kunne ikke hente produkter');
      }
    } catch (error) {
      console.error('Fejl ved hentning af produkter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStands();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getDateRange = () => {
    // Opret datoer i lokal tid
    const now = new Date();
    const localNow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    if (useCustomDateRange && startDate && endDate) {
      const start = new Date(startDate);
      const localStart = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
      
      const end = new Date(endDate);
      const localEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
      
      // Beregn antal dage mellem datoerne
      const diffTime = Math.abs(localEnd - localStart);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Generer array af datoer i lokal tid
      const dateArray = Array.from({ length: diffDays }, (_, i) => {
        const date = new Date(localStart);
        date.setDate(date.getDate() + i);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      });

      console.log('Custom date range:', {
        start: localStart.toISOString(),
        end: localEnd.toISOString(),
        numberOfDays: diffDays,
        dates: dateArray.map(d => d.toISOString())
      });
      
      return { dateArray, start: localStart, end: localEnd };
    } else {
      // Standard tidsperioder
      const timeRanges = {
        week: 7,
        month: 30,
        year: 365
      };
      const days = timeRanges[selectedTimeRange];
      
      // Find den seneste dato blandt alle klik
      let latestClickDate = new Date(0); // Start med en meget gammel dato
      stands.forEach(stand => {
        (stand.clickHistory || []).forEach(click => {
          const clickDate = new Date(click.timestamp);
          if (clickDate > latestClickDate) {
            latestClickDate = clickDate;
          }
        });
      });

      // Hvis der ikke er nogen klik, brug nuværende dato
      if (latestClickDate.getTime() === 0) {
        latestClickDate = now;
      }

      // Opret start og slut datoer baseret på den seneste klik-dato
      const localEnd = new Date(
        latestClickDate.getFullYear(),
        latestClickDate.getMonth(),
        latestClickDate.getDate(),
        23, 59, 59, 999
      );
      
      const localStart = new Date(localEnd);
      localStart.setDate(localStart.getDate() - days + 1);
      localStart.setHours(0, 0, 0, 0);
      
      // Generer array af datoer i lokal tid
      const dateArray = Array.from({ length: days }, (_, i) => {
        const date = new Date(localStart);
        date.setDate(date.getDate() + i);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      });

      console.log('Standard date range:', {
        timeRange: selectedTimeRange,
        latestClick: latestClickDate.toISOString(),
        start: localStart.toISOString(),
        end: localEnd.toISOString(),
        numberOfDays: days,
        dates: dateArray.map(d => ({
          date: d.toISOString(),
          year: d.getFullYear(),
          month: d.getMonth(),
          day: d.getDate()
        }))
      });
      
      return { dateArray, start: localStart, end: localEnd };
    }
  };

  const prepareTimeSeriesData = () => {
    const { dateArray, start, end } = getDateRange();
    
    const filteredStands = selectedProductType === 'all' 
      ? stands 
      : stands.filter(stand => stand.productType === selectedProductType);

    console.log('Behandler data for stands:', filteredStands.map(stand => ({
      standerId: stand.standerId,
      clicks: stand.clicks,
      clickHistoryLength: stand.clickHistory?.length || 0,
      firstClick: stand.clickHistory?.[0]?.timestamp,
      lastClick: stand.clickHistory?.[stand.clickHistory?.length - 1]?.timestamp
    })));

    const data = Array(dateArray.length).fill(0);
    const labels = dateArray.map(date => 
      date.toLocaleDateString('da-DK', { 
        day: 'numeric',
        month: 'short'
      })
    );

    filteredStands.forEach(stand => {
      (stand.clickHistory || []).forEach(click => {
        // Konverter timestamp til lokal tid uden tidszone offset
        const clickDate = new Date(click.timestamp);
        // Bemærk: JavaScript måneder er 0-baseret (0-11)
        const localClickDate = new Date(
          clickDate.getFullYear(),
          clickDate.getMonth(),
          clickDate.getDate(),
          0, 0, 0, 0
        );

        const dateIndex = dateArray.findIndex(date => {
          // Sammenlign datoer uden tidszone offset
          return date.getFullYear() === localClickDate.getFullYear() &&
                 date.getMonth() === localClickDate.getMonth() &&
                 date.getDate() === localClickDate.getDate();
        });

        if (dateIndex !== -1) {
          data[dateIndex]++;
        } else {
          console.log('Kunne ikke finde matching dato for klik:', {
            clickTimestamp: click.timestamp,
            localClickDate: localClickDate.toISOString(),
            clickYear: localClickDate.getFullYear(),
            // +1 for at vise menneske-læsbar måned (1-12)
            clickMonth: localClickDate.getMonth() + 1,
            clickDay: localClickDate.getDate(),
            availableDates: dateArray.map(d => ({
              date: d.toISOString(),
              year: d.getFullYear(),
              // +1 for at vise menneske-læsbar måned (1-12)
              month: d.getMonth() + 1,
              day: d.getDate()
            }))
          });
        }
      });
    });

    console.log('Statistik beregnet:', {
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      dates: dateArray.map(d => ({
        date: d.toISOString(),
        year: d.getFullYear(),
        // +1 for at vise menneske-læsbar måned (1-12)
        month: d.getMonth() + 1,
        day: d.getDate()
      })),
      data,
      labels
    });

    return { data, labels };
  };

  const calculateStatistics = () => {
    const { start, end } = getDateRange();
    
    console.log('Beregner statistik for periode:', {
      start: start.toISOString(),
      end: end.toISOString()
    });

    const filteredStands = selectedProductType === 'all' 
      ? stands 
      : stands.filter(stand => stand.productType === selectedProductType);

    // Filtrer klik baseret på valgt tidsperiode
    const filteredClicks = filteredStands.flatMap(stand => 
      (stand.clickHistory || []).filter(click => {
        const clickDate = new Date(click.timestamp);
        const localClickDate = new Date(
          clickDate.getFullYear(),
          clickDate.getMonth(),
          clickDate.getDate(),
          0, 0, 0, 0
        );
        return localClickDate >= start && localClickDate <= end;
      })
    );

    console.log('Filtrerede klik:', {
      total: filteredClicks.length,
      clicks: filteredClicks.map(click => {
        const clickDate = new Date(click.timestamp);
        const localClickDate = new Date(
          clickDate.getFullYear(),
          clickDate.getMonth(),
          clickDate.getDate(),
          0, 0, 0, 0
        );
        return {
          timestamp: click.timestamp,
          localTime: localClickDate.toISOString(),
          // +1 for at vise menneske-læsbar måned (1-12)
          month: localClickDate.getMonth() + 1,
          day: localClickDate.getDate(),
          year: localClickDate.getFullYear()
        };
      })
    });

    const totalClicks = filteredClicks.length;
    const totalProducts = filteredStands.length;
    const avgClicksPerProduct = totalProducts ? (totalClicks / totalProducts).toFixed(1) : 0;

    // Beregn klik per dag
    const clicksPerDay = {};
    filteredClicks.forEach(click => {
      const clickDate = new Date(click.timestamp);
      const localClickDate = new Date(
        clickDate.getFullYear(),
        clickDate.getMonth(),
        clickDate.getDate(),
        0, 0, 0, 0
      );
      const date = localClickDate.toLocaleDateString('da-DK');
      clicksPerDay[date] = (clicksPerDay[date] || 0) + 1;
    });
    
    const avgClicksPerDay = Object.values(clicksPerDay).length 
      ? (Object.values(clicksPerDay).reduce((a, b) => a + b, 0) / Object.values(clicksPerDay).length).toFixed(1)
      : 0;

    console.log('Beregnede statistikker:', {
      totalClicks,
      totalProducts,
      avgClicksPerProduct,
      avgClicksPerDay,
      clicksPerDay
    });

    return {
      totalClicks,
      totalProducts,
      avgClicksPerProduct,
      avgClicksPerDay
    };
  };

  const handleRefreshData = async () => {
    try {
      setIsLoading(true);
      // Ryd cache
      sessionStorage.removeItem('statisticsData');
      sessionStorage.removeItem('statisticsCacheTimestamp');
      
      // Hent ny data
      await fetchStands();
      
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
    }
  };

  const handleTimeRangeChange = (e) => {
    const value = e.target.value;
    setSelectedTimeRange(value);
    if (value === 'custom') {
      setUseCustomDateRange(true);
    }
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
      <Grid container spacing={2}>
        {/* Filtre og Opdater Data knap */}
        <Grid item xs={12}>
          <Paper sx={{ p: 1, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, flex: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tidsperiode</InputLabel>
                <Select
                  value={selectedTimeRange}
                  label="Tidsperiode"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="week">Sidste 7 dage</MenuItem>
                  <MenuItem value="month">Sidste 30 dage</MenuItem>
                  <MenuItem value="year">Sidste år</MenuItem>
                  <MenuItem value="custom">Brugerdefineret</MenuItem>
                </Select>
              </FormControl>
              
              {selectedTimeRange === 'custom' && (
                <>
                  <TextField
                    label="Fra dato"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Til dato"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                  />
                </>
              )}
              
              <FormControl fullWidth size="small">
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
            </Box>
            <Button
              variant="outlined"
              onClick={handleRefreshData}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              fullWidth
              size="small"
            >
              {isLoading ? 'Opdaterer...' : 'Opdater Data'}
            </Button>
          </Paper>
        </Grid>

        {/* Statistik kort */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Totale visninger
              </Typography>
              <Typography variant="h5">
                {stats.totalClicks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Antal produkter
              </Typography>
              <Typography variant="h5">
                {stats.totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Visninger/produkt
              </Typography>
              <Typography variant="h5">
                {stats.avgClicksPerProduct}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Visninger/dag
              </Typography>
              <Typography variant="h5">
                {stats.avgClicksPerDay}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Grafer */}
        <Grid item xs={12}>
          <Paper sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom>
              Visninger over tid
            </Typography>
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
                  height={300}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Detaljeret tabel */}
        <Grid item xs={12}>
          <Paper sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom>
              Produktoversigt
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Visninger</TableCell>
                      <TableCell>Seneste</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stands
                      .filter(stand => selectedProductType === 'all' || stand.productType === selectedProductType)
                      .map((stand) => {
                        const { start, end } = getDateRange();
                        
                        const clicksInPeriod = (stand.clickHistory || []).filter(click => {
                          const clickDate = new Date(click.timestamp);
                          return clickDate >= start && clickDate <= end;
                        }).length;

                        const latestClick = stand.clickHistory && stand.clickHistory.length > 0
                          ? new Date(stand.clickHistory[stand.clickHistory.length - 1].timestamp).toLocaleString('da-DK')
                          : 'Ingen';

                        return (
                          <TableRow key={stand._id}>
                            <TableCell>
                              <Tooltip title={stand.standerId} arrow>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {stand.standerId}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {PRODUCT_TYPES[stand.productType.toUpperCase()]?.label || stand.productType}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography variant="body2">
                                  {clicksInPeriod}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  ({stand.clicks || 0})
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {latestClick}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
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

export default Statistics; 