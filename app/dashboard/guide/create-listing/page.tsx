/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import ImageUpload from '@/components/ui/ImageUploads';
import { getErrorMessage } from '@/lib/utils';

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    itinerary: '',
    tourFee: '',
    duration: '',
    meetingPoint: '',
    maxGroupSize: '',
    category: '',
    city: '',
    images: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagesUpload = (urls: string[]) => {
    setFormData({ ...formData, images: urls });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        tourFee: parseFloat(formData.tourFee),
        duration: parseInt(formData.duration),
        maxGroupSize: parseInt(formData.maxGroupSize),
      };

      await api.post('/listings', submitData);
      toast.success('Tour created successfully!');
      router.push('/dashboard/guide');
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">Create New Tour</h1>
            <p className="text-gray-600 mt-2">
              Fill in the details to create an amazing tour experience
            </p>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <Input
                    label="Tour Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Hidden Food Gems of Paris"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe what makes your tour special..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Itinerary
                    </label>
                    <textarea
                      name="itinerary"
                      value={formData.itinerary}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10:00 AM - Meet at location&#10;10:30 AM - First stop&#10;12:00 PM - Lunch break"
                    />
                  </div>
                </div>
              </div>

              {/* Tour Details */}
              <div>
                <h2 className="text-xl font-bold mb-4">Tour Details</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Price per Person ($)"
                    name="tourFee"
                    type="number"
                    value={formData.tourFee}
                    onChange={handleChange}
                    placeholder="89"
                    required
                  />

                  <Input
                    label="Duration (hours)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="5"
                    required
                  />

                  <Input
                    label="Max Group Size"
                    name="maxGroupSize"
                    type="number"
                    value={formData.maxGroupSize}
                    onChange={handleChange}
                    placeholder="8"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Food & Culinary">Food & Culinary</option>
                      <option value="Photography">Photography</option>
                      <option value="History & Culture">History & Culture</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Wine & Food">Wine & Food</option>
                      <option value="Art & Design">Art & Design</option>
                      <option value="City Tours">City Tours</option>
                      <option value="Nature & Wildlife">Nature & Wildlife</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-xl font-bold mb-4">Location</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Paris"
                    required
                  />

                  <Input
                    label="Meeting Point"
                    name="meetingPoint"
                    value={formData.meetingPoint}
                    onChange={handleChange}
                    placeholder="Notre Dame Cathedral, Main Entrance"
                    required
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <h2 className="text-xl font-bold mb-4">Tour Images</h2>
                <ImageUpload
                  onUploadComplete={handleImagesUpload}
                  maxImages={5}
                  existingImages={formData.images}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="flex-1"
                >
                  Create Tour
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
