import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

function ProjectAnalysis() {
  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      background: 'black',
      color: 'white',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            color: '#00F5FF',
            mb: 4
          }}
        >
          Análise de Projetos com IA
        </Typography>
        <Paper sx={{ 
          p: 4, 
          bgcolor: '#121212',
          color: 'white'
        }}>
          {/* Adicione o conteúdo da análise de projetos aqui */}
          <Typography variant="body1">
            Conteúdo da análise de projetos será implementado aqui.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProjectAnalysis;