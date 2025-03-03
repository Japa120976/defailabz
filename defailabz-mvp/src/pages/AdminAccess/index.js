import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { adminService } from '../../services/adminService';

const AdminAccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Verifica se já está autenticado como admin
  React.useEffect(() => {
    if (localStorage.getItem('admin_token')) {
      navigate('/mvp/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminService.login(formData);
      if (result.success) {
        localStorage.setItem('admin_token', result.token);
        navigate('/mvp/admin/dashboard');
      }
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
      <Container maxWidth="sm">
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
            Admin Access
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({
                ...formData,
                username: e.target.value
              })}
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

            <TextField
              fullWidth
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => setFormData({
                ...formData,
                password: e.target.value
              })}
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
                '&:hover': {
                  bgcolor: '#00D4FF'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'LOGIN'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminAccess;