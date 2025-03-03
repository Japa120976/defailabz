import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Button
} from '@mui/material';
import { projectService } from '../services/projectService';

function AdminDashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Carrega todos os projetos quando a página abre
    const allProjects = projectService.getSubmissions();
    setProjects(allProjects);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container>
        <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
          Dashboard de Projetos
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome do Projeto</TableCell>
                <TableCell>Data de Submissão</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score de Risco</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Detalhes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>
                    {new Date(project.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={project.status} 
                      color={project.status === 'APPROVED' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${project.riskAnalysis.score}%`}
                      color={
                        project.riskAnalysis.score >= 70 ? 'success' :
                        project.riskAnalysis.score >= 50 ? 'warning' : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      href={project.website}
                      target="_blank"
                      variant="outlined"
                      size="small"
                    >
                      Visitar
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained"
                      size="small"
                      onClick={() => {
                        // Aqui você pode adicionar um modal com mais detalhes
                        console.log('Detalhes do projeto:', project);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default AdminDashboard;