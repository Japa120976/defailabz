import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { accessService } from '../../services/accessService';

function MvpRegister() {
  // ... código existente para os estados ...
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  
  // ... código existente para handleChange ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validações básicas
      if (!formData.email.includes('@')) {
        setError('Email inválido');
        setLoading(false);
        return;
      }

      if (formData.reason && formData.reason.length < 50) {
        setError('Por favor, explique melhor seu interesse (mínimo 50 caracteres)');
        setLoading(false);
        return;
      }

      // Enviar para o backend usando o accessService
      const result = await accessService.submitRegistration(formData);
      
      // Salvar no localStorage para referência
      localStorage.setItem('mvpRegistration', JSON.stringify({
        ...formData,
        date: new Date().toISOString()
      }));

      setSuccess(true);
      setEmailStatus(result.emailSent);
      
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
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Erro ao enviar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      {/* ... código existente ... */}
      
      {success ? (
        <Box sx={{ textAlign: 'center', my: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Cadastro recebido com sucesso!
          </Alert>
          
          {emailStatus === false && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Seu cadastro foi salvo, mas houve um problema ao enviar o email de confirmação.
            </Alert>
          )}
          
          <Typography variant="body1">
            Analisaremos seu cadastro e entraremos em contato em breve.
          </Typography>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* ... campos de formulário existentes ... */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2,
              backgroundColor: '#1a237e',
              '&:hover': {
                backgroundColor: '#0d47a1',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Cadastro'}
          </Button>

          {/* ... resto do código ... */}
        </Box>
      )}
      
      {/* ... código existente ... */}
    </Container>
  );
}

export default MvpRegister;