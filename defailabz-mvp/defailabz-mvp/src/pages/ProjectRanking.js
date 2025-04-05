import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  TrendingUp,
  Info,
  Warning
} from '@mui/icons-material';

// Dados mockados para teste (substitua pela sua API real posteriormente)
const mockProjects = [
  {
    id: 1,
    name: "Project Alpha",
    symbol: "ALPHA",
    logo: "https://via.placeholder.com/32",
    metrics: {
      devScore: 85,
      communityScore: 78,
      securityScore: 92,
      tokenomicsScore: 88,
      liquidityScore: 90,
      technicalScore: 82
    }
  },
  {
    id: 2,
    name: "Project Beta",
    symbol: "BETA",
    logo: "https://via.placeholder.com/32",
    metrics: {
      devScore: 75,
      communityScore: 82,
      securityScore: 85,
      tokenomicsScore: 78,
      liquidityScore: 80,
      technicalScore: 77
    }
  },
  // Adicione mais projetos conforme necessário
];

function ProjectRanking() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const calculateRiskScore = (project) => {
    const {
      technicalScore,
      devScore,
      communityScore,
      liquidityScore,
      securityScore,
      tokenomicsScore
    } = project.metrics;

    const weights = {
      technical: 0.15,
      dev: 0.20,
      community: 0.15,
      liquidity: 0.20,
      security: 0.20,
      tokenomics: 0.10
    };

    return (
      (technicalScore * weights.technical) +
      (devScore * weights.dev) +
      (communityScore * weights.community) +
      (liquidityScore * weights.liquidity) +
      (securityScore * weights.security) +
      (tokenomicsScore * weights.tokenomics)
    ).toFixed(2);
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'BAIXO', color: 'success' };
    if (score >= 60) return { level: 'MODERADO', color: 'warning' };
    return { level: 'ALTO', color: 'error' };
  };

  useEffect(() => {
    // Simulando chamada à API
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Usando dados mockados por enquanto
        const rankedProjects = mockProjects.map(project => ({
          ...project,
          riskScore: calculateRiskScore(project)
        })).sort((a, b) => b.riskScore - a.riskScore);

        setProjects(rankedProjects);
      } catch (err) {
        setError('Erro ao carregar projetos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      bgcolor: 'background.default',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            color: 'primary.main',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <TrendingUp /> Ranking de Projetos IDO
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ranking</TableCell>
                  <TableCell>Projeto</TableCell>
                  <TableCell align="center">Score de Risco</TableCell>
                  <TableCell align="center">Nível de Risco</TableCell>
                  <TableCell align="center">Desenvolvimento</TableCell>
                  <TableCell align="center">Comunidade</TableCell>
                  <TableCell align="center">Segurança</TableCell>
                  <TableCell align="center">Tokenomics</TableCell>
                  <TableCell align="center">Detalhes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project, index) => {
                  const riskLevel = getRiskLevel(project.riskScore);
                  return (
                    <TableRow 
                      key={project.id}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'action.hover' 
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                          #{index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <img 
                            src={project.logo} 
                            alt={project.name}
                            style={{ width: 32, height: 32, borderRadius: '50%' }}
                          />
                          <Box>
                            <Typography variant="subtitle1">
                              {project.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {project.symbol}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <CircularProgress
                            variant="determinate"
                            value={project.riskScore}
                            sx={{ color: riskLevel.color + '.main' }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              color: riskLevel.color + '.main'
                            }}
                          >
                            {project.riskScore}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={riskLevel.level}
                          color={riskLevel.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {project.metrics.devScore}%
                      </TableCell>
                      <TableCell align="center">
                        {project.metrics.communityScore}%
                      </TableCell>
                      <TableCell align="center">
                        {project.metrics.securityScore}%
                      </TableCell>
                      <TableCell align="center">
                        {project.metrics.tokenomicsScore}%
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver Análise Detalhada">
                          <IconButton 
                            color="primary"
                            onClick={() => window.location.href = `/project-analysis/${project.id}`}
                          >
                            <Info />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Paper sx={{ p: 3, mt: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" /> Aviso sobre Riscos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Este ranking é baseado em análise automatizada de diversos fatores de risco, incluindo
            desenvolvimento técnico, comunidade, liquidez, segurança e tokenomics. No entanto,
            investimentos em IDOs são considerados de alto risco. Sempre faça sua própria pesquisa
            (DYOR) antes de investir.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProjectRanking;