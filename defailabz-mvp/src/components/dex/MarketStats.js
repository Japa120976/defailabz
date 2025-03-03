import React from 'react';
import { Paper, Grid, Typography } from '@mui/material';

const StatItem = ({ label, value }) => (
  <Grid item xs={12} md={3}>
    <Typography color="text.secondary">{label}</Typography>
    <Typography variant="h5" sx={{ color: '#00F5FF' }}>
      {value?.toLocaleString() || '0'}
    </Typography>
  </Grid>
);

const MarketStats = ({ stats = {} }) => {
  const defaultStats = {
    volume24h: '0',
    trades24h: '0',
    openInterest: '0',
    totalMarkets: '0',
    ...stats
  };

  return (
    <Paper sx={{ 
      p: 3, 
      bgcolor: 'rgba(26, 26, 26, 0.9)',
      borderRadius: 2,
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Grid container spacing={3}>
        <StatItem label="Volume 24h" value={defaultStats.volume24h} />
        <StatItem label="Trades 24h" value={defaultStats.trades24h} />
        <StatItem label="Open Interest" value={defaultStats.openInterest} />
        <StatItem label="Total Markets" value={defaultStats.totalMarkets} />
      </Grid>
    </Paper>
  );
};

export default MarketStats;