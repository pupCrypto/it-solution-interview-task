import { PieChart } from '@mui/x-charts/PieChart';
import { useFetchCategoriesStatistic } from '../hooks/web';


export default function Pie() {
  const statistic = useFetchCategoriesStatistic();
  const series = [
  {
    // data: [
    //   { id: 0, value: 10, label: 'Инфраструктура' },
    //   { id: 1, value: 15, label: 'Маркетинг' },
    //   { id: 2, value: 15, label: 'Маркетинг' },
    // ],
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
