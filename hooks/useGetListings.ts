import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Listing } from '@/types';

interface FiltersType {
  city?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}

export const useGetListings = (filters?: FiltersType) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const response = await api.get('/listings', { params: filters });
      return response.data.data as Listing[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  });
};