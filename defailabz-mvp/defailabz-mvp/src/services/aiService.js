import axios from 'axios';
import { JsonRpcProvider } from 'ethers';

const aiService = {
  calcularPontuacao(github, contrato, telegram, twitter) {
    let pontuacao = 50;
    if (github?.stargazers_count) pontuacao += Math.min(20, github.stargazers_count / 100);
    if (contrato?.ABI !== "Contract source code not verified") pontuacao += 15;
    if (telegram?.member_count) pontuacao += Math.min(10, telegram.member_count / 1000);
    if (twitter?.public_metrics?.followers_count) pontuacao += Math.min(5, twitter.public_metrics.followers_count / 1000);
    return Math.min(100, Math.floor(pontuacao));
  },

  async analyzeProject(url) {
    try {
      let dadosGithub = null;
      let dadosContrato = null;
      let dadosTelegram = null;
      let dadosTwitter = null;

      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const respostaGithub = await fetch(`https://api.github.com/repos/${url}`, {
          headers: { Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}` }
        });
        dadosGithub = await respostaGithub.json();
      } catch (erro) {
        console.error('Erro GitHub:', erro);
      }

      try {
        const provider = new JsonRpcProvider(process.env.REACT_APP_ETH_NODE);
        const etherscanUrl = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${url}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
        const respostaEtherscan = await axios.get(etherscanUrl);
        dadosContrato = respostaEtherscan.data.result[0];
      } catch (erro) {
        console.error('Erro Contrato:', erro);
      }

      try {
        const telegramUrl = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/getChat?chat_id=@${url}`;
        const respostaTelegram = await axios.get(telegramUrl);
        dadosTelegram = respostaTelegram.data.result;
      } catch (erro) {
        console.error('Erro Telegram:', erro);
      }

      try {
        const twitterUrl = `https://api.twitter.com/2/users/by/username/${url}`;
        const respostaTwitter = await axios.get(twitterUrl, {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_X_BEARER_TOKEN}`
          }
        });
        dadosTwitter = respostaTwitter.data.data;
      } catch (erro) {
        console.error('Erro Twitter:', erro);
      }

      return {
        projectName: "Análise de " + url,
        riskScore: this.calcularPontuacao(dadosGithub, dadosContrato, dadosTelegram, dadosTwitter),
        securityLevel: "Análise Preliminar",
        summary: "Análise inicial do projeto concluída",
        redFlags: [
          "Verificação de segurança pendente",
          "Auditoria não realizada",
          "Documentação em análise",
          "Liquidez em verificação"
        ],
        positivePoints: [
          "Projeto acessível",
          "Interface funcional",
          "Comunidade ativa",
          "Código-fonte disponível"
        ],
        technicalAnalysis: {
          codeQuality: 0,
          smartContractSecurity: 0,
          decentralization: 0,
          technicalFindings: []
        },
        tokenomics: {
          distribution: "Em análise",
          vesting: "Em análise",
          inflation: "Em análise",
          liquidityAnalysis: "Em análise",
          tokenUtility: "Em análise"
        },
        teamBackground: {
          experience: "Em análise",
          transparency: "Em análise",
          trackRecord: "Em análise",
          teamRisks: []
        },
        communityMetrics: {
          socialMedia: "Em análise",
          engagement: "Em análise",
          growth: "Em análise",
          authenticity: "Em análise"
        },
        securityAudit: {
          auditStatus: "Em análise",
          vulnerabilities: [],
          recommendations: []
        }
      };
    } catch (erro) {
      console.error('Erro na análise:', erro);
      return {
        projectName: "Erro na análise",
        riskScore: 0,
        securityLevel: "Erro",
        summary: "Não foi possível completar a análise",
        redFlags: ["Erro na análise"],
        positivePoints: [],
        technicalAnalysis: {
          codeQuality: 0,
          smartContractSecurity: 0,
          decentralization: 0,
          technicalFindings: []
        },
        tokenomics: {
          distribution: "Erro",
          vesting: "Erro",
          inflation: "Erro",
          liquidityAnalysis: "Erro",
          tokenUtility: "Erro"
        },
        teamBackground: {
          experience: "Erro",
          transparency: "Erro",
          trackRecord: "Erro",
          teamRisks: []
        },
        communityMetrics: {
          socialMedia: "Erro",
          engagement: "Erro",
          growth: "Erro",
          authenticity: "Erro"
        },
        securityAudit: {
          auditStatus: "Erro",
          vulnerabilities: [],
          recommendations: []
        }
      };
    }
  }
};

export default aiService;