import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Autocomplete,
  IconButton,
} from '@mui/material';
import { 
  Analytics,
  Fullscreen,
  FullscreenExit,
  Star,
  StarBorder,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';

import OrderBook from '../components/dex/OrderBook';
import MarketDepth from '../components/dex/MarketDepth';
import RecentTrades from '../components/dex/RecentTrades';
import TradingPanel from '../components/dex/TradingPanel';
import WalletInfo from '../components/dex/WalletInfo';
import OpenPositions from '../components/dex/OpenPositions';
import MarketStats from '../components/dex/MarketStats';
import { aiAnalysisService } from '../services/aiAnalysisService';
import { virtualWalletService } from '../services/virtualWalletService';
import { virtualTradeService } from '../services/virtualTradeService';
import axios from 'axios';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const AI_UPDATE_INTERVAL = 30000;
const CHART_UPDATE_INTERVAL = 5000;

const tradingPairs = [
  { symbol: 'BTC/USDT', id: 'bitcoin', name: 'Bitcoin', tvSymbol: 'BTCUSDT' },
  { symbol: 'ETH/USDT', id: 'ethereum', name: 'Ethereum', tvSymbol: 'ETHUSDT' },
  { symbol: 'BNB/USDT', id: 'binancecoin', name: 'BNB', tvSymbol: 'BNBUSDT' },
  { symbol: 'SOL/USDT', id: 'solana', name: 'Solana', tvSymbol: 'SOLUSDT' },
  { symbol: 'XRP/USDT', id: 'ripple', name: 'XRP', tvSymbol: 'XRPUSDT' },
  { symbol: 'ADA/USDT', id: 'cardano', name: 'Cardano', tvSymbol: 'ADAUSDT' },
  { symbol: 'AVAX/USDT', id: 'avalanche-2', name: 'Avalanche', tvSymbol: 'AVAXUSDT' },
  { symbol: 'DOGE/USDT', id: 'dogecoin', name: 'Dogecoin', tvSymbol: 'DOGEUSDT' }
];

function DexAI() {
  // Estados
  const [selectedPair, setSelectedPair] = useState(tradingPairs[0]);
  const [marketStats, setMarketStats] = useState({
    currentPrice: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0,
    priceChange24h: 0,
    lastUpdated: null
  });
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('tradingFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  const chartContainerRef = useRef(null);
  const tradingViewWidgetRef = useRef(null);

  // Inicialização da carteira
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const currentWallet = virtualWalletService.getWallet();
        setWallet(currentWallet);
        setWalletConnected(true);
      } catch (error) {
        console.error('Erro ao inicializar carteira:', error);
        setError('Falha ao conectar carteira');
      }
    };

    initializeWallet();
  }, []);

  // Buscar dados históricos
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(
          `${BINANCE_API_BASE}/klines`,
          {
            params: {
              symbol: selectedPair.tvSymbol,
              interval: '1h',
              limit: 200
            }
          }
        );
        
        const formattedData = response.data.map(candle => ({
          time: candle[0],
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
          volume: parseFloat(candle[5])
        }));

        setHistoricalData(formattedData);
      } catch (error) {
        console.error('Erro ao buscar dados históricos:', error);
      }
    };

    fetchHistoricalData();
  }, [selectedPair.tvSymbol]);

  // Atualização dos dados do mercado
  useEffect(() => {
    let mounted = true;

    const fetchMarketData = async () => {
      try {
        const [binanceResponse, coingeckoResponse] = await Promise.all([
          axios.get(`${BINANCE_API_BASE}/ticker/24hr`, {
            params: { symbol: selectedPair.tvSymbol }
          }),
          axios.get(`${COINGECKO_API_BASE}/simple/price`, {
            params: {
              ids: selectedPair.id,
              vs_currencies: 'usd',
              include_24hr_change: true,
              include_24hr_vol: true,
              include_last_updated_at: true
            }
          })
        ]);
        
        if (mounted) {
          const binanceData = binanceResponse.data;
          const coingeckoData = coingeckoResponse.data[selectedPair.id];
          
          setMarketStats({
            currentPrice: parseFloat(binanceData.lastPrice),
            high24h: parseFloat(binanceData.highPrice),
            low24h: parseFloat(binanceData.lowPrice),
            volume24h: parseFloat(binanceData.volume),
            priceChange24h: parseFloat(binanceData.priceChangePercent),
            lastUpdated: coingeckoData.last_updated_at
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do mercado:', error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, CHART_UPDATE_INTERVAL);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [selectedPair.id, selectedPair.tvSymbol]);  // Atualização da análise de IA
  useEffect(() => {
    let mounted = true;

    const fetchAiAnalysis = async () => {
      if (!mounted || !historicalData.length) return;
      
      try {
        setAiLoading(true);
        console.log('Iniciando análise para:', selectedPair.tvSymbol);
        
        const analysis = await aiAnalysisService.getAnalysis(
          selectedPair.tvSymbol,
          marketStats.currentPrice,
          historicalData
        );
        
        if (mounted) {
          setAiAnalysis(analysis);
          setAiError(null);
        }
      } catch (error) {
        console.error('Erro na análise IA:', error);
        if (mounted) {
          setAiError('Falha ao carregar análise da IA');
        }
      } finally {
        if (mounted) {
          setAiLoading(false);
        }
      }
    };

    if (marketStats.currentPrice > 0) {
      fetchAiAnalysis();
      const interval = setInterval(fetchAiAnalysis, AI_UPDATE_INTERVAL);
      
      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }
  }, [selectedPair.tvSymbol, marketStats.currentPrice, historicalData]);

  // Inicialização do TradingView
  useEffect(() => {
    const initializeTradingViewWidget = () => {
      if (tradingViewWidgetRef.current) {
        tradingViewWidgetRef.current = null;
      }

      tradingViewWidgetRef.current = new window.TradingView.widget({
        container_id: 'tradingview_chart',
        symbol: `BINANCE:${selectedPair.tvSymbol}`,
        interval: '1',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        theme: 'dark',
        style: '1',
        locale: 'br',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        height: '100%',
        width: '100%',
        studies: [
          'MASimple@tv-basicstudies',
          'RSI@tv-basicstudies',
          'MACD@tv-basicstudies',
          'BB@tv-basicstudies'
        ]
      });
    };

    if (typeof window.TradingView === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initializeTradingViewWidget;
      document.body.appendChild(script);
    } else {
      initializeTradingViewWidget();
    }

    return () => {
      if (tradingViewWidgetRef.current) {
        tradingViewWidgetRef.current = null;
      }
    };
  }, [selectedPair.tvSymbol]);

  const handleTrade = async (order) => {
    try {
      setLoading(true);
      setError('');

      const tradeOrder = {
        symbol: selectedPair.symbol,
        price: order.orderType === 'market' ? marketStats.currentPrice : Number(order.price),
        amount: Number(order.amount),
        type: order.side
      };

      const updatedWallet = await virtualWalletService.handleTrade(tradeOrder);
      setWallet(updatedWallet);

      await virtualTradeService.addOrder({
        ...tradeOrder,
        timestamp: Date.now(),
        status: 'executed'
      });

    } catch (error) {
      console.error('Erro no trade:', error);
      setError(error.message || 'Erro ao executar trade');
    } finally {
      setLoading(false);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      chartContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleFavorite = (pair) => {
    const newFavorites = favorites.includes(pair.symbol)
      ? favorites.filter(symbol => symbol !== pair.symbol)
      : [...favorites, pair.symbol];
    setFavorites(newFavorites);
    localStorage.setItem('tradingFavorites', JSON.stringify(newFavorites));
  };

  return (
    <Box sx={{ bgcolor: '#121212', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {/* Cabeçalho */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(26, 26, 26, 0.9)' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Autocomplete
                    value={selectedPair}
                    onChange={(event, newValue) => setSelectedPair(newValue)}
                    options={tradingPairs}
                    getOptionLabel={(option) => option.symbol}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Par de Trading"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {option.symbol}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(option);
                          }}
                        >
                          {favorites.includes(option.symbol) ? (
                            <Star fontSize="small" sx={{ color: '#ffd700' }} />
                          ) : (
                            <StarBorder fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <MarketStats stats={marketStats} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Gráfico e Painel Lateral */}
          <Grid item container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper 
                ref={chartContainerRef}
                sx={{ 
                  bgcolor: 'rgba(26, 26, 26, 0.9)',
                  height: '500px',
                  position: 'relative'
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                  <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Box>
                <div id="tradingview_chart" style={{ height: '100%' }} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {aiLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress />
                    </Box>
                  ) : aiError ? (
                    <Alert severity="error">{aiError}</Alert>
                  ) : aiAnalysis ? (
                    <Paper sx={{ p: 2, bgcolor: 'rgba(26, 26, 26, 0.9)' }}>
                      <Typography variant="h6" gutterBottom>
                        Análise de IA
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" color={
                          aiAnalysis.recommendation.includes('Compra') ? 'success.main' :
                          aiAnalysis.recommendation.includes('Venda') ? 'error.main' :
                          'warning.main'
                        }>
                          {aiAnalysis.recommendation}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Confiança: {aiAnalysis.confidence}%
                        </Typography>
                      </Box>
                      {aiAnalysis.signals.map((signal, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            {signal.indicator}: {signal.signal} ({signal.value})
                          </Typography>
                        </Box>
                      ))}
                    </Paper>
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <WalletInfo
                    wallet={wallet}
                    connected={walletConnected}
                    loading={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TradingPanel
                    currentPrice={marketStats.currentPrice}
                    symbol={selectedPair.symbol}
                    loading={loading}
                    onTrade={handleTrade}
                    error={error}
                    wallet={wallet}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Componentes Inferiores */}
          <Grid item container spacing={2}>
            <Grid item xs={12} md={6}>
              <OrderBook
                orders={virtualTradeService.getOrderBook(selectedPair.symbol)}
                currentPrice={marketStats.currentPrice}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MarketDepth
                bids={virtualTradeService.getOrderBook(selectedPair.symbol).bids}
                asks={virtualTradeService.getOrderBook(selectedPair.symbol).asks}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RecentTrades
                  trades={virtualTradeService.getRecentTrades(selectedPair.symbol)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <OpenPositions
                  positions={virtualTradeService.getUserOrders('user1')}
                  onClose={(id) => virtualTradeService.cancelOrder(id)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default DexAI;