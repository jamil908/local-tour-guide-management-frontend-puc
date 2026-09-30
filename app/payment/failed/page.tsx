// 'use client';


import { Suspense } from 'react';
import PaymentFailedClient from './PaymentFailedClient'; 
import { LoadingSpinner } from '@/components/shared/Loading';

const LoadingFallback = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-700">
        Loading payment details...
       
        <LoadingSpinner size="lg" />
    </div>
);

export default function PaymentFailedPageWrapper() {
    return (
        
        <Suspense fallback={<LoadingFallback />}>
            <PaymentFailedClient />
        </Suspense>
    );
}