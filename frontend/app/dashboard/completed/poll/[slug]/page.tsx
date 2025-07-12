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

 return ( <div className="p-4 lg:p-8 min-h-screen flex items-center justify-center">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full max-w-screen-xl">
  <div className="w-full flex justify-center">
  <div className="w-64 sm:w-64 lg:w-80">
    <PieChart
      series={[{ data: result }]}
      width={320}
      height={320}
    />
  </div>
</div>



    {/* Results Section */}
    <div className="w-full max-w-lg mx-auto my-4">
      <Accordion className="w-full">
        <AccordionPanel>
          <AccordionTitle className="font-bold text-xl">Results</AccordionTitle>
          <AccordionContent>
            <List ordered>
              {orderedResult?.map((choice, index) => (
                <ListItem className="text-lg" key={index}>
                  {`${choice.label} (${choice.value})`}
                </ListItem>
              ))}
            </List>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <h3 className="mt-4 text-center font-medium text-base">{`Total Votes: ${sumTotal}`}</h3>
    </div>
  </div>
</div>)
}






export default Results
