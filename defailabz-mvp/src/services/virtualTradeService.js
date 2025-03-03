class VirtualTradeService {
  constructor() {
    this.orders = [];
    this.trades = {};
    this.orderBooks = {};
    this.loadData();
  }

  loadData() {
    try {
      const savedData = localStorage.getItem('virtualTradeData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.orders = data.orders || [];
        this.trades = data.trades || {};
        this.orderBooks = data.orderBooks || {};
      }
    } catch (error) {
      console.error('Erro ao carregar dados de trading:', error);
      this.resetData();
    }
  }

  saveData() {
    try {
      localStorage.setItem('virtualTradeData', JSON.stringify({
        orders: this.orders,
        trades: this.trades,
        orderBooks: this.orderBooks
      }));
    } catch (error) {
      console.error('Erro ao salvar dados de trading:', error);
    }
  }

  resetData() {
    this.orders = [];
    this.trades = {};
    this.orderBooks = {};
    this.saveData();
  }

  addOrder(order) {
    const newOrder = {
      id: Date.now().toString(),
      ...order,
      status: order.status || 'pending'
    };
    
    this.orders.push(newOrder);
    this.updateOrderBook(order.symbol);
    this.saveData();
    
    return newOrder;
  }

  cancelOrder(orderId, userId) {
    const orderIndex = this.orders.findIndex(o => o.id === orderId && o.buyerId === userId);
    if (orderIndex >= 0) {
      this.orders[orderIndex].status = 'cancelled';
      this.updateOrderBook(this.orders[orderIndex].symbol);
      this.saveData();
      return true;
    }
    return false;
  }

  getUserOrders(userId) {
    return this.orders.filter(o => o.buyerId === userId && o.status !== 'cancelled');
  }

  getOrderBook(symbol) {
    if (!this.orderBooks[symbol]) {
      this.updateOrderBook(symbol);
    }
    return this.orderBooks[symbol];
  }

  updateOrderBook(symbol) {
    const activeOrders = this.orders.filter(o => 
      o.symbol === symbol && 
      o.status === 'pending'
    );

    const bids = activeOrders
      .filter(o => o.type === 'buy')
      .sort((a, b) => b.price - a.price);

    const asks = activeOrders
      .filter(o => o.type === 'sell')
      .sort((a, b) => a.price - b.price);

    this.orderBooks[symbol] = { bids, asks };
    this.saveData();
  }

  getRecentTrades(symbol) {
    if (!this.trades[symbol]) {
      this.trades[symbol] = [];
    }
    return this.trades[symbol].slice(-50);
  }

  addTrade(trade) {
    if (!this.trades[trade.symbol]) {
      this.trades[trade.symbol] = [];
    }
    
    this.trades[trade.symbol].push({
      id: Date.now().toString(),
      ...trade,
      timestamp: Date.now()
    });

    while (this.trades[trade.symbol].length > 100) {
      this.trades[trade.symbol].shift();
    }

    this.saveData();
  }
}

export const virtualTradeService = new VirtualTradeService();