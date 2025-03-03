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
  Box
} from '@mui/material';
import { format } from 'date-fns';

const RecentTrades = ({ trades }) => {
  return (
    <Paper sx={{ 
      bgcolor: 'background.paper',
      borderRadius: 2,
      height: '100%'
    }}>
      <Typography variant="subtitle2" sx={{ p: 1, bgcolor: 'background.default' }}>
        Recent Trades
      </Typography>
      
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Price</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade, index) => (
              <TableRow key={index}>
                <TableCell 
                  sx={{ 
                    color: trade.side === 'buy' ? 'success.main' : 'error.main',
                    fontFamily: 'monospace'
                  }}
                >
                  {trade.price.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                  {trade.amount.toFixed(4)}
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                  {format(trade.timestamp, 'HH:mm:ss')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentTrades;