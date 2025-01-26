import { PieChart } from '@mui/x-charts/PieChart';
import { Space } from 'antd';


export default function Pie() {
    const series = [
        {
          data: [
            { id: 0, value: 10, label: 'Инфраструктура' },
            { id: 1, value: 15, label: 'Маркетинг' },
            { id: 2, value: 15, label: 'Маркетинг' },
          ],
          innerRadius: 44,
          paddingAngle: 1,
          cornerRadius: 5,
        },
      ]
    return (
        <PieChart series={series} width={700} height={300} />
    );
}
