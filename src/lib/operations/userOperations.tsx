import { UsersPaginationResponse } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/dist/server/web/spec-extension/unstable-no-store';
import axios from 'axios';

export async function fetchUsers(page: number, limit: number = 10): Promise<UsersPaginationResponse> {
  noStore();
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    params: {
      page: page,
      limit: limit,
    },
  });

  return res.data as UsersPaginationResponse;
}
