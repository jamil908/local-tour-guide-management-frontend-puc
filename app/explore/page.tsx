// /* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable @next/next/no-img-element */


// /* eslint-disable @next/next/no-img-element */


import { Suspense } from 'react';
import ExploreClient from './ExploreCLient'; 
import { LoadingSpinner } from '@/components/shared/Loading'; 

const LoadingFallback = () => (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
       
        <LoadingSpinner size="lg" color="text-amber-500" />
    </div>
);

export default function ExplorePage() {
    return (
    
        <Suspense fallback={<LoadingFallback />}>
            <ExploreClient />
        </Suspense>
    );
}


