import { ethers } from 'ethers';

export const smartContractAnalyzer = {
  async analisarContrato(endereco) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ETH_NODE);
    
    try {
      const codigo = await provider.getCode(endereco);
      const saldo = await provider.getBalance(endereco);
      
      const analise = {
        endereco,
        verificado: codigo !== '0x',
        saldo: ethers.utils.formatEther(saldo),
        vulnerabilidades: await this.verificarVulnerabilidades(codigo),
        metricas: await this.analisarMetricas(endereco),
        score: 0
      };

      analise.score = this.calcularPontuacao(analise);
      return analise;
    } catch (erro) {
      console.error('Erro na análise do contrato:', erro);
      return {
        endereco,
        erro: erro.message,
        score: 0
      };
    }
  },

  async verificarVulnerabilidades(codigo) {
    const vulnerabilidades = [];
    
    const padroes = {
      reentrancia: /call\.value/,
      overflow: /SafeMath/,
      txOrigin: /tx\.origin/,
      assemblyDelegateCall: /delegatecall/,
      unsafeTransfer: /transfer\(/
    };

    Object.entries(padroes).forEach(([tipo, padrao]) => {
      if (padrao.test(codigo)) {
        vulnerabilidades.push({
          tipo,
          severidade: this.determinarSeveridade(tipo),
          descricao: this.getDescricaoVulnerabilidade(tipo)
        });
      }
    });

    return vulnerabilidades;
  },

  async analisarMetricas(endereco) {
    return {
      transacoes: await this.contarTransacoes(endereco),
      holders: await this.contarHolders(endereco),
      liquidez: await this.analisarLiquidez(endereco)
    };
  },

  determinarSeveridade(tipo) {
    const severidades = {
      reentrancia: 'Alta',
      overflow: 'Média',
      txOrigin: 'Alta',
      assemblyDelegateCall: 'Alta',
      unsafeTransfer: 'Média'
    };
    return severidades[tipo] || 'Baixa';
  },

  getDescricaoVulnerabilidade(tipo) {
    const descricoes = {
      reentrancia: 'Vulnerabilidade de reentrância detectada',
      overflow: 'Possível vulnerabilidade de overflow',
      txOrigin: 'Uso inseguro de tx.origin',
      assemblyDelegateCall: 'Uso perigoso de delegatecall',
      unsafeTransfer: 'Transferência potencialmente insegura'
    };
    return descricoes[tipo] || 'Vulnerabilidade detectada';
  },

  calcularPontuacao(analise) {
    let pontuacao = 100;
    
    // Deduz pontos por vulnerabilidades
    analise.vulnerabilidades.forEach(v => {
      if (v.severidade === 'Alta') pontuacao -= 20;
      if (v.severidade === 'Média') pontuacao -= 10;
      if (v.severidade === 'Baixa') pontuacao -= 5;
    });

    return Math.max(0, pontuacao);
  }
};