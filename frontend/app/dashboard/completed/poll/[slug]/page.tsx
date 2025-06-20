"use client"
import { PieChart } from "@mui/x-charts/PieChart"
import { Accordion, AccordionContent, AccordionTitle, AccordionPanel, List, ListItem } from 'flowbite-react';

const results = [
  { id: 0,label:"Burger King", value: 1, color: '#0088FE' },
  { id: 1,label:"La Pastora", value: 3, color: '#00C49F' },
  { id: 2,label:"Pollo Sabroso", value: 2, color: '#FFBB28' },
  { id: 3,label:"Migos", value: 5, color: '#FF8042' },
];

const orderedResults = [...results].sort((a, b) => b.value - a.value)
const Results = () => (
  <div className='p-4 lg:p-8 min-h-screen flex items-center justify-center'>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center h-auto">
      <div className='w-full flex items-start justify-center'>
        <PieChart
          series={[
            {
              data: results,
            },
          ]}
          width={250}
          height={250}
        />
      </div>
      <div className='w-full max-w-lg mx-auto my-4' >
        <div className='min-w-4/5'>
          <Accordion className='w-full mx-auto'>
            <AccordionPanel>
              <AccordionTitle className='font-bold text-xl'>Results</AccordionTitle>
              <AccordionContent>
                <List ordered>
                  {orderedResults.map((choice, index) => {
                    return (
                      <ListItem className='text-lg' key={index}>{choice.label}</ListItem>
                    )
                  })}
                </List>
              </AccordionContent>
            </AccordionPanel>
          </Accordion></div>


      </div>
    </div>


  </div>
)






export default Results
