import React from "react";
import { Card } from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeightChart = ({ weightData }) => {
  const data = {
    labels: weightData.labels,
    datasets: [
      {
        label: "Cân nặng (kg)",
        data: weightData.values,
        borderColor: "#F8B602",
        backgroundColor: "rgba(248, 182, 2, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#F8B602",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Mục tiêu",
        data: weightData.target,
        borderColor: "#5f4ba2",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} kg`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function (value) {
            return value + " kg";
          },
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <Card className="weight-chart-card" title="Biểu đồ cân nặng">
      <div style={{ height: "350px" }}>
        <Line data={data} options={options} />
      </div>
    </Card>
  );
};

export default WeightChart;
