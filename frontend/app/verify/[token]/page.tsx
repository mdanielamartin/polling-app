'use client'

import { useParams } from 'next/navigation'
import usePolleeStore from '../../../store/polleeStore'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '../../../components/LoadingSpinner'


const VerifyToken = () => {
  const { token } = useParams() as { token: string }
  const { getPoll, status } = usePolleeStore()
    const router = useRouter()
  useEffect(() => {

    const verify = async ()=>{
      if (token) {
        await getPoll(token)
        if (status === 200){
             router.push("poll/vote/")}
        else if (status === 401){
            router.push("poll/expired/")}
        else {
            router.push("poll/invalid/")
        }
      }
    }
    verify()
  }, [token, getPoll, status,router])

  return (
    <div>
      <LoadingSpinner/>
      <h4 className='text-center text-cyan-700'>Verifying your link, you will be redirected shortly...</h4>
    </div>
  )
}

export default VerifyToken
