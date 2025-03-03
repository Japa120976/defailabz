import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Divider
} from '@mui/material';
import { virtualWalletService } from '../../services/virtualWalletService';

const WalletInfo = ({ onConnect }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('mvp_access_token');
    if (userId) {
      const userWallet = virtualWalletService.getWallet(userId);
      setWallet(userWallet);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Paper sx={{ p: 2, bgcolor: 'rgba(26, 26, 26, 0.9)', textAlign: 'center' }}>
        <CircularProgress size={24} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, bgcolor: 'rgba(26, 26, 26, 0.9)' }}>
      <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
        Carteira Virtual
      </Typography>

      <Grid container spacing={1}>
        {Object.entries(wallet?.balances || {}).map(([asset, balance]) => (
          <Grid item xs={6} key={asset}>
            <Typography color="text.secondary" variant="caption">
              {asset}
            </Typography>
            <Typography variant="body1">
              {balance.toFixed(8)}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Carteira de teste com 1000 USDT
      </Typography>
    </Paper>
  );
};

export default WalletInfo;