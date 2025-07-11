"use client"
import { PieChart } from "@mui/x-charts/PieChart"
import { Accordion, AccordionContent, AccordionTitle, AccordionPanel, List, ListItem } from 'flowbite-react';
import {useState,useEffect, useMemo} from "react"
import usePollStore from "../../../../../store/pollStore";
import useUserStore from "../../../../../store/userStore";
import { useParams } from "next/navigation";



const Results = () => {


  const { token } = useUserStore()
  const params = useParams()
  const slug = Number(params.slug)
  const {getResults} = usePollStore()
  const [result,setResult] = useState([])


  useEffect(()=>{

    const onLoad = async()=>{
      const data= await getResults(slug,token)
      setResult(data)
    }
    onLoad()
  },[getResults,token,slug])

   const sumTotal = useMemo(()=>{
    if (!result){
      return 0
    }

    return result.reduce((acc,choice)=>{return acc + choice.value},0)

  },[result])

  const orderedResult = useMemo(()=>{
    if (!result){
      return []
    }

    return [...result].sort((a, b) => b.value - a.value)

  },[result])


  if (!result) {
    return <div className="text-center text-lg py-8">Loading results...</div>;
  }

 return ( <div className='p-4 lg:p-8 min-h-screen flex items-center justify-center'>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center h-auto">
      <div className='w-full flex items-start justify-center'>
        <PieChart
          series={[
            {
              data: result,
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
                  {orderedResult?.map((choice, index) => {
                    return (
                      <ListItem className='text-lg' key={index}>

                        {`${choice.label} (${choice.value})`}</ListItem>
                    )
                  })}
                </List>
              </AccordionContent>
            </AccordionPanel>
          </Accordion></div>

                  <h3>{`Total Votes: ${sumTotal}`}</h3>
      </div>
    </div>


  </div>)
}






export default Results
