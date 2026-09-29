

// /* eslint-disable react/no-unescaped-entities */
// 'use client';



import { Suspense } from 'react';
import PaymentSuccessClient from './PaymentSuccessClient';
import { LoadingSpinner } from '@/components/shared/Loading';
const LoadingFallback = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-700">
        Confirming payment details...
        <LoadingSpinner size="lg" />
    </div>
);

export default function PaymentSuccessPageWrapper() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PaymentSuccessClient />
        </Suspense>
    );
}