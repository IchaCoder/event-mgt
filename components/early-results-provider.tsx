'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { getCompetitionKey, type GenderCategory, type ScoredEventResult } from '@/lib/data';

interface EarlyResultsContextValue {
  results: ScoredEventResult[];
  upsertResult: (result: ScoredEventResult) => void;
  getResult: (eventId: string, gender: GenderCategory) => ScoredEventResult | undefined;
  clearResults: () => void;
}

const EarlyResultsContext = createContext<EarlyResultsContextValue | undefined>(undefined);

export function EarlyResultsProvider({ children }: { children: ReactNode }) {
  const [resultsByCompetition, setResultsByCompetition] = useState<Record<string, ScoredEventResult>>({});

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
