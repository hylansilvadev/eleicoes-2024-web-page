import { Bar } from 'react-chartjs-2';

const BarChart = ({ candidatos, options }) => {
  const barData = {
    labels: candidatos.map((candidato) => candidato.nomeUrna),
    datasets: [
      {
        label: "Votos Apurados",
        data: candidatos.map((candidato) => candidato.votosApurados),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const defaultOptions = {

    scales: {
      x: {
        ticks: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
        },
      },
    },
  };

  return <Bar data={barData} options={{ ...defaultOptions, ...options }} />;
};

export default BarChart;