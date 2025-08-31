import { Line } from "react-chartjs-2";
import "chart.js/auto";

export interface MiniChartProps {
  data: { x: number; y: number }[];
}
export default function MiniChart(props: MiniChartProps) {
  const { data } = props;
  const labels = data.map((d) => new Date(d.x).toLocaleTimeString());
  const dataset = data.map((d) => d.y);
  const chartData = {
    labels,
    datasets: [{ label: "Price", data: dataset, fill: false, tension: 0.1 }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false } },
  };
  return (
    <div className="h-[200px]">
      <Line id={`${Math.random()}`} data={chartData} options={options} />
    </div>
  );
}
