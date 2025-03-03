import React from 'react';
import { Paper, Box } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ChartContainer = () => {
  // Dados de exemplo
  const data = [
    { time: '00:00', price: 50000 },
    { time: '01:00', price: 50500 },
    { time: '02:00', price: 51000 },
    { time: '03:00', price: 50800 },
    { time: '04:00', price: 51200 },
    { time: '05:00', price: 51500 },
    { time: '06:00', price: 51300 },
    { time: '07:00', price: 51800 },
    { time: '08:00', price: 52000 },
    { time: '09:00', price: 51900 },
  ];

  return (
    <Paper sx={{ 
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      height: '450px'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ChartContainer;