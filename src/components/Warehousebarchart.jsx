import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function Warehousebarchart({ chartWidth = 800, chartHeight = 500 }) {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const labels = ['Warehouse', 'Warehouse', 'Warehouse', 'Warehouse', 'Warehouse', 'Warehouse', 'Warehouse'];
  const data = [
    { day: 'Warehouse', count: 5 },
    { day: 'Warehouse', count: 10 },
    { day: 'Warehouse', count: 15 },
    { day: 'Warehouse', count: 20 },
    { day: 'Warehouse', count: 25 },
    { day: 'Warehouse', count: 30 },
    { day: 'Warehouse', count: 35 },
  ];

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    // Create the chart instance
    const chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            data: data.map((item) => item.count),
            backgroundColor: " #7ec75b",
            borderColor: "#7ec75b",
            borderRadius: 10,
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Allow custom size by disabling aspect ratio
        scales: {
          x: {
            display: true,
            ticks: {
              color: "#4A4A4A", // Customize the color of the labels
              font: {
                family: "Arial", // Customize font family
                size: 14, // Customize font size
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#4A4A4A",
              font: {
                family: "Arial",
                size: 14,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide legend
          },
          tooltip: {
            enabled: true, // Enable tooltips
            backgroundColor: "#556b4b",
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
          },
        },
      },
    });

    // Cleanup function to destroy the chart instance
    return () => {
      chartInstance.destroy();
    };
  }, []); // Empty dependency array to ensure this effect runs only once

  return (
    <div
      className="daily-login-count-chart-container flex justify-center"
      style={{ width: '564px', height: '264px' }} // Use style to pass custom width/height
    >
      <canvas
        ref={canvasRef}
        id="LoginCountChart"
        width={chartWidth} // Set width attribute
        height={chartHeight} // Set height attribute
      ></canvas>
    </div>
  );
}

export default Warehousebarchart;
