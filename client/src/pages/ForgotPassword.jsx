import React, { useState } from 'react';
import { Button, Label, TextInput, Alert } from 'flowbite-react';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setLoading(false);
  
      } else {
        setLoading(false);
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to send reset email');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="border rounded-sm mt-12 sm:mt-36 shadow-md w-full mx-4 px-5 py-10 sm:max-w-xl">
        <h1 className="text-lg font-bold text-teal-700 text-center mb-7">
          Forgot Password
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
          <div>
            <Label value="Email" />
            <TextInput
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button gradientDuoTone="purpleToPink" type="submit">
            {loading ? 'Loading...' : 'Submit'}
          </Button>
        </form>
        {message && <Alert color="success" className="mt-5">{message}</Alert>}
        {error && <Alert color="failure" className="mt-5">{error}</Alert>}
      </div>
    </div>
  );
}
