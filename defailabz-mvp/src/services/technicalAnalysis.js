export const technicalAnalysis = {
    calculateSMA(data, period) {
      if (!data || data.length < period) return [];
      const result = [];
      for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / period);
      }
      return result;
    },
  
    calculateEMA(data, period) {
      if (!data || data.length === 0) return [];
      const k = 2 / (period + 1);
      const result = [data[0]];
      
      for (let i = 1; i < data.length; i++) {
        result.push(data[i] * k + result[i - 1] * (1 - k));
      }
      
      return result;
    },
  
    calculateRSI(data, period = 14) {
      if (!data || data.length <= period) {
        return { value: 50, values: [] };
      }
  
      const changes = data.slice(1).map((price, i) => price - data[i]);
      const gains = changes.map(change => change > 0 ? change : 0);
      const losses = changes.map(change => change < 0 ? -change : 0);
      
      let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
      let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;
      
      const rsi = [100 - (100 / (1 + avgGain / (avgLoss || 1)))];
      
      for (let i = period; i < changes.length; i++) {
        avgGain = (avgGain * (period - 1) + gains[i]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
        rsi.push(100 - (100 / (1 + avgGain / (avgLoss || 1))));
      }
  
      return {
        value: rsi[rsi.length - 1],
        values: rsi
      };
    },
  
    calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
      if (!data || data.length < slowPeriod) {
        return {
          macdLine: [],
          signalLine: [],
          histogram: 0,
          histogramValues: []
        };
      }
  
      const fastEMA = this.calculateEMA(data, fastPeriod);
      const slowEMA = this.calculateEMA(data, slowPeriod);
      const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
      const signalLine = this.calculateEMA(macdLine, signalPeriod);
      const histogram = macdLine.map((macd, i) => macd - (signalLine[i] || 0));
  
      return {
        macdLine,
        signalLine,
        histogram: histogram[histogram.length - 1] || 0,
        histogramValues: histogram
      };
    },
  
    analyzeTrend(data, movingAverages) {
      if (!data || !movingAverages || movingAverages.length < 3) {
        return {
          direction: 'Lateral',
          strength: 3,
          shortTerm: 'Neutro',
          mediumTerm: 'Neutro',
          longTerm: 'Neutro'
        };
      }
  
      const [ema20, sma50, sma200] = movingAverages;
      const lastPrice = data[data.length - 1];
      
      const shortTerm = lastPrice > ema20[ema20.length - 1] ? 'Alta' : 'Baixa';
      const mediumTerm = lastPrice > sma50[sma50.length - 1] ? 'Alta' : 'Baixa';
      const longTerm = lastPrice > sma200[sma200.length - 1] ? 'Alta' : 'Baixa';
  
      const direction = this.determineTrendDirection(shortTerm, mediumTerm, longTerm);
      const strength = this.calculateTrendStrength(data, movingAverages);
  
      return {
        direction,
        strength,
        shortTerm,
        mediumTerm,
        longTerm
      };
    },
  
    determineTrendDirection(shortTerm, mediumTerm, longTerm) {
      const trends = [shortTerm, mediumTerm, longTerm];
      const altas = trends.filter(t => t === 'Alta').length;
      
      if (altas >= 2) return 'Alta';
      if (altas <= 1) return 'Baixa';
      return 'Lateral';
    },
  
    calculateTrendStrength(data, movingAverages) {
      if (!data || !movingAverages || movingAverages.length < 3) return 3;
  
      const [ema20, sma50, sma200] = movingAverages;
      const lastPrice = data[data.length - 1];
      
      const deviations = [
        Math.abs(lastPrice - ema20[ema20.length - 1]) / lastPrice,
        Math.abs(lastPrice - sma50[sma50.length - 1]) / lastPrice,
        Math.abs(lastPrice - sma200[sma200.length - 1]) / lastPrice
      ];
  
      const average = deviations.reduce((a, b) => a + b, 0) / deviations.length;
      return Math.min(5, Math.max(1, Math.round(average * 100)));
    }
  };