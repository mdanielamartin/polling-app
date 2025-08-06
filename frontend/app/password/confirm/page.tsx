import { Card } from "flowbite-react";

export default function PasswordResetConfirmation() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md text-center shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          All Set!
        </h2>
        <p className="text-gray-600 mb-4">
          {`We've sent an email with instructions to reset your password.`}
        </p>
        <p className="text-sm text-gray-500">
          {`If it's not in your inbox, please check your spam folder.`}
        </p>
      </Card>
    </div>
  );
}
