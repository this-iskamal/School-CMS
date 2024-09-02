import React, { useState } from 'react';
import { Button, Label, TextInput, Alert } from 'flowbite-react';

export default function PasswordResetPage() {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resetToken, newPassword })
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setTimeout(() => {
            window.open("/sign-in","_self")
        }, 1000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to reset password');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="border rounded-sm mt-12 sm:mt-36 shadow-md w-full mx-4 px-5 py-10 sm:max-w-xl">
        <h1 className="text-lg font-bold text-teal-700 text-center mb-7">
          Reset Password
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
          <div>
            <Label value="Reset Token" />
            <TextInput
              type="text"
              placeholder="Enter your reset token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
            />
          </div>
          <div>
            <Label value="New Password" />
            <TextInput
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button gradientDuoTone="purpleToPink" type="submit">
            Submit
          </Button>
        </form>
        {message && <Alert color="success" className="mt-5">{message}</Alert>}
        {error && <Alert color="failure" className="mt-5">{error}</Alert>}
      </div>
    </div>
  );
}
