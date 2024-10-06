
import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ candidatos }) => {
  const pieData = {
    labels: candidatos.map((candidato) => candidato.nomeUrna),
    datasets: [
      {
        label: "% de Votos",
        data: candidatos.map((candidato) => candidato.percentualVotos),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return <Pie data={pieData} />;
};

export default PieChart;