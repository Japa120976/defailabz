import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { format } from 'date-fns';

const OrderHistory = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'filled':
        return 'success';
      case 'canceled':
        return 'error';
      case 'partial':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ 
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2
    }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Order History
      </Typography>

      <TableContainer sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Pair</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {format(new Date(order.timestamp), 'yyyy-MM-dd HH:mm')}
                </TableCell>
                <TableCell>{order.pair}</TableCell>
                <TableCell>
                  <Typography
                    color={order.side === 'buy' ? 'success.main' : 'error.main'}
                  >
                    {order.side.toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                  {order.price.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                  {order.amount.toFixed(4)}
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                  {(order.price * order.amount).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={order.status}
                    size="small"
                    color={getStatusColor(order.status)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderHistory;