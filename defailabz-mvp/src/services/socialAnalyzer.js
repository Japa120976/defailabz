import { TwitterApi } from 'twitter-api-v2';
import TelegramBot from 'node-telegram-bot-api';
import { Client } from 'discord.js';

export const socialAnalyzer = {
  async analisarRedesSociais(url) {
    try {
      const [analiseX, analiseTelegram, analiseDiscord] = await Promise.all([
        this.analisarX(url),
        this.analisarTelegram(url),
        this.analisarDiscord(url)
      ]);

      const score = this.calcularScore({
        x: analiseX,
        telegram: analiseTelegram,
        discord: analiseDiscord
      });

      return {
        x: analiseX,
        telegram: analiseTelegram,
        discord: analiseDiscord,
        score
      };
    } catch (erro) {
      console.error('Erro na análise social:', erro);
      return null;
    }
  },

  async analisarX(projeto) {
    try {
      const client = new TwitterApi({
        appKey: process.env.REACT_APP_X_API_KEY,
        appSecret: process.env.REACT_APP_X_API_SECRET,
        bearerToken: process.env.REACT_APP_X_BEARER_TOKEN,
      });

      const user = await client.v2.userByUsername(projeto);
      const tweets = await client.v2.userTimeline(user.data.id, {
        max_results: 100,
        exclude: ['retweets', 'replies']
      });

      return {
        followers: user.data.public_metrics.followers_count,
        following: user.data.public_metrics.following_count,
        tweets: tweets.data.length,
        engagement: this.calcularEngagementX(tweets.data),
        lastActivity: user.data.created_at,
        verified: user.data.verified
      };
    } catch (erro) {
      console.error('Erro na análise do X:', erro);
      return null;
    }
  },

  async analisarTelegram(projeto) {
    try {
      const bot = new TelegramBot(process.env.REACT_APP_TELEGRAM_BOT_TOKEN);
      const chat = await bot.getChat(`@${projeto}`);
      
      return {
        members: chat.member_count,
        description: chat.description,
        type: chat.type,
        lastActivity: new Date().toISOString(),
        hasUsername: !!chat.username
      };
    } catch (erro) {
      console.error('Erro na análise do Telegram:', erro);
      return null;
    }
  },

  async analisarDiscord(projeto) {
    try {
      const client = new Client({
        intents: ['Guilds', 'GuildMembers', 'GuildMessages']
      });

      await client.login(process.env.REACT_APP_DISCORD_BOT_TOKEN);
      const guild = await client.guilds.fetch(projeto);
      const members = await guild.members.fetch();

      return {
        members: guild.memberCount,
        online: members.filter(m => m.presence?.status === 'online').size,
        channels: guild.channels.cache.size,
        roles: guild.roles.cache.size,
        boosts: guild.premiumSubscriptionCount,
        lastActivity: new Date().toISOString()
      };
    } catch (erro) {
      console.error('Erro na análise do Discord:', erro);
      return null;
    }
  },

  calcularEngagementX(tweets) {
    if (!tweets || tweets.length === 0) return 0;
    
    const engagement = tweets.reduce((acc, tweet) => {
      return acc + (
        (tweet.public_metrics.like_count * 1) +
        (tweet.public_metrics.retweet_count * 2) +
        (tweet.public_metrics.reply_count * 3)
      );
    }, 0);

    return engagement / tweets.length;
  },

  calcularScore(dados) {
    const pesos = {
      x: 0.4,
      telegram: 0.3,
      discord: 0.3
    };

    let score = 0;

    if (dados.x) {
      score += this.calcularScoreX(dados.x) * pesos.x;
    }
    if (dados.telegram) {
      score += this.calcularScoreTelegram(dados.telegram) * pesos.telegram;
    }
    if (dados.discord) {
      score += this.calcularScoreDiscord(dados.discord) * pesos.discord;
    }

    return Math.min(100, Math.floor(score));
  },

  calcularScoreX(dados) {
    if (!dados) return 0;
    
    let score = 0;
    score += Math.min(40, dados.followers / 1000);
    score += Math.min(20, dados.tweets / 10);
    score += Math.min(20, dados.engagement);
    score += dados.verified ? 20 : 0;
    
    return Math.min(100, score);
  },

  calcularScoreTelegram(dados) {
    if (!dados) return 0;
    
    let score = 0;
    score += Math.min(60, dados.members / 1000);
    score += dados.description ? 20 : 0;
    score += dados.hasUsername ? 20 : 0;
    
    return Math.min(100, score);
  },

  calcularScoreDiscord(dados) {
    if (!dados) return 0;
    
    let score = 0;
    score += Math.min(40, dados.members / 1000);
    score += Math.min(20, dados.online / 100);
    score += Math.min(20, dados.channels / 10);
    score += Math.min(20, dados.boosts / 10);
    
    return Math.min(100, score);
  }
};