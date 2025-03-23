import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url('/matrix-trading.gif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        pt: 8
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            background: 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #333'
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#00F5FF',
              mb: 3,
              textAlign: 'center',
              textShadow: '0 0 10px rgba(0, 245, 255, 0.5)'
            }}
          >
            Bem-vindo ao DeFaiLabz MVP
          </Typography>

          <Typography 
            variant="h5" 
            sx={{ 
              color: '#FFF',
              mb: 4,
              textAlign: 'center'
            }}
          >
            Você está entre os primeiros a testar nossa plataforma de análises e trading com IA
          </Typography>

          <Typography 
            sx={{ 
              color: '#CCC',
              mb: 3,
              textAlign: 'center'
            }}
          >
            Participe do nosso torneio de 24h e concorra a tokens $DEFAI!
          </Typography>

          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4 
            }}
          >
            <Button 
              variant="contained"
              size="large"
              onClick={() => navigate('/dex')}
              sx={{
                bgcolor: '#00F5FF',
                color: '#000',
                '&:hover': {
                  bgcolor: '#00D4FF'
                }
              }}
            >
              Começar a Trading
            </Button>

            <Button 
              variant="outlined"
              size="large"
              onClick={() => navigate('/technical-analysis')}
              sx={{
                color: '#00F5FF',
                borderColor: '#00F5FF',
                '&:hover': {
                  borderColor: '#00D4FF'
                }
              }}
            >
              Ver Análises
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home;