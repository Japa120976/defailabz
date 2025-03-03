const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Função para extrair informações relevantes do texto
function extractRelevantInfo(text) {
  // Remove espaços em excesso e limita o tamanho
  return text.replace(/\s+/g, ' ').trim().substring(0, 5000);
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    console.log('Analisando URL:', url);

    // Faz o scraping do site
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const text = extractRelevantInfo($('body').text());
    
    // Prepara o prompt para a OpenAI
    const prompt = `
Analise este projeto de criptomoeda/blockchain e forneça uma análise detalhada no seguinte formato JSON:

Dados do Projeto:
Título: ${title}
Descrição: ${description}
URL: ${url}
Conteúdo: ${text}

Forneça a análise no seguinte formato JSON (mantenha estritamente este formato):
{
  "projectName": "Nome do Projeto",
  "riskScore": [número de 0-100],
  "securityLevel": ["Alto" | "Moderado" | "Baixo"],
  "redFlags": [
    "lista de red flags encontradas"
  ],
  "positivePoints": [
    "lista de pontos positivos"
  ],
  "technicalAnalysis": {
    "codeQuality": [número de 0-10],
    "smartContractSecurity": [número de 0-10],
    "decentralization": [número de 0-10]
  },
  "tokenomics": {
    "distribution": "análise da distribuição",
    "vesting": "análise do vesting",
    "inflation": "análise da inflação"
  },
  "teamBackground": {
    "experience": ["Alta" | "Média" | "Baixa"],
    "transparency": ["Alta" | "Média" | "Baixa"],
    "trackRecord": ["Positivo" | "Neutro" | "Negativo"]
  },
  "communityMetrics": {
    "socialMedia": "análise das redes sociais",
    "engagement": ["Alto" | "Médio" | "Baixo"],
    "growth": "análise do crescimento"
  }
}
`;

    // Faz a chamada para a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em análise de projetos crypto e blockchain, com foco em detecção de riscos e avaliação técnica. Forneça suas análises sempre no formato JSON solicitado."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Processa a resposta
    const analysisText = completion.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    res.json(analysis);
  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ 
      error: 'Erro ao analisar o projeto',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});