const LOCAL_STORAGE_KEY = 'defailabz_submissions';

export const projectService = {
  submitProject(projectData) {
    try {
      const submissions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      
      // Análise inicial do projeto
      const riskAnalysis = this.analyzeProject(projectData);
      
      const submission = {
        ...projectData,
        id: Date.now(),
        submissionDate: new Date().toISOString(),
        status: riskAnalysis.score >= 70 ? 'APPROVED' : 'PENDING_REVIEW',
        riskAnalysis
      };

      submissions.push(submission);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(submissions));

      return submission;
    } catch (error) {
      console.error('Erro na submissão:', error);
      throw new Error('Falha ao submeter projeto. Por favor, tente novamente.');
    }
  },

  analyzeProject(data) {
    // Análise Técnica (30%)
    const technicalScore = this.calculateTechnicalScore(data);
    
    // Análise de Segurança (25%)
    const securityScore = this.calculateSecurityScore(data);
    
    // Análise de Equipe (25%)
    const teamScore = this.calculateTeamScore(data);
    
    // Análise de Documentação (20%)
    const documentationScore = this.calculateDocumentationScore(data);

    // Score Final
    const finalScore = (
      (technicalScore * 0.30) +
      (securityScore * 0.25) +
      (teamScore * 0.25) +
      (documentationScore * 0.20)
    );

    return {
      score: Math.round(finalScore),
      details: {
        technical: technicalScore,
        security: securityScore,
        team: teamScore,
        documentation: documentationScore
      },
      recommendation: this.generateRecommendation(finalScore),
      date: new Date().toISOString()
    };
  },

  calculateTechnicalScore(data) {
    let score = 0;
    
    // Blockchain escolhida
    if (data.blockchain) score += 20;
    
    // Smart Contract
    if (data.smartContractAddress) score += 20;
    
    // GitHub
    if (data.githubRepository) score += 30;
    
    // Tokenomics
    if (data.tokenomics && Object.values(data.tokenomics).every(v => v)) score += 30;

    return score;
  },

  calculateSecurityScore(data) {
    let score = 0;
    
    // Auditoria
    if (data.audit) score += 40;
    
    // KYC
    if (data.kyc) score += 40;
    
    // Documentos legais
    if (data.legalDocuments && data.legalDocuments.length > 0) score += 20;

    return score;
  },

  calculateTeamScore(data) {
    let score = 0;
    
    if (data.team && data.team.length > 0) {
      // Pontuação base por membro da equipe
      score += Math.min(data.team.length * 20, 60);
      
      // Verificação de LinkedIn
      const hasLinkedIn = data.team.every(member => member.linkedin);
      if (hasLinkedIn) score += 20;
      
      // Experiência detalhada
      const hasExperience = data.team.every(member => member.experience);
      if (hasExperience) score += 20;
    }

    return Math.min(score, 100);
  },

  calculateDocumentationScore(data) {
    let score = 0;
    
    // Website
    if (data.website) score += 20;
    
    // Whitepaper
    if (data.whitepaper) score += 30;
    
    // Descrição detalhada
    if (data.description && data.description.length > 200) score += 25;
    
    // Categoria definida
    if (data.category) score += 25;

    return score;
  },

  generateRecommendation(score) {
    if (score >= 90) {
      return 'Projeto de baixo risco. Recomendado para listagem.';
    } else if (score >= 70) {
      return 'Projeto moderado. Aprovado com observações.';
    } else if (score >= 50) {
      return 'Projeto de alto risco. Necessita revisão.';
    } else {
      return 'Projeto não recomendado. Múltiplos pontos de atenção.';
    }
  },

  getSubmissions() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  },

  getApprovedProjects() {
    const submissions = this.getSubmissions();
    return submissions
      .filter(s => s.status === 'APPROVED')
      .sort((a, b) => b.riskAnalysis.score - a.riskAnalysis.score);
  },

  getPendingProjects() {
    const submissions = this.getSubmissions();
    return submissions
      .filter(s => s.status === 'PENDING_REVIEW')
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
  },

  getProjectById(id) {
    const submissions = this.getSubmissions();
    return submissions.find(s => s.id === id);
  }
};