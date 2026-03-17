'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LeaderboardCard } from '@/components/leaderboard-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  EARLY_CLASSES,
  EARLY_EVENTS,
  EARLY_CONTESTANTS,
  EventResult,
  calculateTotalPoints,
} from '@/lib/data';

// We'll use URL state to persist results (in a real app, this would be a database)
// For now, we'll read from session storage if available
function useSharedResults() {
  const [results, setResults] = useState<(EventResult & { cheetahsPoints: number; rhinosPoints: number })[]>([]);

  // In a production app, you'd fetch this from a database or shared state management
  // For now, results are stored in the events page's component state
  return results;
}

export default function ResultsPage() {
  // Note: In a real application, this would read from shared state or a database
  // For this demo, results are managed on the events page and we'll show the interface
  const mockResults: (EventResult & { cheetahsPoints: number; rhinosPoints: number })[] = [];
  
  const totals = useMemo(() => {
    return calculateTotalPoints(mockResults, 'early');
  }, []);

  const getRankStatus = () => {
    if (totals.cheetahsTotal > totals.rhinosTotal) return { cheetahs: 'first', rhinos: 'second' };
    if (totals.rhinosTotal > totals.cheetahsTotal) return { cheetahs: 'second', rhinos: 'first' };
    return { cheetahs: 'tied', rhinos: 'tied' };
  };

  const ranks = getRankStatus() as { cheetahs: 'first' | 'second' | 'tied'; rhinos: 'first' | 'second' | 'tied' };

  // Get results by class
  const resultsByClass: { [key: string]: typeof mockResults } = {};
  EARLY_CLASSES.forEach(cls => {
    resultsByClass[cls.id] = mockResults.filter(r => r.className === cls.id);
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/early-classes" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-2">
              ← Back to Events
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Early Classes Results</h1>
            <p className="text-muted-foreground mt-1">Final leaderboard and detailed scores</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Final Leaderboard */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Final Standings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <LeaderboardCard
              group="Cheetahs"
              points={totals.cheetahsTotal}
              rank={ranks.cheetahs}
            />
            <LeaderboardCard
              group="Rhinos"
              points={totals.rhinosTotal}
              rank={ranks.rhinos}
            />
          </div>

          {/* Winner announcement */}
          {totals.cheetahsTotal !== totals.rhinosTotal && (
            <Card className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-foreground">
                  {totals.cheetahsTotal > totals.rhinosTotal ? 'Cheetahs' : 'Rhinos'} are winning!
                </p>
                <p className="text-muted-foreground">
                  Leading by {Math.abs(totals.cheetahsTotal - totals.rhinosTotal)} points
                </p>
              </div>
            </Card>
          )}
        </section>

        {/* Detailed Results by Class */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Results by Class</h2>

          <Tabs defaultValue="apple" className="w-full">
            <TabsList className="grid grid-cols-4 w-full bg-secondary">
              {EARLY_CLASSES.map(cls => (
                <TabsTrigger key={cls.id} value={cls.id} className="text-xs md:text-sm">
                  {cls.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {EARLY_CLASSES.map(cls => {
              const classEvents = EARLY_EVENTS.filter(e => e.className === cls.id);
              const classResults = resultsByClass[cls.id] || [];

              return (
                <TabsContent key={cls.id} value={cls.id} className="space-y-4 mt-4">
                  <Card className="p-4 bg-secondary/50 border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{cls.name} Class</h3>
                        <p className="text-sm text-muted-foreground">
                          {classResults.length} of {classEvents.length} events completed
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {classResults.length > 0 ? Math.round((classResults.length / classEvents.length) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">Complete</p>
                      </div>
                    </div>
                  </Card>

                  {classResults.length === 0 ? (
                    <Card className="p-8 text-center border-dashed bg-card">
                      <p className="text-muted-foreground">No results entered yet</p>
                      <Link href="/early-classes">
                        <Button className="mt-4" variant="outline">
                          Go to Events to Enter Results
                        </Button>
                      </Link>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {classResults.map(result => {
                        const firstContestant = EARLY_CONTESTANTS[cls.id]?.find(c => c.id === result.placements.first);
                        const secondContestant = EARLY_CONTESTANTS[cls.id]?.find(c => c.id === result.placements.second);
                        const thirdContestant = EARLY_CONTESTANTS[cls.id]?.find(c => c.id === result.placements.third);

                        return (
                          <Card key={result.eventId} className="p-4 bg-card border-border">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-semibold text-foreground">{result.eventName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Points Awarded</p>
                                <p className="font-bold">
                                  <span className="text-yellow-500">Cheetahs: {result.cheetahsPoints}</span>
                                  {' | '}
                                  <span className="text-purple-500">Rhinos: {result.rhinosPoints}</span>
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-border space-y-1">
                              <p className="text-sm">
                                <span className="text-muted-foreground">1st:</span>{' '}
                                <span className="font-semibold text-foreground">{firstContestant?.name}</span>
                                <span className={firstContestant?.group === 'Cheetahs' ? 'text-yellow-500' : 'text-purple-500'}>
                                  {' '}({firstContestant?.group}) - 6 pts
                                </span>
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">2nd:</span>{' '}
                                <span className="font-semibold text-foreground">{secondContestant?.name}</span>
                                <span className={secondContestant?.group === 'Cheetahs' ? 'text-yellow-500' : 'text-purple-500'}>
                                  {' '}({secondContestant?.group}) - 4 pts
                                </span>
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">3rd:</span>{' '}
                                <span className="font-semibold text-foreground">{thirdContestant?.name}</span>
                                <span className={thirdContestant?.group === 'Cheetahs' ? 'text-yellow-500' : 'text-purple-500'}>
                                  {' '}({thirdContestant?.group}) - 2 pts
                                </span>
                              </p>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </section>

        {/* Back to Events */}
        <div className="flex justify-center">
          <Link href="/early-classes">
            <Button variant="outline" size="lg">
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
