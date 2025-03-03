import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  Slider,
  Tooltip
} from '@mui/material';

function TradingPanel({ currentPrice, symbol, loading, onTrade, error, wallet }) {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const [baseAsset, quoteAsset] = symbol.split('/');

  // Atualizar preço quando mudar o tipo de ordem ou preço atual
  useEffect(() => {
    if (orderType === 'market') {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice, orderType]);

  // Calcular total
  useEffect(() => {
    const calculatedTotal = Number(price) * Number(amount);
    setTotal(isNaN(calculatedTotal) ? 0 : calculatedTotal);
  }, [price, amount]);

  const handleOrderTypeChange = (event, newType) => {
    if (newType !== null) {
      setOrderType(newType);
      if (newType === 'market') {
        setPrice(currentPrice.toString());
      }
    }
  };

  const handleSideChange = (event, newSide) => {
    if (newSide !== null) {
      setSide(newSide);
      setSliderValue(0);
      setAmount('');
    }
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    
    if (wallet) {
      let maxAmount;
      if (side === 'buy') {
        maxAmount = wallet[quoteAsset] / currentPrice;
      } else {
        maxAmount = wallet[baseAsset];
      }
      
      const newAmount = (maxAmount * newValue / 100).toFixed(8);
      setAmount(newAmount.toString());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !price) return;

    const order = {
      orderType,
      side,
      price: Number(price),
      amount: Number(amount),
      total: Number(total)
    };

    await onTrade(order);
    
    // Resetar formulário após o trade
    setAmount('');
    setSliderValue(0);
    if (orderType !== 'market') {
      setPrice('');
    }
  };

  const marks = [
    { value: 0, label: '0%' },
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' }
  ];

  return (
    <Paper sx={{ p: 2, bgcolor: 'rgba(26, 26, 26, 0.9)' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Tipo de ordem */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <ToggleButtonGroup
                value={orderType}
                exclusive
                onChange={handleOrderTypeChange}
                fullWidth
              >
                <ToggleButton value="market">
                  Mercado
                </ToggleButton>
                <ToggleButton value="limit">
                  Limite
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>

          {/* Compra/Venda */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <ToggleButtonGroup
                value={side}
                exclusive
                onChange={handleSideChange}
                fullWidth
              >
                <ToggleButton 
                  value="buy"
                  sx={{ 
                    '&.Mui-selected': { 
                      bgcolor: 'success.dark',
                      '&:hover': { bgcolor: 'success.main' }
                    }
                  }}
                >
                  Comprar
                </ToggleButton>
                <ToggleButton 
                  value="sell"
                  sx={{ 
                    '&.Mui-selected': { 
                      bgcolor: 'error.dark',
                      '&:hover': { bgcolor: 'error.main' }
                    }
                  }}
                >
                  Vender
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>

          {/* Preço */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Preço"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={orderType === 'market'}
              InputProps={{
                endAdornment: <Typography>{quoteAsset}</Typography>
              }}
            />
          </Grid>

          {/* Quantidade */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantidade"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                endAdornment: <Typography>{baseAsset}</Typography>
              }}
            />
          </Grid>

          {/* Slider */}
          <Grid item xs={12}>
            <Slider
              value={sliderValue}
              onChange={handleSliderChange}
              marks={marks}
              valueLabelDisplay="auto"
            />
          </Grid>

          {/* Total */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Total"
              type="number"
              value={total.toFixed(2)}
              disabled
              InputProps={{
                endAdornment: <Typography>{quoteAsset}</Typography>
              }}
            />
          </Grid>

          {/* Botão de execução */}
          <Grid item xs={12}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading || !amount || !price}
              color={side === 'buy' ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                `${side === 'buy' ? 'Comprar' : 'Vender'} ${baseAsset}`
              )}
            </Button>
          </Grid>

          {/* Mensagem de erro */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </Grid>
          )}
        </Grid>
      </form>
    </Paper>
  );
}

export default TradingPanel;