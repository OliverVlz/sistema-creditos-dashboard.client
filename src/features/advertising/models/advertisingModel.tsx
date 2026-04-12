export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  imageKey: string;
  targetUrl?: string;
  isRedirectEnabled: boolean;
  isActive: boolean;
  sortOrder: number;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertisingFilters {
  terms?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface AdvertisingPayload {
  title: string;
  targetUrl: string;
  isRedirectEnabled: boolean;
  isActive: boolean;
  sortOrder: number;
  startsAt: string;
  endsAt: string;
  image?: File;
}

export interface UpdateAdvertisingPayload extends Partial<AdvertisingPayload> {
  id: string;
}
