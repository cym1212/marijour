import { useState, useCallback } from 'react';
import { LoginCredentials, LoginResponse } from '../types';

interface UseLoginLogicReturn {
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLoginLogic = (): UseLoginLogicReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    isLoading,
    error,
    clearError,
    setLoading,
    setError,
  };
};