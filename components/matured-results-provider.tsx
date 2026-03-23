'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getCompetitionKey, type GenderCategory, type ScoredEventResult } from '@/lib/data';
import { fetchPersistedResults } from '@/lib/supabase/results';

interface MaturedResultsContextValue {
  results: ScoredEventResult[];
  upsertResult: (result: ScoredEventResult) => void;
  getResult: (eventId: string, gender: GenderCategory) => ScoredEventResult | undefined;
  clearResults: () => void;
}

const MaturedResultsContext = createContext<MaturedResultsContextValue | undefined>(undefined);

export function MaturedResultsProvider({ children }: { children: ReactNode }) {
  const [resultsByCompetition, setResultsByCompetition] = useState<Record<string, ScoredEventResult>>({});

  useEffect(() => {
    let isMounted = true;

    const hydrateResults = async () => {
      try {
        const persistedResults = await fetchPersistedResults('matured');
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
        console.error('Failed to hydrate matured results from database.', error);
      }
    };

    void hydrateResults();

    return () => {
      isMounted = false;
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

  return <MaturedResultsContext.Provider value={value}>{children}</MaturedResultsContext.Provider>;
}

export function useMaturedResults() {
  const context = useContext(MaturedResultsContext);
  if (!context) {
    throw new Error('useMaturedResults must be used within a MaturedResultsProvider');
  }
  return context;
}
