import { Alert } from "flowbite-react"

const ExpiredToken = () => {


  return (
     <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <Alert color="failure" rounded>
          <span className="font-semibold">Session expired:</span> Your token is no longer valid.
          <div className="mt-2 text-sm text-gray-700">
            Please contact the administrator for assistance or request a new token.
          </div>
        </Alert>
      </div>
    </div>


  )
}

export default ExpiredToken
