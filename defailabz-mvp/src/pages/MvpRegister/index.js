import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Link,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MvpRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validações básicas
      if (!formData.email.includes('@')) {
        setError('Email inválido');
        return;
      }

      if (formData.reason.length < 50) {
        setError('Por favor, explique melhor seu interesse (mínimo 50 caracteres)');
        return;
      }

      // Salvar no localStorage para referência
      localStorage.setItem('mvpRegistration', JSON.stringify({
        ...formData,
        date: new Date().toISOString()
      }));

      setSuccess(true);
      setError('');

      // Limpar o formulário
      setFormData({
        name: '',
        email: '',
        telegram: '',
        reason: ''
      });

      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate('/mvp');
      }, 3000);

    } catch (err) {
      setError('Erro ao enviar o cadastro. Tente novamente.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, marginBottom: 8 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Cadastro MVP Defailabz
          </Typography>

          {success ? (
            <Box sx={{ textAlign: 'center', my: 3 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Cadastro recebido com sucesso!
              </Alert>
              <Typography variant="body1">
                Analisaremos seu cadastro e entraremos em contato em breve.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nome Completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Por que você quer participar do MVP?"
                name="reason"
                multiline
                rows={4}
                value={formData.reason}
                onChange={handleChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  backgroundColor: '#1a237e',
                  '&:hover': {
                    backgroundColor: '#0d47a1',
                  }
                }}
              >
                Enviar Cadastro
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link href="/mvp" variant="body2">
                  Já tem um código de acesso? Faça login
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default MvpRegister;