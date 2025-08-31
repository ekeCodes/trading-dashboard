import "chart.js/auto";
import { type InteractionAxis, type InteractionMode } from "chart.js/auto";
import { Line } from "react-chartjs-2";

export interface MiniChartProps {
  data: { x: number; y: number }[];
  isLoading: boolean;
}
export default function MiniChart(props: MiniChartProps) {
  const { data, isLoading } = props;
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
    interaction: {
      mode: "nearest" as InteractionMode,
      axis: "x" as InteractionAxis,
      intersect: false,
    },
  };
  return (
    <div className=" h-[200px] relative top-[50px] sm:top-0">
      <Line id={`${Math.random()}`} data={chartData} options={options} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
