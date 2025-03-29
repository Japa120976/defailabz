import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, Container, Tabs, Tab } from '@mui/material';
import { accessService } from '../services/accessService';

const MvpAccess = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram: ''
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

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
      // Registra o usuário
      const result = await accessService.submitRegistration(formData);
      
      // Envia email de boas-vindas
      await accessService.sendWelcome(formData.email, formData.name);
      
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
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

  if (submitted) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#111',
        color: '#fff',
        p: 3 
      }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Registro Recebido!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
          Em breve enviaremos seu token de acesso.
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', color: '#00F5FF' }}>
          Fique atento ao seu email e Telegram.
        </Typography>
        <Button 
          onClick={() => setActiveTab(1)}
          variant="outlined"
          sx={{ 
            color: '#00F5FF',
            borderColor: '#00F5FF',
            '&:hover': {
              borderColor: '#00D4FF',
              backgroundColor: 'rgba(0, 245, 255, 0.1)'
            }
          }}
        >
          Já tenho um código
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#111',
        color: '#fff',
        p: 3 
      }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          DeFaiLabz MVP
        </Typography>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ 
            mb: 4,
            '& .MuiTab-root': { color: '#fff' },
            '& .Mui-selected': { color: '#00F5FF' },
            '& .MuiTabs-indicator': { backgroundColor: '#00F5FF' }
          }}
        >
          <Tab label="Novo Registro" />
          <Tab label="Já Tenho Código" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        {activeTab === 0 ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: '#fff' } }}
              InputProps={{ sx: { color: '#fff' } }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: '#fff' } }}
              InputProps={{ sx: { color: '#fff' } }}
            />

            <TextField
              fullWidth
              label="Username Telegram"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputLabelProps={{ sx: { color: '#fff' } }}
              InputProps={{ sx: { color: '#fff' } }}
              helperText="Exemplo: @seuusername"
            />

            <Button 
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#00F5FF',
                color: '#000',
                '&:hover': {
                  bgcolor: '#00D4FF'
                }
              }}
            >
              {loading ? 'Enviando...' : 'Registrar'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Código de Acesso"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputLabelProps={{ sx: { color: '#fff' } }}
              InputProps={{ sx: { color: '#fff' } }}
            />

            <Button 
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#00F5FF',
                color: '#000',
                '&:hover': {
                  bgcolor: '#00D4FF'
                }
              }}
            >
              {loading ? 'Verificando...' : 'Acessar MVP'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MvpAccess;