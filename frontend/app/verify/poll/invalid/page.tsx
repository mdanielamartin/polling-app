import { Alert } from "flowbite-react"
const InvalidToken = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <Alert color="warning" rounded>
          <span className="font-semibold">Access Denied:</span> You are not registered to participate in this poll.
          <div className="mt-2 text-sm text-gray-700">
            If you believe this is a mistake, please contact the administrator or request access.
          </div>
        </Alert>
      </div>
    </div>
  )
}

export default InvalidToken
