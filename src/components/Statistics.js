import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import Layout from './Layout';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import API_URL from '../config';

const Statistics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/stands`, {
          credentials: 'include'
        });
        if (response.ok) {
          const stands = await response.json();
          setData(stands);
        }
      } catch (error) {
        console.error('Fejl ved hentning af data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const prepareMonthlyData = (stands) => {
    const monthlyClicks = stands.reduce((acc, stand) => {
      const clickHistory = stand.clickHistory || [];
      clickHistory.forEach(click => {
        const date = new Date(click.timestamp);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        acc[monthKey] = (acc[monthKey] || 0) + 1;
      });
      return acc;
    }, {});

    const last12Months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('da-DK', { month: 'short' });
      last12Months.push({
        month: monthName,
        clicks: monthlyClicks[monthKey] || 0
      });
    }

    return last12Months;
  };

  const prepareProductTypeData = (stands) => {
    const productTypes = {};
    stands.forEach(stand => {
      if (!productTypes[stand.productType]) {
        productTypes[stand.productType] = {
          count: 0,
          clicks: 0
        };
      }
      productTypes[stand.productType].count++;
      productTypes[stand.productType].clicks += stand.clicks || 0;
    });

    return Object.entries(productTypes).map(([type, data]) => ({
      type: t(type),
      count: data.count,
      clicks: data.clicks,
      average: data.clicks / data.count
    }));
  };

  if (isLoading) {
    return (
      <Layout title={t('statistics.title')}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const monthlyData = data ? prepareMonthlyData(data) : [];
  const productTypeData = data ? prepareProductTypeData(data) : [];

  return (
    <Layout title={t('statistics.title')}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('statistics.monthlyOverview')}
            </Typography>
            <BarChart
              xAxis={[{
                scaleType: 'band',
                data: monthlyData.map(item => item.month),
                label: t('months'),
                tickLabelStyle: { 
                  fill: mode === 'dark' ? 'white' : 'black'
                }
              }]}
              series={[{
                data: monthlyData.map(item => item.clicks),
                label: t('clicks'),
                color: mode === 'dark' ? '#4CAF50' : '#2E7D32'
              }]}
              height={400}
              sx={{
                '.MuiChartsAxis-label': { 
                  fill: mode === 'dark' ? 'white' : 'black'
                },
                '.MuiChartsAxis-tick': { 
                  fill: mode === 'dark' ? 'white' : 'black'
                }
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('statistics.productTypeAnalysis')}
            </Typography>
            <Grid container spacing={3}>
              {productTypeData.map(type => (
                <Grid item xs={12} sm={6} md={3} key={type.type}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {type.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('statistics.totalProducts')}: {type.count}
                    </Typography>
                    <Typography variant="h4">
                      {type.clicks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('statistics.totalClicks')}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {type.average.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('statistics.averageClicks')}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Statistics; 