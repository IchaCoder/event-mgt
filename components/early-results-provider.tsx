'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getCompetitionKey, type GenderCategory, type ScoredEventResult } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';
import { fetchPersistedResults, mapEventResultRow, type EventResultRow } from '@/lib/supabase/results';

interface RealtimeResultPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Record<string, unknown>;
  old: Record<string, unknown>;
}

interface EarlyResultsContextValue {
  results: ScoredEventResult[];
  upsertResult: (result: ScoredEventResult) => void;
  getResult: (eventId: string, gender: GenderCategory) => ScoredEventResult | undefined;
  clearResults: () => void;
}

const EarlyResultsContext = createContext<EarlyResultsContextValue | undefined>(undefined);

export function EarlyResultsProvider({ children }: { children: ReactNode }) {
  const [resultsByCompetition, setResultsByCompetition] = useState<Record<string, ScoredEventResult>>({});

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const hydrateResults = async () => {
      try {
        const persistedResults = await fetchPersistedResults('early');
        if (!isMounted) return;

        const persistedByCompetition = persistedResults.reduce<Record<string, ScoredEventResult>>((acc, result) => {
          acc[getCompetitionKey(result.eventId, result.gender)] = result;
          return acc;
        }, {});

        setResultsByCompetition((prev) => ({
          ...persistedByCompetition,
          ...prev,
        }));
      } catch (error) {
        console.error('Failed to hydrate early results from database.', error);
      }
    };

    const handleRealtimeResult = (payload: RealtimeResultPayload) => {
      if (!isMounted) return;

      switch (payload.eventType) {
        case 'DELETE': {
          const oldRow = payload.old as unknown as EventResultRow;
          const competitionKey = getCompetitionKey(oldRow.event_id, oldRow.gender);
          setResultsByCompetition((prev) => {
            if (!prev[competitionKey]) return prev;
            const { [competitionKey]: _removed, ...rest } = prev;
            return rest;
          });
          return;
        }
        case 'INSERT':
        case 'UPDATE': {
          const newRow = payload.new as unknown as EventResultRow;
          const mappedResult = mapEventResultRow(newRow);
          const competitionKey = getCompetitionKey(mappedResult.eventId, mappedResult.gender);

          setResultsByCompetition((prev) => ({
            ...prev,
            [competitionKey]: mappedResult,
          }));
          return;
        }
        default:
          return;
      }
    };

    const channel = supabase
      .channel('event_results:early')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_results',
          filter: 'module=eq.early',
        },
        handleRealtimeResult,
      )
      .subscribe();

    void hydrateResults();

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const upsertResult = useCallback((result: ScoredEventResult) => {
    const competitionKey = getCompetitionKey(result.eventId, result.gender);
    setResultsByCompetition((prev) => ({
      ...prev,
      [competitionKey]: result,
    }));
  }, []);

  const getResult = useCallback(
    (eventId: string, gender: GenderCategory) => {
      return resultsByCompetition[getCompetitionKey(eventId, gender)];
    },
    [resultsByCompetition],
  );

  const clearResults = useCallback(() => {
    setResultsByCompetition({});
  }, []);

  const value = useMemo(
    () => ({
      results: Object.values(resultsByCompetition),
      upsertResult,
      getResult,
      clearResults,
    }),
    [clearResults, getResult, resultsByCompetition, upsertResult],
  );

  return <EarlyResultsContext.Provider value={value}>{children}</EarlyResultsContext.Provider>;
}

export function useEarlyResults() {
  const context = useContext(EarlyResultsContext);
  if (!context) {
    throw new Error('useEarlyResults must be used within an EarlyResultsProvider');
  }
  return context;
}
