import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, Container } from '@mui/material';
import { accessService } from '../services/accessService';

const MvpAccess = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await accessService.submitRegistration(formData);
      setRegistered(true);
      setShowCodeInput(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await accessService.validateCode(code);
      localStorage.setItem('mvp_access_token', result.accessToken);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Box sx={{ width: '100%', p: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
           Inscreva-se e teste a DefaiLabz MVP
          </Typography>

          {!showCodeInput ? (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                label="Nome Completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                required
                label="Usuário do Telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                placeholder="@seu_usuario"
                sx={{ mb: 2 }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 2,
                  backgroundColor: 'aqua',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: 'darkturquoise'
                  }
                }}
              >
                {loading ? 'Enviando...' : 'Solicitar Acesso'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleCodeSubmit}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Cadastro realizado com sucesso! Em breve receberá em seu e-mail seu código de acesso. 
                </Alert>
              <TextField
                fullWidth
                required
                label="Código de Acesso"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{ mb: 2 }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 2,
                  backgroundColor: 'aqua',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: 'darkturquoise'
                  }
                }}
              >
                {loading ? 'Verificando...' : 'Acessar MVP'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default MvpAccess;
