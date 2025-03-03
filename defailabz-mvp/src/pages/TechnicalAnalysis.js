import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

// Mapeamento de símbolos para IDs do CoinGecko
const symbolMapping = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'bnb': 'binancecoin',
  'sol': 'solana',
  'ada': 'cardano',
  'dot': 'polkadot',
  'doge': 'dogecoin',
  'xrp': 'ripple',
  'avax': 'avalanche-2',
  'matic': 'matic-network',
  'link': 'chainlink',
  'uni': 'uniswap',
  'atom': 'cosmos',
  'ltc': 'litecoin',
};

function TechnicalAnalysis() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [widget, setWidget] = useState(null);
  const tradingViewRef = useRef(null);

  // Função para calcular Média Móvel Simples (SMA)
  const calculateSMA = (prices, period) => {
    const sma = [];
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        sma.push(null);
        continue;
      }
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  };

  // Função para calcular o Didi Index
  const calculateDidiIndex = (prices) => {
    const sma3 = calculateSMA(prices, 3);
    const sma8 = calculateSMA(prices, 8);
    const sma20 = calculateSMA(prices, 20);

    // Pegar os últimos valores válidos
    const lastIndex = prices.length - 1;
    const currentSma3 = sma3[lastIndex];
    const currentSma8 = sma8[lastIndex];
    const currentSma20 = sma20[lastIndex];
    const prevSma3 = sma3[lastIndex - 1];
    const prevSma8 = sma8[lastIndex - 1];
    const prevSma20 = sma20[lastIndex - 1];

    // Determinar o sinal do Didi Index
    let signal = 'NEUTRO';
    let strength = 0;

    if (currentSma3 > currentSma8 && currentSma8 > currentSma20) {
      if (prevSma3 <= prevSma8 || prevSma8 <= prevSma20) {
        signal = 'COMPRA';
        strength = ((currentSma3 - currentSma20) / currentSma20) * 100;
      }
    } else if (currentSma3 < currentSma8 && currentSma8 < currentSma20) {
      if (prevSma3 >= prevSma8 || prevSma8 >= prevSma20) {
        signal = 'VENDA';
        strength = ((currentSma20 - currentSma3) / currentSma20) * 100;
      }
    }

    return {
      signal,
      strength: Math.abs(strength),
      sma3: currentSma3,
      sma8: currentSma8,
      sma20: currentSma20
    };
  };

  // Função para limpar o widget anterior
  const cleanupWidget = () => {
    if (widget) {
      try {
        const container = document.getElementById('tradingview_widget');
        if (container) {
          container.innerHTML = '';
        }
      } catch (error) {
        console.log('Erro ao limpar widget:', error);
      }
    }
  };

  // Função para criar novo widget
  const createWidget = (symbolName) => {
    try {
      cleanupWidget();
      
      const container = document.getElementById('tradingview_widget');
      if (!container) return;

      const newWidget = new window.TradingView.widget({
        container_id: "tradingview_widget",
        width: "100%",
        height: 500,
        symbol: `BINANCE:${symbolName.toUpperCase()}USDT`,
        interval: "D",
        timezone: "America/Sao_Paulo",
        theme: "dark",
        style: "1",
        locale: "br",
        toolbar_bg: "#1A1A1A",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        studies: [
          "RSI@tv-basicstudies",
          "MACD@tv-basicstudies",
          "AwesomeOscillator@tv-basicstudies"
        ],
        save_image: false,
        backgroundColor: "#1A1A1A",
        gridColor: "#2B2B43",
        container_border: "none",
        hide_top_toolbar: false,
        hide_legend: false,
        withdateranges: true,
      });

      setWidget(newWidget);
      return newWidget;
    } catch (error) {
      console.error('Erro ao criar widget:', error);
      return null;
    }
  };

  // Efeito para limpar o widget quando o componente é desmontado
  useEffect(() => {
    return () => {
      cleanupWidget();
    };
  }, []);

  // Função para calcular RSI
  const calculateRSI = (prices, period = 14) => {
    let gains = [];
    let losses = [];
    
    for(let i = 1; i < prices.length; i++) {
      const difference = prices[i] - prices[i-1];
      if(difference >= 0) {
        gains.push(difference);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(difference));
      }
    }

    const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  // Função para calcular volatilidade
  const calculateVolatility = (prices) => {
    const returns = prices.map((price, i) => 
      i > 0 ? ((price - prices[i-1]) / prices[i-1]) * 100 : 0
    );
    const mean = returns.reduce((a, b) => a + b) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  };

  // Função para calcular tendência
  const calculateTrend = (prices) => {
    const n = prices.length;
    const x = Array.from({length: n}, (_, i) => i);
    const y = prices;
    
    const sumX = x.reduce((a, b) => a + b);
    const sumY = y.reduce((a, b) => a + b);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  };

  // Função para determinar recomendação atualizada com Didi Index
  const determineRecommendation = (rsi, priceChange, trend, didiIndex) => {
    let signals = 0;
    
    // RSI
    if (rsi > 70) signals--;
    if (rsi < 30) signals++;
    
    // Tendência
    if (trend > 0) signals++;
    if (trend < 0) signals--;
    
    // Momentum
    if (priceChange > 10) signals--;
    if (priceChange < -10) signals++;

    // Didi Index
    if (didiIndex.signal === 'COMPRA') signals += 2;
    if (didiIndex.signal === 'VENDA') signals -= 2;
    
    if (signals > 0) return 'COMPRA';
    if (signals < 0) return 'VENDA';
    return 'NEUTRO';
  };

  // Função para calcular confiança atualizada
  const calculateConfidence = (rsi, priceChange, trend, volatility, didiStrength) => {
    const rsiStrength = Math.abs(50 - rsi) * 2;
    const trendStrength = Math.abs(trend) * 10;
    const momentumStrength = Math.min(Math.abs(priceChange), 100);
    const volatilityImpact = Math.min(volatility * 2, 100);
    const didiImpact = Math.min(didiStrength, 100);
    
    const confidence = (rsiStrength + trendStrength + momentumStrength + didiImpact) / 4;
    return Math.min(confidence * (1 - volatilityImpact/200), 100);
  };

  const analyzeChart = async () => {
    if (!symbol) {
      setError('Por favor, insira o símbolo do ativo (exemplo: bitcoin ou BTC)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const coinId = symbolMapping[symbol.toLowerCase()] || symbol.toLowerCase();
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=100&interval=daily`
      );
      
      if (!response.ok) {
        throw new Error('Moeda não encontrada. Use o nome (bitcoin) ou símbolo (BTC) correto');
      }

      const data = await response.json();
      const prices = data.prices.map(price => price[1]);
      
      // Calcular indicadores
      const rsi = calculateRSI(prices);
      const priceChange = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
      const volatility = calculateVolatility(prices);
      const trend = calculateTrend(prices);
      const didiIndex = calculateDidiIndex(prices);
      
      // Análise da IA
      const technicalAnalysis = {
        rsi: rsi,
        momentum: priceChange,
        trendStrength: Math.abs(trend),
        volatility: volatility,
        didiIndex: didiIndex,
        recommendation: determineRecommendation(rsi, priceChange, trend, didiIndex),
        confidence: calculateConfidence(rsi, priceChange, trend, volatility, didiIndex.strength)
      };

      setAnalysis(technicalAnalysis);
      
      setTimeout(() => {
        const tradingViewSymbol = symbolMapping[symbol.toLowerCase()] ? 
          symbol.toUpperCase() : 
          coinId.toUpperCase();
        createWidget(tradingViewSymbol);
      }, 0);

    } catch (err) {
      setError('Erro ao analisar o ativo: ' + err.message);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      background: 'black',
      color: 'white',
      py: 4
    }}>
      <style>
        {`
          .w3m-error {
            display: none !important;
          }
        `}
      </style>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            color: '#00F5FF',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <TrendingUp /> Análise Técnica com IA
        </Typography>

        <Paper sx={{ p: 4, bgcolor: '#121212', color: 'white', mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Digite o nome ou símbolo da criptomoeda (exemplo: bitcoin, BTC)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toLowerCase())}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#00F5FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00F5FF',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={analyzeChart}
                disabled={loading}
                sx={{
                  bgcolor: '#00F5FF',
                  color: 'black',
                  '&:hover': {
                    bgcolor: '#00D5DD',
                  },
                  px: 4,
                  whiteSpace: 'nowrap'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Analisar com IA'}
              </Button>
            </Box>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Você pode usar o nome completo (bitcoin) ou o símbolo (BTC) da criptomoeda
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>

        {analysis && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: '#1A1A1A', height: '600px' }}>
                <div 
                  id="tradingview_widget" 
                  style={{ height: '100%', width: '100%' }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#1A1A1A' }}>
                <Typography variant="h5" sx={{ 
                  color: analysis.recommendation === 'COMPRA' ? '#4CAF50' : 
                         analysis.recommendation === 'VENDA' ? '#FF5252' : '#FFC107',
                  mb: 3 
                }}>
                  Recomendação da IA: {analysis.recommendation}
                </Typography>
                <Typography variant="h6" sx={{ color: '#888', mb: 2 }}>
                  Confiança: {analysis.confidence.toFixed(2)}%
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, bgcolor: '#222' }}>
                      <Typography variant="subtitle1">RSI</Typography>
                      <Typography variant="h4" sx={{ color: '#00F5FF' }}>
                        {analysis.rsi.toFixed(2)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, bgcolor: '#222' }}>
                      <Typography variant="subtitle1">Momentum</Typography>
                      <Typography variant="h4" sx={{ color: '#00F5FF' }}>
                        {analysis.momentum.toFixed(2)}%
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, bgcolor: '#222' }}>
                      <Typography variant="subtitle1">Força da Tendência</Typography>
                      <Typography variant="h4" sx={{ color: '#00F5FF' }}>
                        {analysis.trendStrength.toFixed(2)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, bgcolor: '#222' }}>
                      <Typography variant="subtitle1">Volatilidade</Typography>
                      <Typography variant="h4" sx={{ color: '#00F5FF' }}>
                        {analysis.volatility.toFixed(2)}%
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#222' }}>
                      <Typography variant="subtitle1">Didi Index</Typography>
                      <Typography variant="h4" sx={{ 
                        color: analysis.didiIndex.signal === 'COMPRA' ? '#4CAF50' : 
                               analysis.didiIndex.signal === 'VENDA' ? '#FF5252' : '#FFC107'
                      }}>
                        {analysis.didiIndex.signal}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        Força: {analysis.didiIndex.strength.toFixed(2)}%
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default TechnicalAnalysis;