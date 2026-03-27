'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventResultForm } from '@/components/event-result-form';
import { LeaderboardCard } from '@/components/leaderboard-card';
import { useEarlyResults } from '@/components/early-results-provider';
import {
  EARLY_CLASSES,
  EARLY_EVENTS,
  calculateTotalPoints,
  getCompetitionCountForClass,
  getContestantById,
  getContestantsForCompetition,
  type GenderCategory,
  type ScoredEventResult,
} from '@/lib/data';

const GENDERS: GenderCategory[] = ['boys', 'girls'];

export default function EarlyClassesPage() {
  const { results, upsertResult, getResult } = useEarlyResults();
  const [editingCompetitionKey, setEditingCompetitionKey] = useState<string | null>(null);

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

  const handleResultSubmit = (result: ScoredEventResult) => {
    upsertResult(result);
  };

  const getEditingKey = (eventId: string, gender: GenderCategory) => `${eventId}-${gender}`;
  const formatContestant = (group?: string) => {
    if (!group) return 'N/A';
    return group;
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card p-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <Link
              href="/"
              className="mb-2 inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
            >
              ← Back to Modules
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Ecole Nursery Events Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Nursery and KG classes with boys and girls competitions</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 p-6">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Current Leaderboard</h2>
            <Link href="/early-classes/results">
              <Button variant="outline">View Full Results</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <LeaderboardCard group="Cheetahs" points={totals.cheetahsTotal} rank={ranks.cheetahs} />
            <LeaderboardCard group="Rhinos" points={totals.rhinosTotal} rank={ranks.rhinos} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Enter Event Results</h2>

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
              const completedCount = results.filter((result) => result.className === cls.id).length;
              const totalCompetitions = getCompetitionCountForClass(cls.id);

              return (
                <TabsContent key={cls.id} value={cls.id} className="mt-4 space-y-4">
                  <Card className="border-border bg-secondary/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{cls.name} Class</h3>
                        <p className="text-sm text-muted-foreground">
                          {completedCount} of {totalCompetitions} competitions completed
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {Math.round((completedCount / totalCompetitions) * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Complete</p>
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-4">
                    {classEvents.map((event) => (
                      <Card key={event.id} className="space-y-4 border-border p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-foreground">{event.name}</h4>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Boys + Girls</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {GENDERS.map((gender) => {
                            const competitionKey = getEditingKey(event.id, gender);
                            const existingResult = getResult(event.id, gender);
                            const contestants = getContestantsForCompetition(cls.id, gender, 'early', event.id);

                            if (!existingResult) {
                              return (
                                <EventResultForm
                                  key={competitionKey}
                                  event={event}
                                  gender={gender}
                                  contestants={contestants}
                                  onSubmit={handleResultSubmit}
                                />
                              );
                            }

                            const first = getContestantById(
                              cls.id,
                              gender,
                              existingResult.placements.first,
                              'early',
                              event.id,
                            );
                            const second = getContestantById(
                              cls.id,
                              gender,
                              existingResult.placements.second,
                              'early',
                              event.id,
                            );
                            const third = getContestantById(
                              cls.id,
                              gender,
                              existingResult.placements.third,
                              'early',
                              event.id,
                            );

                            return (
                              <Card key={competitionKey} className="space-y-3 border-border p-4">
                                <p className="text-sm font-semibold text-foreground capitalize">{gender} Competition</p>
                                <p className="text-sm text-muted-foreground">
                                  1st:{' '}
                                  <span className="font-semibold text-foreground">
                                    {formatContestant(first?.group)}
                                  </span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  2nd:{' '}
                                  <span className="font-semibold text-foreground">
                                    {formatContestant(second?.group)}
                                  </span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  3rd:{' '}
                                  <span className="font-semibold text-foreground">
                                    {third ? formatContestant(third.group) : 'Not recorded'}
                                  </span>
                                </p>
                                <p className="text-sm font-semibold text-foreground">
                                  Cheetahs: {existingResult.cheetahsPoints} | Rhinos: {existingResult.rhinosPoints}
                                </p>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => setEditingCompetitionKey(competitionKey)}
                                >
                                  Update Result
                                </Button>

                                <Dialog
                                  open={editingCompetitionKey === competitionKey}
                                  onOpenChange={(open) => setEditingCompetitionKey(open ? competitionKey : null)}
                                >
                                  <DialogContent className="max-w-xl">
                                    <DialogHeader>
                                      <DialogTitle>Update {event.name} Result</DialogTitle>
                                      <DialogDescription className="capitalize">{gender} competition</DialogDescription>
                                    </DialogHeader>

                                    <EventResultForm
                                      event={event}
                                      gender={gender}
                                      contestants={contestants}
                                      existingResult={existingResult}
                                      onSubmit={(result) => {
                                        handleResultSubmit(result);
                                        setEditingCompetitionKey(null);
                                      }}
                                    />
                                  </DialogContent>
                                </Dialog>
                              </Card>
                            );
                          })}
                        </div>
                      </Card>
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
