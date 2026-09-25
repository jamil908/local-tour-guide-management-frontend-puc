/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { Suspense } from 'react';
import Loading from '@/components/shared/Loading';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading color="border-amber-500" className="bg-gray-900 min-h-screen" />}>
      <RegisterForm />
    </Suspense>
  );
}