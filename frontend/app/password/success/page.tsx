import { Card, Button } from "flowbite-react";
import Link from "next/link";

export default function PasswordResetSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md text-center shadow-md rounded-2xl">
        <h2 className="text-2xl font-bold text-cyan-700 mb-2">
          PASSWORD UPDATED
        </h2>
        <p className="text-gray-600 mb-4">
          {`Your password has been successfully reset.`}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {`You can now log in with your new password.`}
        </p>
        <Link href="/login" className="flex justify-center">
          <Button color="cyan" className="flex">
            Go to Login
          </Button>
        </Link>
      </Card>
    </div>
  );
}
