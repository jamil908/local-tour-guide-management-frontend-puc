/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import { FiCheckCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  const bookingId = searchParams.get('bookingId');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-600" size={48} />
          </div>

          <h1 className="text-3xl font-bold text-amber-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-amber-800 mb-8">
            Your booking has been confirmed. We've sent a confirmation email with all the details.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-mono text-amber-600 font-semibold">{bookingId?.slice(0, 8) || 'N/A'}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-amber-600 font-semibold">{transactionId?.slice(0, 12) || 'N/A'}...</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href={`/dashboard/tourist`} className="block">
              <Button className="w-full">
                View My Bookings
              </Button>
            </Link>
            <Link href="/explore" className="block">
              <Button variant="outline" className="w-full">
                Explore More Tours
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}