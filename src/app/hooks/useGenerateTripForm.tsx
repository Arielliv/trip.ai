import { useForm } from 'react-hook-form';

export interface GenerateTripFormData {
  whereTo: string;
  howLong: string;
  howMany: number;
  whatStyle: string;
}

export const useGenerateTripForm = () => {
  return useForm<GenerateTripFormData>();
};
