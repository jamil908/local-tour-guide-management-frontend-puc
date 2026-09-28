/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { FiCreditCard } from 'react-icons/fi';

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
  onPaymentStart?: () => void;
}

export default function PaymentButton({
  bookingId,
  amount,
  onPaymentStart,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      onPaymentStart?.();

      // Initiate payment
      const response = await api.post('/payments/initiate', {
        bookingId,
        amount,
      });

      const { paymentUrl } = response.data.data;

      // Redirect to SSLCommerz payment page
      window.location.href = paymentUrl;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      isLoading={loading}
      size="lg"
      className="w-full"
    >
      <FiCreditCard className="mr-2" />
      {loading ? 'Processing...' : 'Pay Now'}
    </Button>
  );
}