'use client';

import { useState, useCallback } from 'react';
import type { RSVPResponse, RSVPStatus } from '@/types';

interface RSVPFormData {
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  status: RSVPStatus;
  companions: number;
  companion_names?: string[];
  dietary_restrictions?: string[];
  custom_answers?: Record<string, string | string[] | boolean>;
  message?: string;
}

interface UseRSVPOptions {
  invitation_id: string;
  onSuccess?: (response: RSVPResponse) => void;
  onError?: (error: Error) => void;
}

interface UseRSVPReturn {
  submitRSVP: (data: RSVPFormData) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  response: RSVPResponse | null;
  reset: () => void;
}

export function useRSVP(options: UseRSVPOptions): UseRSVPReturn {
  const { invitation_id, onSuccess, onError } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<RSVPResponse | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setResponse(null);
  }, []);

  const submitRSVP = useCallback(
    async (data: RSVPFormData) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const rsvpResponse: RSVPResponse = {
          id: `rsvp_${Date.now()}`,
          invitation_id,
          guest_name: data.guest_name,
          guest_email: data.guest_email,
          guest_phone: data.guest_phone,
          status: data.status,
          companions: data.companions,
          companion_names: data.companion_names,
          dietary_restrictions: data.dietary_restrictions,
          custom_answers: data.custom_answers,
          message: data.message,
          submitted_at: new Date().toISOString(),
        };

        // TODO: Integrar con Supabase
        // const { data: savedResponse, error: dbError } = await supabase
        //   .from('rsvp_responses')
        //   .insert(rsvpResponse)
        //   .select()
        //   .single();

        // Simulación de delay de red
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setResponse(rsvpResponse);
        setIsSuccess(true);
        onSuccess?.(rsvpResponse);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Error al enviar RSVP');
        setError(errorObj);
        setIsError(true);
        onError?.(errorObj);
      } finally {
        setIsLoading(false);
      }
    },
    [invitation_id, onSuccess, onError]
  );

  return {
    submitRSVP,
    isLoading,
    isSuccess,
    isError,
    error,
    response,
    reset,
  };
}
