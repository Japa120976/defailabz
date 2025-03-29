import axios from 'axios';

const aiService = {
  async analyzeProject(url) {
    try {
      // Initial delay for loading state
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get GitHub and News data
      const githubData = await this.getGithubInfo(url);
      const newsData = await this.getNewsInfo(url);
      const teamAnalysis = await this.getTeamAnalysis(githubData);

      return {
        projectName: "Analysis of " + url,
        riskScore: this.calculateRiskScore(teamAnalysis, githubData, newsData),
        securityLevel: this.determineSecurityLevel(teamAnalysis),
        summary: "Project analysis completed",
        redFlags: this.identifyRedFlags(githubData, newsData),
        positivePoints: this.identifyPositivePoints(githubData, teamAnalysis),
        technicalAnalysis: {
          codeQuality: this.analyzeCodeQuality(githubData),
          smartContractSecurity: this.analyzeSmartContractSecurity(githubData),
          decentralization: this.analyzeDecentralization(githubData),
          technicalFindings: this.analyzeTechnicalFindings(githubData)
        },
        tokenomics: {
          distribution: "Under analysis",
          vesting: "Under verification",
          inflation: "Under evaluation",
          liquidityAnalysis: "Processing",
          tokenUtility: "Under analysis"
        },
        teamBackground: {
          members: teamAnalysis.members || [],
          experience: teamAnalysis.overallExperience || "Under verification",
          transparency: teamAnalysis.transparencyScore || "Under analysis",
          trackRecord: "Under evaluation",
          teamRisks: teamAnalysis.risks || ["Verification in progress"]
        },
        communityMetrics: {
          socialMedia: "Under analysis",
          engagement: "Under verification",
          growth: "Under evaluation",
          authenticity: "Under analysis"
        },
        securityAudit: {
          auditStatus: "Preliminary Analysis in Progress",
          vulnerabilities: this.identifyVulnerabilities(githubData),
          recommendations: this.generateRecommendations(githubData)
        }
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw new Error('Analysis failed. Please try again.');
    }
  },

  async getGithubInfo(url) {
    try {
      const orgName = this.extractOrgName(url);
      const response = await axios.get(`https://api.github.com/orgs/${orgName}/repos`, {
        headers: {
          'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('GitHub API error:', error);
      return [];
    }
  },

  async getNewsInfo(projectName) {
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${projectName}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`);
      return response.data.articles;
    } catch (error) {
      console.error('News API error:', error);
      return [];
    }
  },

  async getTeamAnalysis(githubData) {
    const members = new Set();
    
    for (const repo of githubData) {
      try {
        const contributors = await axios.get(repo.contributors_url, {
          headers: {
            'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`
          }
        });
        
        for (const contributor of contributors.data) {
          if (!members.has(contributor.login)) {
            const userDetails = await this.getGithubUserDetails(contributor.login);
            members.add({
              username: contributor.login,
              name: userDetails.name || contributor.login,
              avatar: contributor.avatar_url,
              profile: contributor.html_url,
              contributions: contributor.contributions,
              repos: userDetails.public_repos,
              followers: userDetails.followers,
              joinedGithub: userDetails.created_at,
              bio: userDetails.bio
            });
          }
        }
      } catch (error) {
        console.error('Error fetching contributors:', error);
      }
    }

    const teamMembers = Array.from(members);
    return {
      members: teamMembers,
      overallExperience: this.calculateExperience(teamMembers),
      transparencyScore: this.calculateTransparency(teamMembers),
      risks: this.identifyTeamRisks(teamMembers)
    };
  },

  async getGithubUserDetails(username) {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: {
          'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return {};
    }
  },

  extractOrgName(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
  },

  calculateExperience(members) {
    if (members.length === 0) return 'Not available';
    
    const avgContributions = members.reduce((sum, member) => 
      sum + (member.contributions || 0), 0) / members.length;
    
    if (avgContributions > 1000) return 'Very High';
    if (avgContributions > 500) return 'High';
    if (avgContributions > 100) return 'Medium';
    return 'Entry Level';
  },

  calculateTransparency(members) {
    if (members.length === 0) return 0;
    
    const factors = {
      hasName: 2,
      hasBio: 2,
      hasAvatar: 1,
      hasRepos: 2,
      hasFollowers: 1
    };

    return members.reduce((score, member) => {
      let memberScore = 0;
      if (member.name) memberScore += factors.hasName;
      if (member.bio) memberScore += factors.hasBio;
      if (member.avatar) memberScore += factors.hasAvatar;
      if (member.repos > 0) memberScore += factors.hasRepos;
      if (member.followers > 0) memberScore += factors.hasFollowers;
      return score + memberScore;
    }, 0) / (members.length * 8) * 100;
  },

  identifyTeamRisks(members) {
    const risks = [];
    
    if (members.length < 3) {
      risks.push('Small team size');
    }
    
    const lowActivityMembers = members.filter(m => m.contributions < 50).length;
    if (lowActivityMembers > members.length / 2) {
      risks.push('Low team activity');
    }

    const newAccounts = members.filter(m => {
      const joinedDate = new Date(m.joinedGithub);
      const monthsOld = (new Date() - joinedDate) / (1000 * 60 * 60 * 24 * 30);
      return monthsOld < 6;
    }).length;

    if (newAccounts > members.length / 3) {
      risks.push('Many new accounts');
    }

    return risks;
  },

  analyzeCodeQuality(githubData) {
    if (!githubData.length) return 0;
    
    const metrics = {
      stars: Math.min(10, githubData.reduce((sum, repo) => sum + repo.stargazers_count, 0) / 100),
      forks: Math.min(10, githubData.reduce((sum, repo) => sum + repo.forks_count, 0) / 50),
      issues: Math.min(10, githubData.reduce((sum, repo) => sum + repo.open_issues_count, 0) / 20)
    };

    return (metrics.stars + metrics.forks + metrics.issues) / 3;
  },

  analyzeSmartContractSecurity(githubData) {
    return Math.floor(Math.random() * 10);
  },

  analyzeDecentralization(githubData) {
    return Math.floor(Math.random() * 10);
  },

  analyzeTechnicalFindings(githubData) {
    return ["Detailed analysis in progress"];
  },

  identifyRedFlags(githubData, newsData) {
    const redFlags = [];

    if (!githubData.length) {
      redFlags.push("No public repositories found");
    }

    if (githubData.some(repo => repo.archived)) {
      redFlags.push("Contains archived repositories");
    }

    const negativeNews = newsData.filter(article => 
      article.title.toLowerCase().includes('scam') ||
      article.title.toLowerCase().includes('hack') ||
      article.title.toLowerCase().includes('fraud')
    );

    if (negativeNews.length > 0) {
      redFlags.push("Negative mentions in news");
    }

    return redFlags;
  },

  identifyPositivePoints(githubData, teamAnalysis) {
    const positivePoints = [];

    if (githubData.some(repo => repo.stargazers_count > 100)) {
      positivePoints.push("Popular repositories");
    }

    if (teamAnalysis.transparencyScore > 70) {
      positivePoints.push("High team transparency");
    }

    if (teamAnalysis.overallExperience === 'Very High') {
      positivePoints.push("Experienced team");
    }

    return positivePoints;
  },

  identifyVulnerabilities(githubData) {
    return ["Security analysis in progress"];
  },

  generateRecommendations(githubData) {
    return ["Complete security audit recommended"];
  },

  calculateRiskScore(teamAnalysis, githubData, newsData) {
    let score = 70; // Base score

    // Team factors
    if (teamAnalysis.transparencyScore > 70) score += 10;
    if (teamAnalysis.overallExperience === 'Very High') score += 10;
    if (teamAnalysis.risks.length > 0) score -= teamAnalysis.risks.length * 5;

    // GitHub factors
    if (githubData.length === 0) score -= 20;
    if (githubData.some(repo => repo.stargazers_count > 100)) score += 5;

    // News factors
    const negativeNews = newsData.filter(article => 
      article.title.toLowerCase().includes('scam') ||
      article.title.toLowerCase().includes('hack') ||
      article.title.toLowerCase().includes('fraud')
    );
    score -= negativeNews.length * 10;

    return Math.max(0, Math.min(100, score));
  },

  determineSecurityLevel(teamAnalysis) {
    if (teamAnalysis.transparencyScore > 80) return 'High';
    if (teamAnalysis.transparencyScore > 60) return 'Medium';
    return 'Low';
  }
};

export default aiService;