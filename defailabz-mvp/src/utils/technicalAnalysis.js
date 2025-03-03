export const technicalAnalysis = {
    // Funções Base
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
  
    calculateWMA(data, period) {
      if (!data || data.length < period) return [];
      const weights = Array.from({length: period}, (_, i) => i + 1);
      const denominator = weights.reduce((a, b) => a + b, 0);
      
      const result = [];
      for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j] * weights[period - 1 - j];
        }
        result.push(sum / denominator);
      }
      return result;
    },
  
    // Indicadores Avançados
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
  
    calculateBollingerBands(data, period = 20, stdDev = 2) {
      const sma = this.calculateSMA(data, period);
      const bands = sma.map((middle, i) => {
        const slice = data.slice(i - period + 1, i + 1);
        const std = this.calculateStandardDeviation(slice);
        return {
          upper: middle + stdDev * std,
          middle,
          lower: middle - stdDev * std
        };
      });
      
      return bands;
    },
  
    calculateIchimoku(data) {
      const highs = data.map(d => d.high);
      const lows = data.map(d => d.low);
      
      const tenkanSen = this.calculateIchimokuLine(highs, lows, 9);
      const kijunSen = this.calculateIchimokuLine(highs, lows, 26);
      const senkouSpanA = tenkanSen.map((ten, i) => (ten + kijunSen[i]) / 2);
      const senkouSpanB = this.calculateIchimokuLine(highs, lows, 52);
      
      return {
        tenkanSen,
        kijunSen,
        senkouSpanA,
        senkouSpanB,
        chikouSpan: data.map(d => d.close).slice(0, -26)
      };
    },
  
    calculateIchimokuLine(highs, lows, period) {
      const result = [];
      for (let i = period - 1; i < highs.length; i++) {
        const highSlice = highs.slice(i - period + 1, i + 1);
        const lowSlice = lows.slice(i - period + 1, i + 1);
        result.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
      }
      return result;
    },
  
    calculateFibonacciLevels(highs, lows) {
      const high = Math.max(...highs);
      const low = Math.min(...lows);
      const diff = high - low;
      
      return {
        levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].map(level => ({
          level,
          price: high - diff * level
        })),
        extensions: [1.618, 2.618, 3.618, 4.236].map(level => ({
          level,
          price: high + diff * (level - 1)
        })),
        retracements: [0.236, 0.382, 0.5, 0.618, 0.786].map(level => ({
          level,
          price: high - diff * level
        }))
      };
    },
  
    // Padrões de Candlestick
    identifyCandlestickPatterns(data) {
      const patterns = [];
      const lastCandles = data.slice(-5);
      
      // Doji
      if (this.isDoji(lastCandles[lastCandles.length - 1])) {
        patterns.push({
          name: 'Doji',
          significance: 'Indecisão no mercado',
          reliability: 0.6
        });
      }
  
      // Hammer
      if (this.isHammer(lastCandles[lastCandles.length - 1])) {
        patterns.push({
          name: 'Hammer',
          significance: 'Possível reversão de baixa',
          reliability: 0.7
        });
      }
  
      // Engulfing
      if (this.isEngulfing(lastCandles.slice(-2))) {
        patterns.push({
          name: 'Engulfing',
          significance: 'Forte sinal de reversão',
          reliability: 0.8
        });
      }
  
      return patterns;
    },
  
    // Padrões Harmônicos
    identifyHarmonicPatterns(data) {
      const patterns = [];
      const swings = this.findSwingPoints(data);
      
      // Gartley
      if (this.isGartley(swings)) {
        patterns.push({
          name: 'Gartley',
          points: swings.slice(-5),
          reliability: 0.85
        });
      }
  
      // Butterfly
      if (this.isButterfly(swings)) {
        patterns.push({
          name: 'Butterfly',
          points: swings.slice(-5),
          reliability: 0.8
        });
      }
  
      return patterns;
    },
  
    // Ondas de Elliott
    analyzeElliottWaves(data) {
      const waves = this.findWaves(data);
      return {
        currentWave: this.identifyCurrentWave(waves),
        nextProbableMove: this.predictNextWaveMove(waves),
        reliability: this.calculateWaveReliability(waves)
      };
    },
  
    // Funções Auxiliares
    calculateStandardDeviation(data) {
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const squareDiffs = data.map(value => Math.pow(value - mean, 2));
      const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
      return Math.sqrt(avgSquareDiff);
    },
  
    findSwingPoints(data) {
      const swings = [];
      for (let i = 1; i < data.length - 1; i++) {
        if (data[i].high > data[i-1].high && data[i].high > data[i+1].high) {
          swings.push({ type: 'high', price: data[i].high, index: i });
        }
        if (data[i].low < data[i-1].low && data[i].low < data[i+1].low) {
          swings.push({ type: 'low', price: data[i].low, index: i });
        }
      }
      return swings;
    },
  
    isDoji(candle) {
      const bodySize = Math.abs(candle.open - candle.close);
      const wickSize = candle.high - candle.low;
      return bodySize / wickSize < 0.1;
    },
  
    isHammer(candle) {
      const bodySize = Math.abs(candle.open - candle.close);
      const lowerWick = Math.min(candle.open, candle.close) - candle.low;
      const upperWick = candle.high - Math.max(candle.open, candle.close);
      return lowerWick > bodySize * 2 && upperWick < bodySize * 0.5;
    },
  
    isEngulfing(candles) {
      if (candles.length < 2) return false;
      const [prev, current] = candles;
      return (
        current.open < prev.close &&
        current.close > prev.open &&
        Math.abs(current.close - current.open) > Math.abs(prev.close - prev.open)
      );
    },
  
    // Funções de Análise Avançada
    calculateVolumeProfile(data) {
      const volumeByPrice = {};
      data.forEach(candle => {
        const price = Math.round(candle.close);
        volumeByPrice[price] = (volumeByPrice[price] || 0) + candle.volume;
      });
      return Object.entries(volumeByPrice)
        .map(([price, volume]) => ({ price: Number(price), volume }))
        .sort((a, b) => b.volume - a.volume);
    },
  
    detectDivergences(data, indicator) {
      const divergences = [];
      const prices = data.map(d => d.close);
      const indicatorValues = indicator.values;
      
      for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i-1] && indicatorValues[i] < indicatorValues[i-1]) {
          divergences.push({
            type: 'bearish',
            index: i,
            reliability: 0.8
          });
        }
        if (prices[i] < prices[i-1] && indicatorValues[i] > indicatorValues[i-1]) {
          divergences.push({
            type: 'bullish',
            index: i,
            reliability: 0.8
          });
        }
      }
      
      return divergences;
    }
  };