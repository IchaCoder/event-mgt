'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventResultForm } from '@/components/event-result-form';
import { LeaderboardCard } from '@/components/leaderboard-card';
import {
  EARLY_CLASSES,
  EARLY_EVENTS,
  EARLY_CONTESTANTS,
  EventResult,
  calculateTotalPoints,
} from '@/lib/data';

interface SubmittedResult extends EventResult {
  cheetahsPoints: number;
  rhinosPoints: number;
}

export default function EarlyClassesPage() {
  const [results, setResults] = useState<SubmittedResult[]>([]);

  const handleResultSubmit = (result: SubmittedResult) => {
    setResults(prev => {
      const existingIndex = prev.findIndex(
        r => r.eventId === result.eventId
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  const totals = useMemo(() => {
    return calculateTotalPoints(results, 'early');
  }, [results]);

  const getRankStatus = () => {
    if (totals.cheetahsTotal > totals.rhinosTotal) return { cheetahs: 'first', rhinos: 'second' };
    if (totals.rhinosTotal > totals.cheetahsTotal) return { cheetahs: 'second', rhinos: 'first' };
    return { cheetahs: 'tied', rhinos: 'tied' };
  };

  const ranks = getRankStatus() as { cheetahs: 'first' | 'second' | 'tied'; rhinos: 'first' | 'second' | 'tied' };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-2">
              ← Back to Modules
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Early Classes Sports Events</h1>
            <p className="text-muted-foreground mt-1">Apple, Emerald Green, Red, Yellow Classes</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Current Leaderboard</h2>
            <Link href="/early-classes/results">
              <Button variant="outline">View Full Results</Button>
            </Link>
          </div>
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
        </section>

        {/* Event Entry */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Enter Results</h2>
          <p className="text-muted-foreground">
            Submit event results for each class. Results update the leaderboard in real-time.
          </p>

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
              const submittedCount = results.filter(r => r.className === cls.id).length;

              return (
                <TabsContent key={cls.id} value={cls.id} className="space-y-4 mt-4">
                  <Card className="p-4 bg-secondary/50 border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{cls.name} Class</h3>
                        <p className="text-sm text-muted-foreground">
                          {submittedCount} of {classEvents.length} events completed
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {Math.round((submittedCount / classEvents.length) * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Complete</p>
                      </div>
                    </div>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-4">
                    {classEvents.map(event => (
                      <EventResultForm
                        key={event.id}
                        event={event}
                        contestants={EARLY_CONTESTANTS[cls.id]}
                        onSubmit={handleResultSubmit}
                      />
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </section>
      </div>
    </main>
  );
}
