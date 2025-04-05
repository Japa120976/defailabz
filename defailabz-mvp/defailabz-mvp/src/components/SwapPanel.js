import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useAccount } from 'wagmi';

const SwapPanel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fromToken, setFromToken] = useState({
    symbol: 'ETH',
    amount: '',
    balance: '0',
    price: 0
  });
  const [toToken, setToToken] = useState({
    symbol: 'DFL',
    amount: '',
    balance: '0',
    price: 0
  });
  const [priceImpact, setPriceImpact] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  const { address } = useAccount();

  useEffect(() => {
    fetchTokenPrices();
  }, []);

  const fetchTokenPrices = async () => {
    try {
      // Simulação de preços - substituir por integração real
      setFromToken(prev => ({
        ...prev,
        price: 1800 // Preço simulado do ETH
      }));
      setToToken(prev => ({
        ...prev,
        price: 0.01 // Preço simulado do DFL
      }));
    } catch (error) {
      setError('Erro ao buscar preços dos tokens');
    }
  };

  const handleSwapTokens = () => {
    const temp = {...fromToken};
    setFromToken({...toToken});
    setToToken(temp);
    calculateSwapAmount(toToken.amount, true);
  };

  const calculateSwapAmount = (value, isReverse = false) => {
    try {
      if (!value) {
        return isReverse ? setFromToken({...fromToken, amount: ''}) : setToToken({...toToken, amount: ''});
      }

      const fromPrice = fromToken.price;
      const toPrice = toToken.price;
      
      if (isReverse) {
        const fromAmount = (value * toPrice / fromPrice).toFixed(6);
        setFromToken({...fromToken, amount: fromAmount});
      } else {
        const toAmount = (value * fromPrice / toPrice).toFixed(6);
        setToToken({...toToken, amount: toAmount});
      }

      // Calcular impacto no preço (simulado)
      const impact = (parseFloat(value) / 1000) * 100; // Simulação simples
      setPriceImpact(Math.min(impact, 100).toFixed(2));
    } catch (error) {
      setError('Erro ao calcular valores');
    }
  };

  const handleFromAmountChange = (value) => {
    setFromToken({...fromToken, amount: value});
    calculateSwapAmount(value);
  };

  const handleToAmountChange = (value) => {
    setToToken({...toToken, amount: value});
    calculateSwapAmount(value, true);
  };

  const handleSwap = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulação de swap - substituir por integração real
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Resetar campos após swap
      setFromToken({...fromToken, amount: ''});
      setToToken({...toToken, amount: ''});
      setPriceImpact(0);

    } catch (error) {
      setError('Erro ao executar swap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ 
      p: 3, 
      bgcolor: 'rgba(26, 26, 26, 0.9)',
      borderRadius: 2,
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Typography variant="h6" sx={{ mb: 3, color: '#00F5FF' }}>
        Swap Tokens
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography color="text.secondary" sx={{ mb: 1 }}>De</Typography>
        <TextField
          fullWidth
          type="number"
          value={fromToken.amount}
          onChange={(e) => handleFromAmountChange(e.target.value)}
          placeholder="0.0"
          disabled={loading}
          InputProps={{
            endAdornment: (
              <Typography color="text.secondary">
                {fromToken.symbol}
              </Typography>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
              '&:hover fieldset': { borderColor: '#00F5FF' },
              '&.Mui-focused fieldset': { borderColor: '#00F5FF' }
            }
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Saldo: {fromToken.balance} {fromToken.symbol}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <IconButton 
          onClick={handleSwapTokens} 
          sx={{ color: '#00F5FF' }}
          disabled={loading}
        >
          <SwapVertIcon />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography color="text.secondary" sx={{ mb: 1 }}>Para</Typography>
        <TextField
          fullWidth
          type="number"
          value={toToken.amount}
          onChange={(e) => handleToAmountChange(e.target.value)}
          placeholder="0.0"
          disabled={loading}
          InputProps={{
            endAdornment: (
              <Typography color="text.secondary">
                {toToken.symbol}
              </Typography>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }
            }
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Saldo: {toToken.balance} {toToken.symbol}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Typography color="text.secondary">Taxa</Typography>
          <Typography>0.3%</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color="text.secondary">Slippage</Typography>
          <Typography>{slippage}%</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color="text.secondary">Impacto</Typography>
          <Typography 
            sx={{ 
              color: priceImpact > 5 ? '#FF5252' : 'inherit'
            }}
          >
            {priceImpact}%
          </Typography>
        </Grid>
      </Grid>

      <Button
        fullWidth
        variant="contained"
        onClick={handleSwap}
        disabled={loading || !fromToken.amount || !toToken.amount}
        sx={{
          bgcolor: '#00F5FF',
          color: 'black',
          '&:hover': { bgcolor: '#00D5DD' },
          '&.Mui-disabled': { bgcolor: 'rgba(0, 245, 255, 0.3)' }
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Swap'}
      </Button>
    </Paper>
  );
};

export default SwapPanel;