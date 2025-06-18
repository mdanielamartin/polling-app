"use client"
import { PieChart } from 'react-minimal-pie-chart';

const data = [
  { title: 'Burger King', value: 4, color: '#0088FE' },
  { title: 'Pollo Sabroso', value: 3, color: '#00C49F' },
  { title: 'Migos', value: 2, color: '#FFBB28' },
  { title: 'La Pastora', value: 1, color: '#FF8042' },
];

const Results = () => (
    <div className='h-full w-full'>
        <div className='grid grid-cols-1 h-full w-full grid-rows-2'>
        <PieChart
          data={data}
          label={({ dataEntry }) => `${dataEntry.title}`}
          labelStyle={{
    fontSize: '0.75rem', // Tailwind's text-sm
    fill: '#1f2937',     // Tailwind's text-gray-800
    fontWeight: 600,     // Tailwind's font-semibold
  }}

          radius={42}
          labelPosition={112}
          className='text-black'
          animate
        />

        <div className='row-start-2'>hhhhhhhhhhhhhhhh</div>
        </div>
    </div>
);


export default Results
