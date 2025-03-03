import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { accessService } from '../services/accessService';

const MvpAccess = () => {
  const navigate = useNavigate();
  
  // Estados
  const [mode, setMode] = useState('code');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    telegram: '',
    reason: '',
    experience: '',
    termsAccepted: false
  });

  // Verifica se já está autenticado
  React.useEffect(() => {
    if (localStorage.getItem('mvp_access_token')) {
      navigate('/home');
    }
  }, [navigate]);

  // Handler do formulário de código
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await accessService.validateCode(accessCode);
      localStorage.setItem('mvp_access_token', 'valid');
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // Handler do formulário de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.termsAccepted) {
        throw new Error('Você precisa aceitar os termos');
      }

      await accessService.submitRegistration(formData);
      setSuccess('Registro enviado com sucesso! Em breve você receberá seu código de acesso.');
      setTimeout(() => setMode('code'), 3000);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#111',
      pt: 8,
      pb: 8
    }}>
      <Container maxWidth="md">
        <Paper sx={{ 
          p: 4, 
          bgcolor: 'rgba(26, 26, 26, 0.9)',
          border: '1px solid #333',
          borderRadius: 2
        }}>
          <Typography variant="h4" sx={{ 
            color: '#00F5FF',
            mb: 4,
            textAlign: 'center'
          }}>
            DeFai Labz MVP Access
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {mode === 'code' && (
            <Box>
              <form onSubmit={handleCodeSubmit}>
                <TextField
                  fullWidth
                  label="Código de Acesso"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  sx={{ 
                    mb: 3,
                    '& label': { color: '#666' },
                    '& input': { color: '#fff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00F5FF',
                      },
                    },
                  }}
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: '#00F5FF',
                    color: '#000',
                    mb: 2,
                    '&:hover': {
                      bgcolor: '#00D4FF'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'ACESSAR MVP'}
                </Button>
              </form>
              <Button
                fullWidth
                onClick={() => setMode('register')}
                sx={{ 
                  color: '#666',
                  '&:hover': {
                    color: '#00F5FF'
                  }
                }}
              >
                Solicitar acesso
              </Button>
            </Box>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      email: e.target.value
                    })}
                    sx={{ 
                      '& label': { color: '#666' },
                      '& input': { color: '#fff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#00F5FF' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telegram Username"
                    placeholder="@username"
                    value={formData.telegram}
                    onChange={(e) => setFormData({
                      ...formData,
                      telegram: e.target.value
                    })}
                    sx={{ 
                      '& label': { color: '#666' },
                      '& input': { color: '#fff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#00F5FF' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Por que você quer participar da MVP?"
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({
                      ...formData,
                      reason: e.target.value
                    })}
                    sx={{ 
                      '& label': { color: '#666' },
                      '& textarea': { color: '#fff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#00F5FF' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Qual sua experiência com trading?"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({
                      ...formData,
                      experience: e.target.value
                    })}
                    sx={{ 
                      '& label': { color: '#666' },
                      '& textarea': { color: '#fff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#00F5FF' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData({
                          ...formData,
                          termsAccepted: e.target.checked
                        })}
                        sx={{ 
                          color: '#666',
                          '&.Mui-checked': {
                            color: '#00F5FF'
                          }
                        }}
                      />
                    }
                    label="Aceito os termos e condições"
                    sx={{ color: '#fff' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      bgcolor: '#00F5FF',
                      color: '#000',
                      mb: 2,
                      '&:hover': {
                        bgcolor: '#00D4FF'
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'ENVIAR SOLICITAÇÃO'}
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => setMode('code')}
                    sx={{ 
                      color: '#666',
                      '&:hover': {
                        color: '#00F5FF'
                      }
                    }}
                  >
                    Voltar
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Container>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        message={success}
      />
    </Box>
  );
};

export default MvpAccess;