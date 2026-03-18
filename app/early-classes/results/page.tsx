'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LeaderboardCard } from '@/components/leaderboard-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEarlyResults } from '@/components/early-results-provider';
import {
  EARLY_CLASSES,
  EARLY_EVENTS,
  calculateTotalPoints,
  getCompetitionCountForClass,
  getContestantById,
  type GenderCategory,
} from '@/lib/data';

const GENDERS: GenderCategory[] = ['boys', 'girls'];

export default function ResultsPage() {
  const { results } = useEarlyResults();

  const totals = useMemo(() => calculateTotalPoints(results), [results]);

  const ranks = useMemo(() => {
    if (totals.cheetahsTotal > totals.rhinosTotal) {
      return { cheetahs: 'first', rhinos: 'second' } as const;
    }
    if (totals.rhinosTotal > totals.cheetahsTotal) {
      return { cheetahs: 'second', rhinos: 'first' } as const;
    }
    return { cheetahs: 'tied', rhinos: 'tied' } as const;
  }, [totals.cheetahsTotal, totals.rhinosTotal]);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card p-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ecole Nursery Results Board</h1>
            <p className="mt-1 text-muted-foreground">Total scores from all completed boys and girls competitions</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 p-6">
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Team Standings</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <LeaderboardCard group="Cheetahs" points={totals.cheetahsTotal} rank={ranks.cheetahs} />
            <LeaderboardCard group="Rhinos" points={totals.rhinosTotal} rank={ranks.rhinos} />
          </div>

          {totals.cheetahsTotal !== totals.rhinosTotal && (
            <Card className="mt-6 border-primary/30 bg-linear-to-r from-primary/10 to-amber-100/40 p-6">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {totals.cheetahsTotal > totals.rhinosTotal ? 'Cheetahs' : 'Rhinos'} are currently leading
                </p>
                <p className="text-muted-foreground">
                  Advantage: {Math.abs(totals.cheetahsTotal - totals.rhinosTotal)} points
                </p>
              </div>
            </Card>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Detailed Results by Class</h2>

          <Tabs defaultValue="apple" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary">
              {EARLY_CLASSES.map((cls) => (
                <TabsTrigger key={cls.id} value={cls.id} className="text-xs md:text-sm">
                  {cls.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {EARLY_CLASSES.map((cls) => {
              const classEvents = EARLY_EVENTS.filter((event) => event.className === cls.id);
              const classResults = results.filter((result) => result.className === cls.id);
              const totalCompetitions = getCompetitionCountForClass(cls.id);

              return (
                <TabsContent key={cls.id} value={cls.id} className="mt-4 space-y-4">
                  <Card className="border-border bg-secondary/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{cls.name} Class</h3>
                        <p className="text-sm text-muted-foreground">
                          {classResults.length} of {totalCompetitions} competitions submitted
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {Math.round((classResults.length / totalCompetitions) * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Complete</p>
                      </div>
                    </div>
                  </Card>

                  {classResults.length === 0 ? (
                    <Card className="border-dashed p-8 text-center">
                      <p className="text-muted-foreground">No results entered yet for this class.</p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {classEvents.map((event) => (
                        <Card key={event.id} className="space-y-3 border-border p-4">
                          <h4 className="text-base font-bold text-foreground">{event.name}</h4>

                          <div className="grid gap-4 md:grid-cols-2">
                            {GENDERS.map((gender) => {
                              const result = classResults.find(
                                (entry) => entry.eventId === event.id && entry.gender === gender,
                              );

                              if (!result) {
                                return (
                                  <Card key={`${event.id}-${gender}`} className="border-dashed bg-background/60 p-3">
                                    <p className="text-sm font-semibold text-foreground capitalize">
                                      {gender} Competition
                                    </p>
                                    <p className="text-xs text-muted-foreground">No result submitted</p>
                                  </Card>
                                );
                              }

                              const first = getContestantById(cls.id, gender, result.placements.first);
                              const second = getContestantById(cls.id, gender, result.placements.second);
                              const third = getContestantById(cls.id, gender, result.placements.third);

                              return (
                                <Card key={`${event.id}-${gender}`} className="space-y-2 bg-card p-3">
                                  <p className="text-sm font-semibold text-foreground capitalize">
                                    {gender} Competition
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    1st: <span className="font-semibold text-foreground">{first?.group}</span>
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    2nd: <span className="font-semibold text-foreground">{second?.group}</span>
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    3rd:{' '}
                                    <span className="font-semibold text-foreground">
                                      {third?.group ?? 'Not used (2-student event)'}
                                    </span>
                                  </p>
                                  <p className="text-sm font-semibold text-foreground">
                                    Cheetahs: {result.cheetahsPoints} | Rhinos: {result.rhinosPoints}
                                  </p>
                                </Card>
                              );
                            })}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </section>
      </div>
    </main>
  );
}
