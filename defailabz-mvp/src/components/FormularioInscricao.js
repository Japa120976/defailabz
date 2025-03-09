import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { accessService } from '../services/accessService';

const FormularioInscricao = () => {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    email: '',
    telegram: ''
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleMudanca = (e) => {
    setDadosFormulario({
      ...dadosFormulario,
      [e.target.name]: e.target.value
    });
  };

  const handleEnvio = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    
    try {
      await accessService.submitRegistration({
        name: dadosFormulario.nome,
        email: dadosFormulario.email,
        telegram: dadosFormulario.telegram
      });
      setSucesso(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  if (sucesso) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Alert severity="success">
          Inscrição realizada com sucesso! Entraremos em contato em breve.
        </Alert>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleEnvio} sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Inscrição para MVP
      </Typography>
      
      <TextField
        fullWidth
        required
        label="Nome Completo"
        name="nome"
        value={dadosFormulario.nome}
        onChange={handleMudanca}
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        required
        label="Email"
        name="email"
        type="email"
        value={dadosFormulario.email}
        onChange={handleMudanca}
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        required
        label="Usuário do Telegram"
        name="telegram"
        value={dadosFormulario.telegram}
        onChange={handleMudanca}
        placeholder="@seu_usuario"
        sx={{ mb: 2 }}
      />
      
      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}
      
      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={carregando}
      >
        {carregando ? 'Enviando...' : 'Enviar Inscrição'}
      </Button>
    </Box>
  );
};

export default FormularioInscricao;