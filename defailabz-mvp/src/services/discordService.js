import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

export const discordService = {
  async getServerInfo(serverId) {
    try {
      await client.login(process.env.REACT_APP_DISCORD_BOT_TOKEN);
      const guild = await client.guilds.fetch(serverId);
      const members = await guild.members.fetch();

      return {
        name: guild.name,
        memberCount: guild.memberCount,
        onlineMembers: members.filter(m => m.presence?.status === 'online').size,
        channels: guild.channels.cache.size,
        roles: guild.roles.cache.size,
        boostLevel: guild.premiumTier,
        boostCount: guild.premiumSubscriptionCount,
        createdAt: guild.createdAt
      };
    } catch (error) {
      console.error('Erro ao obter informações do servidor:', error);
      return null;
    } finally {
      client.destroy();
    }
  }
};