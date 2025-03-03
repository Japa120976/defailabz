import React from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Tab, Tabs } from '@mui/material';
import ProjectList from '../components/ProjectList';

function Dashboard() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Projetos Ativos" />
          <Tab label="Meus Investimentos" />
          <Tab label="Análise IA" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Projetos em Destaque
          </Typography>
          <ProjectList />
        </>
      )}

      {tabValue === 1 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Seu Perfil
                </Typography>
                <Typography variant="body1">
                  Tokens em Staking: 1000 DFAI
                </Typography>
                <Typography variant="body1">
                  Nível: Ouro
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ranking: Top 100
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Dashboard;