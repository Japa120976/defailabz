import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isLoggedIn = localStorage.getItem('mvp_access_token');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('mvp_access_token');
    navigate('/mvp-access');
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#111' }}>
      <Toolbar>
        <Box 
          component="img"
          src={logo}
          alt="DeFaiLabz Logo"
          sx={{ 
            height: 40,
            cursor: 'pointer',
            marginRight: 2
          }}
          onClick={() => navigate('/')}
        />
        
        {isLoggedIn && (
          <>
            <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
            <Button color="inherit" onClick={() => navigate('/projects')}>Projetos</Button>
            <Button color="inherit" onClick={() => navigate('/project-analysis')}>Análise de Projetos</Button>
            <Button color="inherit" onClick={() => navigate('/fundamental-analysis')}>Análise Fundamental</Button>
            <Button color="inherit" onClick={() => navigate('/technical-analysis')}>Análise Técnica</Button>
            <Button color="inherit" onClick={() => navigate('/project-ranking')}>Ranking</Button>
            <Button color="inherit" onClick={() => navigate('/submit-project')}>Submeter Projeto</Button>
            <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
            <Button color="inherit" onClick={() => navigate('/dex')}>DEX</Button>
            
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
              sx={{ ml: 2 }}
            >
              <AccountCircleIcon />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  bgcolor: '#1A1A1A',
                  color: '#fff',
                  border: '1px solid #333'
                }
              }}
            >
              <MenuItem onClick={handleLogout} sx={{
                '&:hover': { bgcolor: '#333' }
              }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}

        {!isLoggedIn && (
          <Button 
            color="inherit" 
            onClick={() => navigate('/mvp-access')}
            sx={{
              bgcolor: '#00F5FF',
              color: '#000',
              '&:hover': {
                bgcolor: '#00D4FF'
              }
            }}
          >
            Conectar Carteira
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;