import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Link,
  Chip,
  IconButton,
  Divider,
  Avatar,
  Skeleton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  OpenInNew,
  Schedule,
  Source
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NewsFeed = ({ news, loading }) => {
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      case 'neutral':
        return 'info';
      default:
        return 'default';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp fontSize="small" />;
      case 'negative':
        return <TrendingDown fontSize="small" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Notícias do Mercado
        </Typography>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        ))}
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      bgcolor: 'background.paper',
      borderRadius: 2,
      height: '100%',
      overflow: 'hidden'
    }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          Notícias do Mercado
        </Typography>
      </Box>

      <Box sx={{ 
        height: 'calc(100% - 60px)',
        overflow: 'auto',
        px: 2
      }}>
        {news.map((item, index) => (
          <Box key={item.id}>
            <Box sx={{ py: 2 }}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={item.sourceIcon}
                    alt={item.source}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {item.source}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    <Schedule fontSize="small" />
                    {formatDistanceToNow(new Date(item.timestamp), { 
                      addSuffix: true,
                      locale: ptBR 
                    })}
                  </Typography>
                </Box>
                <IconButton 
                  size="small"
                  component={Link}
                  href={item.url}
                  target="_blank"
                >
                  <OpenInNew fontSize="small" />
                </IconButton>
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {item.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  size="small"
                  label={item.sentiment}
                  color={getSentimentColor(item.sentiment)}
                  icon={getSentimentIcon(item.sentiment)}
                />
                {item.tags.map((tag) => (
                  <Chip
                    key={tag}
                    size="small"
                    label={tag}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            {index < news.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default NewsFeed;