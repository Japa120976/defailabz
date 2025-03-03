import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function OrderBook({ orders = { bids: [], asks: [] }, currentPrice = 0 }) {
  // Garantir que orders tenha a estrutura correta mesmo se undefined
  const bids = orders?.bids || [];
  const asks = orders?.asks || [];

  const formatPrice = (price) => {
    return price ? Number(price).toFixed(2) : '0.00';
  };

  const formatAmount = (amount) => {
    return amount ? Number(amount).toFixed(4) : '0.0000';
  };

  return (
    <Paper sx={{ p: 2, bgcolor: 'rgba(26, 26, 26, 0.9)' }}>
      <Typography variant="h6" gutterBottom>
        Livro de Ofertas
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Preço (USDT)</TableCell>
              <TableCell align="right">Quantidade</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Ofertas de venda (asks) em vermelho */}
            {asks.slice(0, 5).map((order, index) => (
              <TableRow key={`ask-${index}`}>
                <TableCell sx={{ color: '#ff4444' }}>
                  {formatPrice(order?.price)}
                </TableCell>
                <TableCell align="right">
                  {formatAmount(order?.amount)}
                </TableCell>
                <TableCell align="right">
                  {formatPrice(order?.price * order?.amount)}
                </TableCell>
              </TableRow>
            ))}

            {/* Preço atual */}
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ borderBottom: '2px solid #666' }}>
                <Typography variant="body1" color="primary">
                  {formatPrice(currentPrice)} USDT
                </Typography>
              </TableCell>
            </TableRow>

            {/* Ofertas de compra (bids) em verde */}
            {bids.slice(0, 5).map((order, index) => (
              <TableRow key={`bid-${index}`}>
                <TableCell sx={{ color: '#44ff44' }}>
                  {formatPrice(order?.price)}
                </TableCell>
                <TableCell align="right">
                  {formatAmount(order?.amount)}
                </TableCell>
                <TableCell align="right">
                  {formatPrice(order?.price * order?.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default OrderBook;