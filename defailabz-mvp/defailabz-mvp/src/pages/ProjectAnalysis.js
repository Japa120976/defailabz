import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  Fade,
  Rating,
  Grow,
  Chip,
  Grid
} from '@mui/material';
import { Assessment } from '@mui/icons-material';
import aiService from '../services/aiService';

function ProjectAnalysis() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateOverallScore = (analysis) => {
    if (!analysis) return 0;
    
    const riskScoreInverted = (100 - analysis.riskScore) / 20;
    
    const technicalAverage = (
      analysis.technicalAnalysis.codeQuality +
      analysis.technicalAnalysis.smartContractSecurity +
      analysis.technicalAnalysis.decentralization
    ) / 3;

    const weights = {
      risk: 0.5,
      technical: 0.3,
      positives: 0.2
    };

    const positivesScore = Math.min(10, analysis.positivePoints.length * 1.5);

    const finalScore = (
      (riskScoreInverted * weights.risk) +
      (technicalAverage * weights.technical) +
      (positivesScore * weights.positives)
    );

    return Math.min(7.5, Math.round(finalScore * 10) / 10);
  };

  const analyzeProject = async () => {
    if (!url) {
      setError('Por favor, insira a URL do projeto');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);
    setShowResults(false);
    
    try {
      const result = await aiService.analyzeProject(url);
      setAnalysis(result);
      setTimeout(() => setShowResults(true), 500);
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#0A0A0A',
      color: 'white',
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="lg">
        <Fade in={true} timeout={1000}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 4, 
              color: '#00F5FF',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Assessment /> Análise de Projetos 
          </Typography>
        </Fade>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: '#1A1A1A',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Digite a URL do projeto (ex: https://projeto.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#00F5FF' },
                  '&.Mui-focused fieldset': { borderColor: '#00F5FF' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={analyzeProject}
              disabled={loading}
              sx={{
                bgcolor: '#00F5FF',
                color: 'black',
                '&:hover': { bgcolor: '#00D5DD' },
                px: 4,
                fontWeight: 'bold'
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Analisar'}
            </Button>
          </Box>
        </Paper>

        {loading && (
          <Fade in={loading}>
            <Paper 
              sx={{ 
                p: 4, 
                bgcolor: '#1A1A1A', 
                borderRadius: 2,
                textAlign: 'center',
                mb: 4
              }}
            >
              <CircularProgress 
                size={60} 
                sx={{ 
                  color: '#00F5FF',
                  mb: 3
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#00F5FF',
                  fontWeight: 'bold',
                  mb: 1
                }}
              >
                Analisando Projeto...
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: '#888' }}
              >
                Isso pode levar alguns segundos. Estamos verificando todos os aspectos de segurança.
              </Typography>
            </Paper>
          </Fade>
        )}

        {analysis && showResults && (
          <Fade in={showResults} timeout={1000}>
            <Box>
              <Grow in={showResults} timeout={1500}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    bgcolor: '#1A1A1A', 
                    borderRadius: 2,
                    mb: 3
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#00F5FF', mb: 2 }}>
                      Nota Preliminar do Projeto
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 2 
                    }}>
                      <Rating 
                        value={calculateOverallScore(analysis) / 2}
                        precision={0.5}
                        readOnly
                        size="large"
                        sx={{ 
                          color: '#00F5FF',
                          '& .MuiRating-iconFilled': {
                            fontSize: '3rem'
                          }
                        }}
                      />
                      <Typography variant="h2" sx={{ color: '#00F5FF' }}>
                        {calculateOverallScore(analysis)}/10
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mt: 2, color: '#888' }}>
                      {calculateOverallScore(analysis) >= 6 
                        ? "Indicadores preliminares positivos, mas aguarde a análise completa"
                        : calculateOverallScore(analysis) >= 4
                        ? "Alguns riscos identificados, recomenda-se cautela"
                        : "Riscos significativos detectados, alta cautela recomendada"}
                    </Typography>

                    <Box sx={{ 
                      mt: 4, 
                      p: 3, 
                      bgcolor: '#2A2A2A', 
                      borderRadius: 2,
                      border: '1px solid #333'
                    }}>
                      <Typography variant="h6" sx={{ color: '#FF9800', mb: 2 }}>
                        ⚠️ Aviso Importante
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#CCC', mb: 2 }}>
                        Esta é uma análise preliminar automatizada. A análise completa inclui:
                      </Typography>
                      <Box sx={{ textAlign: 'left', mb: 2 }}>
                        <Typography component="div" sx={{ color: '#CCC' }}>
                          ✓ Auditoria manual do código-fonte
                        </Typography>
                        <Typography component="div" sx={{ color: '#CCC' }}>
                          ✓ Verificação detalhada da equipe
                        </Typography>
                        <Typography component="div" sx={{ color: '#CCC' }}>
                          ✓ Análise profunda da tokenomics
                        </Typography>
                        <Typography component="div" sx={{ color: '#CCC' }}>
                          ✓ Avaliação de segurança completa
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                        Prazo para Análise Completa: 48 horas
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: '#888', mt: 1 }}>
                        * O prazo pode variar dependendo da complexidade do projeto
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      mt: 3, 
                      display: 'flex', 
                      gap: 2, 
                      justifyContent: 'center' 
                    }}>
                      <Chip 
                        label="Análise Preliminar" 
                        sx={{ 
                          bgcolor: '#00F5FF', 
                          color: 'black',
                          fontWeight: 'bold'
                        }} 
                      />
                      <Chip 
                        label="Análise Final Pendente" 
                        sx={{ 
                          bgcolor: '#333',
                          color: '#888'
                        }} 
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grow>

              <Grow in={showResults} timeout={2000}>
                <Paper sx={{ p: 4, bgcolor: '#1A1A1A', borderRadius: 2 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ color: '#00F5FF', mb: 3 }}>
                      Detalhes da Análise Preliminar
                    </Typography>
                  </Box>

                  {/* Seção de Red Flags */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: '#FF4444', mb: 2 }}>
                      ⚠️ Pontos de Atenção
                    </Typography>
                    <Box sx={{ bgcolor: '#2A2A2A', p: 3, borderRadius: 2, border: '1px solid #333' }}>
                      {analysis.redFlags.map((flag, index) => (
                        <Typography key={index} component="div" sx={{ color: '#CCC', mb: 1 }}>
                          • {flag}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  {/* Seção de Pontos Positivos */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: '#44FF44', mb: 2 }}>
                      ✓ Pontos Positivos
                    </Typography>
                    <Box sx={{ bgcolor: '#2A2A2A', p: 3, borderRadius: 2, border: '1px solid #333' }}>
                      {analysis.positivePoints.map((point, index) => (
                        <Typography key={index} component="div" sx={{ color: '#CCC', mb: 1 }}>
                          • {point}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  {/* Análise Técnica */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
                      🔍 Análise Técnica
                    </Typography>
                    <Box sx={{ bgcolor: '#2A2A2A', p: 3, borderRadius: 2, border: '1px solid #333' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography sx={{ color: '#888' }}>Qualidade do Código</Typography>
                          <Rating 
                            value={analysis.technicalAnalysis.codeQuality / 2}
                            readOnly
                            precision={0.5}
                            sx={{ color: '#00F5FF', mt: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography sx={{ color: '#888' }}>Segurança do Contrato</Typography>
                          <Rating 
                            value={analysis.technicalAnalysis.smartContractSecurity / 2}
                            readOnly
                            precision={0.5}
                            sx={{ color: '#00F5FF', mt: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography sx={{ color: '#888' }}>Descentralização</Typography>
                          <Rating 
                            value={analysis.technicalAnalysis.decentralization / 2}
                            readOnly
                            precision={0.5}
                            sx={{ color: '#00F5FF', mt: 1 }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* Tokenomics */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
                      💰 Tokenomics
                    </Typography>
                    <Box sx={{ bgcolor: '#2A2A2A', p: 3, borderRadius: 2, border: '1px solid #333' }}>
                      <Grid container spacing={2}>
                        {Object.entries(analysis.tokenomics).map(([key, value]) => (
                          <Grid item xs={12} md={6} key={key}>
                            <Typography sx={{ color: '#888' }}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography sx={{ color: '#CCC', mt: 1 }}>
                              {value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>

                  {/* Background da Equipe */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
                      👥 Background da Equipe
                    </Typography>
                    <Box sx={{ bgcolor: '#2A2A2A', p: 3, borderRadius: 2, border: '1px solid #333' }}>
                      <Grid container spacing={2}>
                        {Object.entries(analysis.teamBackground).map(([key, value]) => (
                          <Grid item xs={12} md={6} key={key}>
                            <Typography sx={{ color: '#888' }}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography sx={{ color: '#CCC', mt: 1 }}>
                              {Array.isArray(value) ? value.join(', ') : value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>

                  {/* Métricas da Comunidade */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
                      🌐 Métricas da Comunidade
                    </Typography>
                    <Box sx={{ bgcolor: '#2A2A2A', p: 3, borderRadius: 2, border: '1px solid #333' }}>
                      <Grid container spacing={2}>
                        {Object.entries(analysis.communityMetrics).map(([key, value]) => (
                          <Grid item xs={12} md={6} key={key}>
                            <Typography sx={{ color: '#888' }}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography sx={{ color: '#CCC', mt: 1 }}>
                              {value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>

                  {/* Auditoria de Segurança */}
                  <Box>
                    <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
                      🔒 Auditoria de Segurança
                    </Typography>
                    <Box sx={{ bgcolor: '#2A2A2A', p: 3, borderRadius: 2, border: '1px solid #333' }}>
                      <Typography sx={{ color: '#888' }}>Status da Auditoria</Typography>
                      <Typography sx={{ color: '#CCC', mt: 1, mb: 2 }}>
                        {analysis.securityAudit.auditStatus}
                      </Typography>
                      
                      <Typography sx={{ color: '#888' }}>Vulnerabilidades Identificadas</Typography>
                      {analysis.securityAudit.vulnerabilities.map((vuln, index) => (
                        <Typography key={index} sx={{ color: '#CCC', mt: 1 }}>
                          • {vuln}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grow>
            </Box>
          </Fade>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2,
              bgcolor: '#2A1A1A',
              color: '#FF4444'
            }}
          >
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  );
}

export default ProjectAnalysis;