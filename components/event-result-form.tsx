'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculatePoints, type Contestant, type Event, type GenderCategory, type ScoredEventResult } from '@/lib/data';

interface EventResultFormProps {
  event: Event;
  gender: GenderCategory;
  contestants: Contestant[];
  existingResult?: ScoredEventResult;
  module?: 'early' | 'matured';
  allowTwoStudentMode?: boolean;
  onSubmit: (result: ScoredEventResult) => void;
}

export function EventResultForm({
  event,
  gender,
  contestants,
  existingResult,
  module = 'early',
  allowTwoStudentMode = true,
  onSubmit,
}: EventResultFormProps) {
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('');
  const [isTwoStudentMode, setIsTwoStudentMode] = useState(false);
  const [saveMessageVisible, setSaveMessageVisible] = useState(false);

  useEffect(() => {
    if (!existingResult) {
      setFirst('');
      setSecond('');
      setThird('');
      setIsTwoStudentMode(false);
      return;
    }

    setFirst(existingResult.placements.first);
    setSecond(existingResult.placements.second);
    setThird(existingResult.placements.third ?? '');
    setIsTwoStudentMode(allowTwoStudentMode ? !existingResult.placements.third : false);
  }, [allowTwoStudentMode, existingResult]);

  const handleSubmit = () => {
    const isTwoStudentActive = allowTwoStudentMode && isTwoStudentMode;
    const requiresThirdPlace = !isTwoStudentActive;

    if (!first || !second || (requiresThirdPlace && !third)) {
      alert(requiresThirdPlace ? 'Please select 1st, 2nd and 3rd place.' : 'Please select 1st and 2nd place.');
      return;
    }

    const selectedPlacements = [first, second, third].filter(Boolean);
    if (new Set(selectedPlacements).size !== selectedPlacements.length) {
      alert('Each contestant can only appear once in placements.');
      return;
    }

    if (isTwoStudentActive) {
      const firstContestant = contestants.find((contestant) => contestant.id === first);
      const secondContestant = contestants.find((contestant) => contestant.id === second);

      if (!firstContestant || !secondContestant || firstContestant.group === secondContestant.group) {
        alert('For 2-student competitions, select one Cheetahs contestant and one Rhinos contestant.');
        return;
      }
    }

    const normalizedThird = requiresThirdPlace ? third : undefined;
    const { cheetahsPoints, rhinosPoints } = calculatePoints(
      { first, second, third: normalizedThird },
      event.className,
      gender,
      module,
    );

    onSubmit({
      eventId: event.id,
      className: event.className,
      eventName: event.name,
      gender,
      placements: { first, second, third: normalizedThird },
      cheetahsPoints,
      rhinosPoints,
    });

    setSaveMessageVisible(true);
  };

  const genderLabel = gender === 'boys' ? 'Boys' : 'Girls';
  const isTwoStudentActive = allowTwoStudentMode && isTwoStudentMode;
  const canSubmit = isTwoStudentActive ? Boolean(first && second) : Boolean(first && second && third);

  const getGroupColor = (group: Contestant['group']) => (group === 'Cheetahs' ? 'text-amber-600' : 'text-slate-700');

  const getContestantLabel = (contestant: Contestant) => {
    return `${contestant.name} (${contestant.group})`;
  };

  return (
    <Card className="space-y-4 border-border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{genderLabel} Competition</h4>
        <p className="text-xs text-muted-foreground">
          {isTwoStudentActive ? '2 contestants (1 per team)' : '4 contestants (2 per team)'}
        </p>
      </div>

      {allowTwoStudentMode && (
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={isTwoStudentMode}
            onChange={(event) => {
              const nextMode = event.target.checked;
              setIsTwoStudentMode(nextMode);
              if (nextMode) {
                setThird('');
              }
            }}
          />
          Only 2 students competing (1 Cheetahs + 1 Rhinos)
        </label>
      )}

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

        {!isTwoStudentActive && (
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
        )}
      </div>

      <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full" size="sm">
        {existingResult ? 'Update Result' : 'Save Result'}
      </Button>

      {saveMessageVisible && <p className="text-xs text-emerald-600">Result saved. Team points updated.</p>}
    </Card>
  );
}
