import React, { useState } from 'react';
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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

function FundamentalAnalysis() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const calculateMA = (data, period) => {
    const ma = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ma.push(null);
        continue;
      }
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      ma.push(sum / period);
    }
    return ma;
  };

  const calculateRSI = (prices, period = 14) => {
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);

    const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  const generateReport = (data, projectData, metrics) => {
    const {
      market_data,
      developer_data,
      community_data,
      market_cap_rank,
      liquidity_score,
      public_interest_score
    } = projectData;

    const volumeMarketCapRatio = (market_data.total_volume.usd / market_data.market_cap.usd) * 100;
    const liquidityAnalysis = `A relação volume/market cap de ${volumeMarketCapRatio.toFixed(2)}% ${
      volumeMarketCapRatio > 10 ? 'indica boa liquidez' : 'sugere liquidez limitada'
    }. Score de liquidez: ${liquidity_score}/100.`;

    const commitActivity = developer_data.commit_count_4_weeks;
    const devAnalysis = `Atividade de desenvolvimento nos últimos 30 dias: ${commitActivity} commits, ${
      developer_data.pull_requests_merged
    } PRs merged, ${developer_data.pull_request_contributors} contribuidores ativos. ${
      commitActivity > 100 ? 'Alta atividade de desenvolvimento' : 
      commitActivity > 50 ? 'Atividade de desenvolvimento moderada' : 
      'Baixa atividade de desenvolvimento'
    }.`;

    const communityAnalysis = `Comunidade: ${
      community_data.twitter_followers.toLocaleString()
    } seguidores no Twitter, ${
      community_data.reddit_subscribers.toLocaleString()
    } inscritos no Reddit. ${
      public_interest_score > 0.8 ? 'Alto interesse público' :
      public_interest_score > 0.5 ? 'Interesse público moderado' :
      'Baixo interesse público'
    }.`;

    const marketAnalysis = `Ranking de market cap: #${market_cap_rank}. ${
      metrics.marketCapChange > 0 
        ? `Crescimento de ${metrics.marketCapChange.toFixed(2)}% no market cap no último ano.`
        : `Redução de ${Math.abs(metrics.marketCapChange).toFixed(2)}% no market cap no último ano.`
    }`;

    const technicalAnalysis = `RSI atual de ${metrics.rsi.toFixed(2)} ${
      metrics.rsi > 70 ? 'indica sobrecompra' :
      metrics.rsi < 30 ? 'indica sobrevenda' :
      'está em níveis neutros'
    }. Volatilidade de ${metrics.volatility.toFixed(2)}% ${
      metrics.volatility > 100 ? 'é extremamente alta' :
      metrics.volatility > 50 ? 'é elevada' :
      'está em níveis moderados'
    }.`;

    const riskAnalysis = `Nível de risco: ${
      metrics.volatility > 100 || volumeMarketCapRatio < 5 ? 'ALTO' :
      metrics.volatility > 50 || volumeMarketCapRatio < 10 ? 'MÉDIO' :
      'BAIXO'
    }. Fatores considerados: volatilidade, liquidez e atividade de desenvolvimento.`;

    const conclusion = `CONCLUSÃO: ${
      metrics.overallScore > 70 ? 'FORTE COMPRA' :
      metrics.overallScore > 60 ? 'COMPRA' :
      metrics.overallScore > 40 ? 'NEUTRO' :
      metrics.overallScore > 30 ? 'VENDA' :
      'FORTE VENDA'
    } - Score geral de ${metrics.overallScore.toFixed(2)}/100. ${
      metrics.overallScore > 50 
        ? 'Os fundamentos sugerem perspectivas positivas para o longo prazo.'
        : 'Os fundamentos indicam cautela no momento atual.'
    }`;

    return {
      liquidityAnalysis,
      devAnalysis,
      communityAnalysis,
      marketAnalysis,
      technicalAnalysis,
      riskAnalysis,
      conclusion
    };
  };

  const analyzeFundamentals = async () => {
    if (!symbol) {
      setError('Por favor, insira o símbolo do ativo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const coinId = symbolMapping[symbol.toLowerCase()] || symbol.toLowerCase();
      
      const [priceData, projectData] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=365&interval=daily`),
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=true&developer_data=true&sparkline=false`)
      ]);

      if (!priceData.ok || !projectData.ok) {
        throw new Error('Erro ao buscar dados do projeto');
      }

      const data = await priceData.json();
      const project = await projectData.json();

      const prices = data.prices.map(price => price[1]);
      const volumes = data.total_volumes.map(volume => volume[1]);
      const marketCaps = data.market_caps.map(cap => cap[1]);

      const ma7 = calculateMA(prices, 7);
      const ma30 = calculateMA(prices, 30);
      const ma200 = calculateMA(prices, 200);
      const rsi = calculateRSI(prices);
      const volatility = Math.sqrt(
        prices.reduce((sum, price) => sum + Math.pow(price - prices[0], 2), 0) / prices.length
      );

      const devScore = (
        (project.developer_data.commit_count_4_weeks / 100) * 25 +
        (project.developer_data.pull_requests_merged / 50) * 25 +
        (project.developer_data.pull_request_contributors / 20) * 25 +
        ((project.developer_data.stars || 0) / 1000) * 25
      );

      const communityScore = (
        (Math.min(project.community_data.twitter_followers / 100000, 1) * 33.33) +
        (Math.min(project.community_data.reddit_subscribers / 50000, 1) * 33.33) +
        (Math.min((project.community_data.telegram_channel_user_count || 0) / 25000, 1) * 33.33)
      );

      const technicalScore = (
        (rsi > 30 && rsi < 70 ? 100 : 50) +
        (volatility < 50 ? 100 : 50) +
        (ma7[ma7.length - 1] > ma30[ma30.length - 1] ? 100 : 50)
      ) / 3;

      const overallScore = (
        (technicalScore * 0.4) +
        (Math.min(devScore, 100) * 0.3) +
        (Math.min(communityScore, 100) * 0.3)
      );

      const fundamentalAnalysis = {
        currentPrice: prices[prices.length - 1],
        predictions: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: prices[prices.length - 1] * (1 + (overallScore/100 - 0.5) * (i + 1) * 0.01)
        })),
        metrics: {
          rsi,
          volatility,
          volumeChange: (volumes[volumes.length - 1] - volumes[0]) / volumes[0] * 100,
          marketCapChange: (marketCaps[marketCaps.length - 1] - marketCaps[0]) / marketCaps[0] * 100,
          devScore: Math.min(devScore, 100),
          communityScore: Math.min(communityScore, 100),
          technicalScore,
          overallScore
        },
        projectInfo: {
          name: project.name,
          description: project.description.en,
          githubStats: project.developer_data,
          communityStats: project.community_data
        }
      };

      const report = generateReport(data, project, fundamentalAnalysis.metrics);
      setAnalysis({ ...fundamentalAnalysis, report });

    } catch (err) {
      setError('Erro ao analisar fundamentos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      bgcolor: 'background.default',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            color: 'primary.main',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <TrendingUp /> Análise Fundamentalista
        </Typography>

        <Paper sx={{ p: 4, bgcolor: 'background.paper', mb: 4 }}>
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
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={analyzeFundamentals}
                disabled={loading}
                sx={{
                  px: 4,
                  whiteSpace: 'nowrap'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Analisar Fundamentos'}
              </Button>
            </Box>
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
              <Paper sx={{ p: 2, bgcolor: 'background.paper', height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Previsão de Preços (30 dias)
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="primary.main" 
                      name="Preço Previsto"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Análise do Projeto
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle1">Score Técnico</Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main' }}>
                        {analysis.metrics.technicalScore.toFixed(2)}%
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle1">Score Desenvolvimento</Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main' }}>
                        {analysis.metrics.devScore.toFixed(2)}%
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle1">Score Comunidade</Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main' }}>
                        {analysis.metrics.communityScore.toFixed(2)}%
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle1">Score Geral</Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main' }}>
                        {analysis.metrics.overallScore.toFixed(2)}%
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Relatório Detalhado
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body1">
                    <strong>Análise de Mercado:</strong><br/>
                    {analysis.report.marketAnalysis}
                  </Typography>

                  <Typography variant="body1">
                    <strong>Análise de Liquidez:</strong><br/>
                    {analysis.report.liquidityAnalysis}
                  </Typography>

                  <Typography variant="body1">
                    <strong>Análise de Desenvolvimento:</strong><br/>
                    {analysis.report.devAnalysis}
                  </Typography>

                  <Typography variant="body1">
                    <strong>Análise da Comunidade:</strong><br/>
                    {analysis.report.communityAnalysis}
                  </Typography>

                  <Typography variant="body1">
                    <strong>Análise Técnica:</strong><br/>
                    {analysis.report.technicalAnalysis}
                  </Typography>

                  <Typography variant="body1">
                    <strong>Análise de Risco:</strong><br/>
                    {analysis.report.riskAnalysis}
                  </Typography>

                  <Typography variant="h6" sx={{ 
                    mt: 2, 
                    p: 2, 
                    bgcolor: 'background.default',
                    borderRadius: 1
                  }}>
                    {analysis.report.conclusion}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default FundamentalAnalysis;