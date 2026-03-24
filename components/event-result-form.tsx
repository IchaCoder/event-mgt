'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculatePoints, type Contestant, type Event, type GenderCategory, type ScoredEventResult } from '@/lib/data';
import { persistEventResult } from '@/lib/supabase/results';

interface EventResultFormProps {
  event: Event;
  gender: GenderCategory;
  contestants: Contestant[];
  existingResult?: ScoredEventResult;
  module?: 'early' | 'matured';
  onSubmit: (result: ScoredEventResult) => void | Promise<void>;
}

export function EventResultForm({
  event,
  gender,
  contestants,
  existingResult,
  module = 'early',
  onSubmit,
}: EventResultFormProps) {
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('');
  const [saveMessageVisible, setSaveMessageVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!existingResult) {
      setFirst('');
      setSecond('');
      setThird('');
      return;
    }

    setFirst(existingResult.placements.first);
    setSecond(existingResult.placements.second);
    setThird(existingResult.placements.third ?? '');
  }, [existingResult]);

  const handleSubmit = async () => {
    if (!first || !second || !third) {
      alert('Please select 1st, 2nd and 3rd place.');
      return;
    }

    const selectedPlacements = [first, second, third].filter(Boolean);
    if (new Set(selectedPlacements).size !== selectedPlacements.length) {
      alert('Each contestant can only appear once in placements.');
      return;
    }

    const { cheetahsPoints, rhinosPoints } = calculatePoints(
      { first, second, third },
      event.className,
      gender,
      module,
      event.id,
    );

    const scoredResult: ScoredEventResult = {
      eventId: event.id,
      className: event.className,
      eventName: event.name,
      gender,
      placements: { first, second, third },
      cheetahsPoints,
      rhinosPoints,
    };

    setIsSaving(true);
    try {
      await persistEventResult({ module, result: scoredResult });
      await onSubmit(scoredResult);
      setSaveMessageVisible(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save result to the database.';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const genderLabel = gender === 'boys' ? 'Boys' : 'Girls';
  const canSubmit = Boolean(first && second && third);
  const contestantsPerGroup = contestants.length / 2;

  const getGroupColor = (group: Contestant['group']) => (group === 'Cheetahs' ? 'text-amber-600' : 'text-slate-700');

  const getContestantLabel = (contestant: Contestant) => {
    return contestant.group;
  };

  return (
    <Card className="space-y-4 border-border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{genderLabel} Competition</h4>
        <p className="text-xs text-muted-foreground">
          {contestants.length} contestants ({contestantsPerGroup} per team)
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">1st Place</label>
          <Select value={first} onValueChange={setFirst}>
            <SelectTrigger className="bg-input text-foreground">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {contestants.map((contestant) => (
                <SelectItem key={contestant.id} className="hover:bg-gray-200!" value={contestant.id}>
                  <span className={`${getGroupColor(contestant.group)}`}>{getContestantLabel(contestant)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">2nd Place</label>
          <Select value={second} onValueChange={setSecond}>
            <SelectTrigger className="bg-input text-foreground">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {contestants
                .filter((contestant) => contestant.id !== first)
                .map((contestant) => (
                  <SelectItem key={contestant.id} value={contestant.id} className="hover:bg-gray-200!">
                    <span className={getGroupColor(contestant.group)}>{getContestantLabel(contestant)}</span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">3rd Place</label>
          <Select value={third} onValueChange={setThird}>
            <SelectTrigger className="bg-input text-foreground">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {contestants
                .filter((contestant) => contestant.id !== first && contestant.id !== second)
                .map((contestant) => (
                  <SelectItem key={contestant.id} value={contestant.id} className="hover:bg-gray-200!">
                    <span className={getGroupColor(contestant.group)}>{getContestantLabel(contestant)}</span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={!canSubmit || isSaving} className="w-full" size="sm">
        {isSaving ? 'Saving...' : existingResult ? 'Update Result' : 'Save Result'}
      </Button>

      {saveMessageVisible && <p className="text-xs text-emerald-600">Result saved. Team points updated.</p>}
    </Card>
  );
}
