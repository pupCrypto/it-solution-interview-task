import { PieChart } from '@mui/x-charts/PieChart';


export default function Pie({statistic}) {
  const series = [
  {
    data: statistic.map(item => ({
      id: item.id,
      value: item.amount,
      label: item.name,
    })),
    innerRadius: 44,
    paddingAngle: 1,
    cornerRadius: 5,
  },
  ]
  return (
    <PieChart series={series} width={700} height={300} />
  );
}
