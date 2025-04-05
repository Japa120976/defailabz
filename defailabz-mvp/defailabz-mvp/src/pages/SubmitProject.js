import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Input,
  FormHelperText,
  Link
} from '@mui/material';
import {
  CloudUpload,
  Security,
  Assessment,
  CheckCircle
} from '@mui/icons-material';

const steps = [
  'Informações Básicas',
  'Detalhes Técnicos',
  'Documentação',
  'Verificação'
];

function SubmitProject() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Informações Básicas
    projectName: '',
    symbol: '',
    website: '',
    whitepaper: '',
    description: '',
    category: '',
    stage: '',
    
    // Detalhes Técnicos
    blockchain: '',
    smartContractAddress: '',
    githubRepository: '',
    tokenomics: {
      totalSupply: '',
      initialPrice: '',
      vestingSchedule: '',
      tokenDistribution: ''
    },
    
    // Documentação
    team: [{
      name: '',
      role: '',
      linkedin: '',
      experience: ''
    }],
    kyc: false,
    audit: false,
    auditReport: '',
    legalDocuments: [],
    
    // Verificação
    walletAddress: '',
    email: '',
    telegram: '',
    discord: ''
  });

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await submitProject();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitProject = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Aqui você implementará a lógica de submissão
      // 1. Validar todos os dados
      // 2. Enviar para análise da IA
      // 3. Armazenar no banco de dados
      // 4. Retornar resultado

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação
      
      // Redirecionar para página de sucesso ou mostrar mensagem
    } catch (err) {
      setError('Erro ao submeter projeto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Nome do Projeto"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                helperText="Nome oficial do seu projeto"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Símbolo do Token"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <MenuItem value="defi">DeFi</MenuItem>
                  <MenuItem value="nft">NFT</MenuItem>
                  <MenuItem value="gaming">Gaming</MenuItem>
                  <MenuItem value="infrastructure">Infraestrutura</MenuItem>
                  <MenuItem value="dao">DAO</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                type="url"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Whitepaper"
                value={formData.whitepaper}
                onChange={(e) => handleInputChange('whitepaper', e.target.value)}
                type="url"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Descrição"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={4}
                helperText="Descreva seu projeto em detalhes (mín. 200 caracteres)"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Blockchain</InputLabel>
                <Select
                  value={formData.blockchain}
                  onChange={(e) => handleInputChange('blockchain', e.target.value)}
                >
                  <MenuItem value="ethereum">Ethereum</MenuItem>
                  <MenuItem value="bsc">BSC</MenuItem>
                  <MenuItem value="polygon">Polygon</MenuItem>
                  <MenuItem value="solana">Solana</MenuItem>
                  <MenuItem value="avalanche">Avalanche</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Smart Contract Address"
                value={formData.smartContractAddress}
                onChange={(e) => handleInputChange('smartContractAddress', e.target.value)}
                helperText="Endereço do contrato principal verificado"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="GitHub Repository"
                value={formData.githubRepository}
                onChange={(e) => handleInputChange('githubRepository', e.target.value)}
                type="url"
                helperText="Link para o repositório público do projeto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Tokenomics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Supply Total"
                    value={formData.tokenomics.totalSupply}
                    onChange={(e) => handleInputChange('tokenomics', {
                      ...formData.tokenomics,
                      totalSupply: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Preço Inicial"
                    value={formData.tokenomics.initialPrice}
                    onChange={(e) => handleInputChange('tokenomics', {
                      ...formData.tokenomics,
                      initialPrice: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Distribuição de Tokens"
                    value={formData.tokenomics.tokenDistribution}
                    onChange={(e) => handleInputChange('tokenomics', {
                      ...formData.tokenomics,
                      tokenDistribution: e.target.value
                    })}
                    multiline
                    rows={4}
                    helperText="Detalhe a distribuição de tokens (equipe, advisors, comunidade, etc.)"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Equipe</Typography>
              {formData.team.map((member, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Nome"
                        value={member.name}
                        onChange={(e) => {
                          const newTeam = [...formData.team];
                          newTeam[index].name = e.target.value;
                          handleInputChange('team', newTeam);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Cargo"
                        value={member.role}
                        onChange={(e) => {
                          const newTeam = [...formData.team];
                          newTeam[index].role = e.target.value;
                          handleInputChange('team', newTeam);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="LinkedIn"
                        value={member.linkedin}
                        onChange={(e) => {
                          const newTeam = [...formData.team];
                          newTeam[index].linkedin = e.target.value;
                          handleInputChange('team', newTeam);
                        }}
                        type="url"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Experiência"
                        value={member.experience}
                        onChange={(e) => {
                          const newTeam = [...formData.team];
                          newTeam[index].experience = e.target.value;
                          handleInputChange('team', newTeam);
                        }}
                        multiline
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={() => handleInputChange('team', [
                  ...formData.team,
                  { name: '', role: '', linkedin: '', experience: '' }
                ])}
                sx={{ mt: 2 }}
              >
                Adicionar Membro
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Documentação Legal</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>KYC Status</InputLabel>
                    <Select
                      value={formData.kyc}
                      onChange={(e) => handleInputChange('kyc', e.target.value)}
                    >
                      <MenuItem value={true}>Completo</MenuItem>
                      <MenuItem value={false}>Pendente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Audit Status</InputLabel>
                    <Select
                      value={formData.audit}
                      onChange={(e) => handleInputChange('audit', e.target.value)}
                    >
                      <MenuItem value={true}>Completo</MenuItem>
                      <MenuItem value={false}>Pendente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {formData.audit && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Relatório de Auditoria"
                      value={formData.auditReport}
                      onChange={(e) => handleInputChange('auditReport', e.target.value)}
                      type="url"
                      helperText="Link para o relatório de auditoria"
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Por favor, verifique todas as informações antes de submeter.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Wallet Address"
                value={formData.walletAddress}
                onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                helperText="Endereço da carteira principal do projeto"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telegram"
                value={formData.telegram}
                onChange={(e) => handleInputChange('telegram', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discord"
                value={formData.discord}
                onChange={(e) => handleInputChange('discord', e.target.value)}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      bgcolor: 'background.default',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 4, color: 'primary.main' }}>
            Submeter Projeto para IDO
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : activeStep === steps.length - 1 ? (
                'Submeter'
              ) : (
                'Próximo'
              )}
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="warning" /> Processo de Verificação
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Após a submissão, seu projeto passará por uma análise rigorosa usando nossa IA de
            avaliação de riscos. O processo inclui verificação de documentação, análise técnica
            do código, avaliação de tokenomics e due diligence da equipe. Projetos aprovados
            serão listados no ranking e poderão prosseguir com o IDO.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default SubmitProject;