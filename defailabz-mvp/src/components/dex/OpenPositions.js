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
  IconButton,
  Tooltip
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';

function OpenPositions({ positions = [], onClose, onEdit }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString();
  };

  const formatPrice = (price) => {
    return price ? Number(price).toFixed(2) : '0.00';
  };

  const formatAmount = (amount) => {
    return amount ? Number(amount).toFixed(4) : '0.0000';
  };

  const getStatusColor = (status) => {
    if (!status) return '#666';
    switch (status.toUpperCase()) {
      case 'OPEN': return '#44ff44';
      case 'PARTIAL': return '#ffff44';
      case 'CLOSED': return '#ff4444';
      default: return '#666';
    }
  };

  return (
    <Paper sx={{ p: 2, bgcolor: 'rgba(26, 26, 26, 0.9)' }}>
      <Typography variant="h6" gutterBottom>
        Posições Abertas
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Par</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell align="right">Quantidade</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position?.id || Math.random()}>
                <TableCell>{formatDate(position?.timestamp)}</TableCell>
                <TableCell>{position?.symbol || '-'}</TableCell>
                <TableCell sx={{
                  color: position?.type?.toUpperCase() === 'BUY' ? '#44ff44' : '#ff4444'
                }}>
                  {position?.type || '-'}
                </TableCell>
                <TableCell align="right">{formatPrice(position?.price)}</TableCell>
                <TableCell align="right">{formatAmount(position?.amount)}</TableCell>
                <TableCell align="right">
                  {formatPrice(position?.price * position?.amount)}
                </TableCell>
                <TableCell sx={{ color: getStatusColor(position?.status) }}>
                  {position?.status || '-'}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar ordem">
                    <IconButton 
                      size="small" 
                      onClick={() => onEdit(position?.id)}
                      sx={{ color: '#ffffff' }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancelar ordem">
                    <IconButton 
                      size="small" 
                      onClick={() => onClose(position?.id)}
                      sx={{ color: '#ff4444' }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {positions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Nenhuma posição aberta
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default OpenPositions;