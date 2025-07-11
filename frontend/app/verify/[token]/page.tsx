'use client'

import { useParams } from 'next/navigation'
import usePolleeStore from '../../../store/polleeStore'
import { useEffect } from 'react'
import { Spinner } from 'flowbite-react'
import { useRouter } from 'next/navigation'


const VerifyToken = () => {
  const { token } = useParams() as { token: string }
  const { getPoll, status } = usePolleeStore()
    const router = useRouter()
  useEffect(() => {
    if (token) {
      getPoll(token)
    }
    if (status == 200){
         router.push("poll/vote/")}
    else if (status == 401){
        router.push("poll/expired/")}
    else {
        router.push("poll/invalid/")
    }


  }, [token, getPoll, status,router])

  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
      Verifying...
    </div>
  )
}

export default VerifyToken
