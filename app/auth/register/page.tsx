// /* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Suspense } from 'react';
import Loading from '@/components/shared/Loading'; // Import your Loading component
import RegisterForm from './RegisterForm'; 

export default function RegisterPage() {
  return (
   
    <Suspense 
      fallback={
        <Loading color="border-amber-500" className="bg-gray-900 min-h-screen" />
      }
    >
      <RegisterForm></RegisterForm>
    </Suspense>
  );
}