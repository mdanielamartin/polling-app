import { Card } from "flowbite-react";

export default function PasswordResetError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
      <Card className="w-full max-w-md text-center shadow-md border border-red-300">
        <h2 className="text-2xl font-semibold text-red-800 mb-2">
          Oops, Something Went Wrong
        </h2>
        <p className="text-red-600 mb-4">
          {`There was a problem resetting your password. This could be due to an expired or invalid link.`}
        </p>
        <p className="text-sm text-red-500 mb-2">
          {`Please try resetting your password again or request a new email.`}
        </p>
        <p className="text-sm text-gray-500">
          {`If the issue persists, contact support for assistance.`}
        </p>
      </Card>
    </div>
  );
}
