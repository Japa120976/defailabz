import React from 'react';
import { Container, Box } from '@mui/material';
import FormularioInscricao from '../components/FormularioInscricao';

const PaginaInscricao = () => {
  return (
    <Container>
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <FormularioInscricao />
      </Box>
    </Container>
  );
};

export default PaginaInscricao;