import { apiRequest } from "@/lib/queryClient";
import type { AuthUser, LoginRequest, RegisterRequest } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<{ user: AuthUser; token: string }> => {
    const response = await apiRequest("POST", `${API_BASE_URL}/login`, credentials);
    return response.json();
  },

  register: async (userData: RegisterRequest): Promise<{ user: AuthUser; token: string }> => {
    const response = await apiRequest("POST", `${API_BASE_URL}/register`, userData);
    return response.json();
  },

  me: async (): Promise<{ user: AuthUser }> => {
    const response = await apiRequest("GET", `${API_BASE_URL}/me`);
    return response.json();
  },
};

export const cardsApi = {
  getAll: async (page = 1, limit = 20) => {
    const response = await apiRequest("GET", `${API_BASE_URL}/cards?page=${page}&limit=${limit}`);
    return response.json();
  },

  getById: async (id: number) => {
    const response = await apiRequest("GET", `${API_BASE_URL}/cards/${id}`);
    return response.json();
  },
};

export const userCardsApi = {
  getMine: async () => {
    const response = await apiRequest("GET", `${API_BASE_URL}/me/cards`);
    return response.json();
  },

  add: async (cardData: { cardId: number; quantity?: number }) => {
    const response = await apiRequest("POST", `${API_BASE_URL}/me/cards`, cardData);
    return response.json();
  },
};

export const tradesApi = {
  getAll: async () => {
    const response = await apiRequest("GET", `${API_BASE_URL}/trades`);
    return response.json();
  },

  create: async (tradeData: {
    message?: string;
    offeredCards: { cardId: number; quantity: number }[];
    wantedCards: { cardId: number; quantity: number }[];
  }) => {
    const response = await apiRequest("POST", `${API_BASE_URL}/trades`, tradeData);
    return response.json();
  },

  delete: async (id: number) => {
    const response = await apiRequest("DELETE", `${API_BASE_URL}/trades/${id}`);
    return response.json();
  },
};
