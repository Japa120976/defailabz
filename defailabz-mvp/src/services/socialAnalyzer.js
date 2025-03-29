import { TwitterApi } from 'twitter-api-v2';
import TelegramBot from 'node-telegram-bot-api';

export const socialAnalyzer = {
  async analisarRedesSociais(projeto) {
    try {
      const [twitter, telegram] = await Promise.all([
        this.analisarTwitter(projeto),
        this.analisarTelegram(projeto)
      ]);

      const analise = {
        twitter,
        telegram,
        metricas: this.calcularMetricasGerais(twitter, telegram),
        score: 0
      };

      analise.score = this.calcularPontuacao(analise);
      return analise;
    } catch (erro) {
      console.error('Erro na análise social:', erro);
      return {
        erro: erro.message,
        score: 0
      };
    }
  },

  async analisarTwitter(projeto) {
    const client = new TwitterApi(process.env.REACT_APP_TWITTER_API_KEY);
    
    try {
      const perfil = await client.v2.userByUsername(projeto);
      const tweets = await client.v2.search(`${projeto} crypto`);
      
      return {
        seguidores: perfil.data.public_metrics.followers_count,
        tweets: tweets.data,
        engajamento: this.calcularEngajamento(tweets.data),
        sentimento: this.analisarSentimento(tweets.data)
      };
    } catch (erro) {
      console.error('Erro no Twitter:', erro);
      return null;
    }
  },

  async analisarTelegram(projeto) {
    const bot = new TelegramBot(process.env.REACT_APP_TELEGRAM_BOT_TOKEN);
    
    try {
      const grupo = await bot.getChat(`@${projeto}`);
      const membros = await bot.getChatMembersCount(`@${projeto}`);
      
      return {
        membros,
        descricao: grupo.description,
        tipo: grupo.type
      };
    } catch (erro) {
      console.error('Erro no Telegram:', erro);
      return null;
    }
  },

  calcularEngajamento(tweets) {
    if (!tweets?.length) return 0;
    
    const engajamentoTotal = tweets.reduce((total, tweet) => {
      return total + (
        tweet.public_metrics.like_count +
        tweet.public_metrics.retweet_count +
        tweet.public_metrics.reply_count
      );
    }, 0);

    return engajamentoTotal / tweets.length;
  },

  analisarSentimento(tweets) {
    if (!tweets?.length) return 'Neutro';
    
    // Implementar análise de sentimento
    return 'Positivo';
  },

  calcularMetricasGerais(twitter, telegram) {
    return {
      alcanceTotal: (twitter?.seguidores || 0) + (telegram?.membros || 0),
      engajamentoMedio: twitter?.engajamento || 0,
      sentimento: twitter?.sentimento || 'Neutro'
    };
  },

  calcularPontuacao(analise) {
    let pontuacao = 0;
    
    // Pontos por seguidores
    if (analise.twitter?.seguidores > 10000) pontuacao += 30;
    else if (analise.twitter?.seguidores > 1000) pontuacao += 20;
    else if (analise.twitter?.seguidores > 100) pontuacao += 10;

    // Pontos por membros no Telegram
    if (analise.telegram?.membros > 5000) pontuacao += 30;
    else if (analise.telegram?.membros > 500) pontuacao += 20;
    else if (analise.telegram?.membros > 50) pontuacao += 10;

    // Pontos por engajamento
    if (analise.twitter?.engajamento > 100) pontuacao += 40;
    else if (analise.twitter?.engajamento > 10) pontuacao += 20;

    return Math.min(100, pontuacao);
  }
};