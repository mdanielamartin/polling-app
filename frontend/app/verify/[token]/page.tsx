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

  // Fetch poll when token changes
  useEffect(() => {
    if (token) {
      getPoll(token)
    }
  }, [token, getPoll])

  // Redirect when status changes
  useEffect(() => {
    if (status === 200) {
      router.push('/verify/poll/vote/')
    } else if (status === 401) {
      router.push('poll/expired/')
    } else if (status && status !== 200 && status !== 401) {
      router.push('/verify/poll/invalid/')
    }
  }, [status, router])

  return (
    <div>
      <LoadingSpinner/>
      <h4 className='text-center text-cyan-700'>Verifying your link, you will be redirected shortly...</h4>
    </div>
  )
}

export default VerifyToken
