import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.REACT_APP_TELEGRAM_BOT_TOKEN, { polling: false });

export const telegramService = {
  async getGroupInfo(username) {
    try {
      const chatInfo = await bot.getChat(username);
      return {
        membros: chatInfo.member_count || 0,
        titulo: chatInfo.title,
        descricao: chatInfo.description,
        tipo: chatInfo.type,
        username: chatInfo.username
      };
    } catch (erro) {
      console.error('Erro ao obter informações do grupo:', erro);
      return null;
    }
  }
};