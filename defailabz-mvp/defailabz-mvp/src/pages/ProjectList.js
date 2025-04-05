import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Chip,
  Rating 
} from '@mui/material';
import { Rocket, Timeline, Security } from '@mui/icons-material';

// Mock data - substitua por dados reais da sua API
const projects = [
  {
    id: 1,
    name: "CryptoProject X",
    description: "Uma plataforma DeFi revolucionária",
    rating: 4.5,
    riskLevel: "Moderado",
    stage: "IDO",
    aiScore: 85,
  },
  {
    id: 2,
    name: "DeFi Protocol Y",
    description: "Protocolo de empréstimo descentralizado",
    rating: 4.8,
    riskLevel: "Baixo",
    stage: "Presale",
    aiScore: 92,
  },
  // Adicione mais projetos conforme necessário
];

function ProjectList() {
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
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Rocket /> Projetos em Destaque
        </Typography>

        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card sx={{ 
                bgcolor: '#121212', 
                color: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  transition: 'transform 0.3s ease-in-out'
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" sx={{ color: '#00F5FF', mb: 2 }}>
                    {project.name}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Timeline sx={{ color: '#00F5FF' }} />
                    <Typography variant="body2">
                      Estágio: {project.stage}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Security sx={{ color: '#00F5FF' }} />
                    <Typography variant="body2">
                      Nível de Risco: {project.riskLevel}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography component="legend" sx={{ color: '#888' }}>
                      Avaliação da Comunidade
                    </Typography>
                    <Rating value={project.rating} precision={0.5} readOnly />
                  </Box>

                  <Chip 
                    label={`Score IA: ${project.aiScore}%`}
                    sx={{ 
                      bgcolor: '#00F5FF',
                      color: 'black',
                      fontWeight: 'bold'
                    }}
                  />
                </CardContent>
                
                <CardActions sx={{ p: 2 }}>
                  <Button 
                    fullWidth 
                    variant="contained"
                    sx={{
                      bgcolor: '#00F5FF',
                      color: 'black',
                      '&:hover': {
                        bgcolor: '#00D5DD'
                      }
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ProjectList;