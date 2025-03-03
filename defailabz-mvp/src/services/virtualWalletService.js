class VirtualWalletService {
  constructor() {
    // Inicializa a carteira ao criar o serviço
    this.initializeWallet();
  }

  // Método para inicializar a carteira
  initializeWallet() {
    const savedWallet = localStorage.getItem('virtualWallet');
    
    if (savedWallet) {
      this.wallet = JSON.parse(savedWallet);
    } else {
      // Carteira inicial com saldos
      this.wallet = {
        userId: 'user1',
        USDT: 100000.00,
        BTC: 5.0,
        ETH: 50.0,
        BNB: 100.0,
        SOL: 1000.0,
        XRP: 50000.0,
        ADA: 100000.0,
        AVAX: 1000.0,
        DOGE: 100000.0
      };
      this.saveWallet();
    }
  }

  // Salva a carteira no localStorage
  saveWallet() {
    localStorage.setItem('virtualWallet', JSON.stringify(this.wallet));
  }

  // Obtém a carteira atual
  getWallet() {
    return {...this.wallet};
  }

  // Executa uma operação de trade
  async handleTrade(order) {
    const [baseAsset, quoteAsset] = order.symbol.split('/');
    const total = order.amount * order.price;
    const fee = total * 0.001; // Taxa de 0.1%

    // Verifica saldo antes da operação
    if (order.type === 'buy') {
      // Comprando: precisa ter USDT suficiente
      if (this.wallet[quoteAsset] < (total + fee)) {
        throw new Error(`Saldo insuficiente de ${quoteAsset}`);
      }

      // Atualiza os saldos
      this.wallet[quoteAsset] -= (total + fee);
      this.wallet[baseAsset] = (this.wallet[baseAsset] || 0) + order.amount;

    } else {
      // Vendendo: precisa ter a moeda suficiente
      if (this.wallet[baseAsset] < order.amount) {
        throw new Error(`Saldo insuficiente de ${baseAsset}`);
      }

      // Atualiza os saldos
      this.wallet[baseAsset] -= order.amount;
      this.wallet[quoteAsset] += (total - fee);
    }

    // Salva as alterações
    this.saveWallet();
    
    // Retorna a carteira atualizada
    return this.getWallet();
  }

  // Reseta a carteira para os valores iniciais (útil para testes)
  resetWallet() {
    this.wallet = {
      userId: 'user1',
      USDT: 100000.00,
      BTC: 5.0,
      ETH: 50.0,
      BNB: 100.0,
      SOL: 1000.0,
      XRP: 50000.0,
      ADA: 100000.0,
      AVAX: 1000.0,
      DOGE: 100000.0
    };
    this.saveWallet();
    return this.getWallet();
  }
}

export const virtualWalletService = new VirtualWalletService();