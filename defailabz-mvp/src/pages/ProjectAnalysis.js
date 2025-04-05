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
import { accessService } from '../services/accessService';

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
      // Validar URL primeiro
      await accessService.validateProject(url);
      
      // Extrair informações da URL
      const projectName = accessService.extractProjectInfo(url);

      const result = await aiService.analyzeProject(projectName);
      
      if (!result || !result.projectName) {
        throw new Error('Não foi possível analisar o projeto. Verifique a URL.');
      }

      setAnalysis(result);
      setTimeout(() => setShowResults(true), 500);
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message || 'Erro ao analisar o projeto');
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
              placeholder="Digite a URL do projeto (GitHub, Etherscan ou Telegram)"
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

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                bgcolor: 'rgba(255,0,0,0.1)',
                color: '#ff8080'
              }}
            >
              {error}
            </Alert>
          )}
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
                        sx={{ color: '#00F5FF' }}
                      />
                      <Typography variant="h3" sx={{ color: '#00F5FF' }}>
                        {calculateOverallScore(analysis)}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#888', mt: 1 }}>
                      Baseado em análise técnica, riscos e pontos positivos
                    </Typography>
                  </Box>

                  <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, bgcolor: '#222', height: '100%' }}>
                        <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
                          Pontos Positivos
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {analysis.positivePoints.map((point, index) => (
                            <Chip 
                              key={index}
                              label={point}
                              sx={{ 
                                bgcolor: 'rgba(0,245,255,0.1)',
                                color: '#00F5FF',
                                '& .MuiChip-label': { px: 2 }
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, bgcolor: '#222', height: '100%' }}>
                        <Typography variant="h6" sx={{ color: '#ff8080', mb: 2 }}>
                          Pontos de Atenção
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {analysis.redFlags.map((flag, index) => (
                            <Chip 
                              key={index}
                              label={flag}
                              sx={{ 
                                bgcolor: 'rgba(255,0,0,0.1)',
                                color: '#ff8080',
                                '& .MuiChip-label': { px: 2 }
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper sx={{ p: 3, bgcolor: '#222' }}>
                        <Typography variant="h6" sx={{ color: '#00F5FF', mb: 3 }}>
                          Análise Técnica
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="body1" sx={{ color: '#888', mb: 1 }}>
                                Qualidade do Código
                              </Typography>
                              <Rating 
                                value={analysis.technicalAnalysis.codeQuality / 2}
                                precision={0.5}
                                readOnly
                                sx={{ color: '#00F5FF' }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="body1" sx={{ color: '#888', mb: 1 }}>
                                Segurança do Contrato
                              </Typography>
                              <Rating 
                                value={analysis.technicalAnalysis.smartContractSecurity / 2}
                                precision={0.5}
                                readOnly
                                sx={{ color: '#00F5FF' }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="body1" sx={{ color: '#888', mb: 1 }}>
                                Descentralização
                              </Typography>
                              <Rating 
                                value={analysis.technicalAnalysis.decentralization / 2}
                                precision={0.5}
                                readOnly
                                sx={{ color: '#00F5FF' }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, bgcolor: '#222', height: '100%' }}>
                        <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
                          Tokenomics
                        </Typography>
                        {Object.entries(analysis.tokenomics).map(([key, value]) => (
                          <Box key={key} sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                              {value}
                            </Typography>
                          </Box>
                        ))}
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, bgcolor: '#222', height: '100%' }}>
                        <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
                          Métricas da Comunidade
                        </Typography>
                        {Object.entries(analysis.communityMetrics).map(([key, value]) => (
                          <Box key={key} sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                              {value}
                            </Typography>
                          </Box>
                        ))}
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper sx={{ p: 3, bgcolor: '#222' }}>
                        <Typography variant="h6" sx={{ color: '#00F5FF', mb: 2 }}>
                          Auditoria de Segurança
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                          Status: {analysis.securityAudit.auditStatus}
                        </Typography>
                        {analysis.securityAudit.vulnerabilities.length > 0 && (
                          <>
                            <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                              Vulnerabilidades Encontradas:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                              {analysis.securityAudit.vulnerabilities.map((vuln, index) => (
                                <Chip 
                                  key={index}
                                  label={vuln}
                                  sx={{ 
                                    bgcolor: 'rgba(255,0,0,0.1)',
                                    color: '#ff8080'
                                  }}
                                />
                              ))}
                            </Box>
                          </>
                        )}
                        {analysis.securityAudit.recommendations.length > 0 && (
                          <>
                            <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                              Recomendações:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {analysis.securityAudit.recommendations.map((rec, index) => (
                                <Chip 
                                  key={index}
                                  label={rec}
                                  sx={{ 
                                    bgcolor: 'rgba(0,245,255,0.1)',
                                    color: '#00F5FF'
                                  }}
                                />
                              ))}
                            </Box>
                          </>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grow>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}

export default ProjectAnalysis;