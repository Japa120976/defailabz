class AIAnalysisService {
  async getAnalysis(symbol, currentPrice, historicalData) {
    try {
      console.log('Recebendo dados:', { symbol, currentPrice, historicalDataLength: historicalData?.length });

      if (!historicalData || historicalData.length === 0) {
        throw new Error('Dados históricos não disponíveis');
      }

      // Cálculos básicos iniciais
      const sma20 = this.calculateSMA(historicalData, 20);
      const sma50 = this.calculateSMA(historicalData, 50);
      const rsi = this.calculateRSI(historicalData);

      console.log('Indicadores calculados:', { sma20, sma50, rsi });

      // Análise simplificada
      const trend = sma20 > sma50 ? 'Alta' : 'Baixa';
      const strength = Math.abs((sma20 - sma50) / sma50 * 100);

      return {
        recommendation: trend === 'Alta' ? 'Compra' : 'Venda',
        confidence: Math.min(Math.round(strength), 100),
        signals: [
          {
            indicator: 'Tendência',
            signal: trend,
            value: `${strength.toFixed(2)}%`
          },
          {
            indicator: 'RSI',
            signal: rsi > 70 ? 'Sobrecomprado' : rsi < 30 ? 'Sobrevendido' : 'Neutro',
            value: rsi.toFixed(2)
          }
        ],
        details: {
          supportResistance: {
            supports: [
              (currentPrice * 0.95).toFixed(2),
              (currentPrice * 0.90).toFixed(2)
            ],
            resistances: [
              (currentPrice * 1.05).toFixed(2),
              (currentPrice * 1.10).toFixed(2)
            ]
          }
        },
        predictions: {
          shortTerm: {
            prediction: (currentPrice * 1.02).toFixed(2),
            confidence: 80,
            timeframe: '24h'
          },
          mediumTerm: {
            prediction: (currentPrice * 1.05).toFixed(2),
            confidence: 70,
            timeframe: '7d'
          },
          longTerm: {
            prediction: (currentPrice * 1.10).toFixed(2),
            confidence: 60,
            timeframe: '30d'
          }
        }
      };

    } catch (error) {
      console.error('Erro na análise:', error);
      throw error;
    }
  }

  calculateSMA(data, period) {
    const closes = data.map(d => d.close);
    return closes.slice(-period).reduce((a, b) => a + b) / period;
  }

  calculateRSI(data, period = 14) {
    const closes = data.map(d => d.close);
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period; i++) {
      const difference = closes[i] - closes[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    return 100 - (100 / (1 + (avgGain / avgLoss)));
  }
}

export const aiAnalysisService = new AIAnalysisService();