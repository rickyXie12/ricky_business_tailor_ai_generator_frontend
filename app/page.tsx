'use client';
import { useState } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';

export default function HomePage() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <h1 className="text-4xl font-bold text-center text-white mb-2 drop-shadow-lg">AI Content Generator</h1>
      <p className="text-center text-lg text-gray-200 mb-8">By The Business Tailor</p>
      <div className="w-full max-w-md main-content">
        {isLoginView ? <LoginForm /> : <RegisterForm />}
        <p className="text-center text-base text-gray-300 mt-6">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="font-semibold text-blue-400 hover:text-blue-300 ml-2 underline"
          >
            {isLoginView ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}