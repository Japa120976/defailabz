import React from 'react';
import {
  Paper,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MarketDepth = ({ bids, asks }) => {
  const theme = useTheme();

  const data = {
    labels: [...bids, ...asks].map(order => order.price),
    datasets: [
      {
        label: 'Bids',
        data: bids.map(b => b.total),
        borderColor: theme.palette.success.main,
        backgroundColor: theme.palette.success.light,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Asks',
        data: asks.map(a => a.total),
        borderColor: theme.palette.error.main,
        backgroundColor: theme.palette.error.light,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.divider
        },
        ticks: {
          color: theme.palette.text.secondary
        }
      },
      y: {
        grid: {
          color: theme.palette.divider
        },
        ticks: {
          color: theme.palette.text.secondary
        }
      }
    }
  };

  return (
    <Paper sx={{ 
      bgcolor: 'background.paper',
      borderRadius: 2,
      height: '100%',
      p: 2
    }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Market Depth
      </Typography>
      <Box sx={{ height: 'calc(100% - 40px)' }}>
        <Line data={data} options={options} />
      </Box>
    </Paper>
  );
};

export default MarketDepth;