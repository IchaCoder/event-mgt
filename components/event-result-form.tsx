'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Event, Contestant, EventResult, calculatePoints } from '@/lib/data';

interface EventResultFormProps {
  event: Event;
  contestants: Contestant[];
  onSubmit: (result: EventResult & { cheetahsPoints: number; rhinosPoints: number }) => void;
}

export function EventResultForm({ event, contestants, onSubmit }: EventResultFormProps) {
  const [first, setFirst] = useState<string>('');
  const [second, setSecond] = useState<string>('');
  const [third, setThird] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!first || !second || !third) {
      alert('Please select all three placements');
      return;
    }

    if (new Set([first, second, third]).size !== 3) {
      alert('Each contestant can only place once');
      return;
    }

    const { cheetahsPoints, rhinosPoints } = calculatePoints(
      { first, second, third },
      event.className
    );

    onSubmit({
      eventId: event.id,
      className: event.className,
      eventName: event.name,
      placements: { first, second, third },
      cheetahsPoints,
      rhinosPoints,
    });

    setSubmitted(true);
    setFirst('');
    setSecond('');
    setThird('');
  };

  const availableContestants = contestants.filter(c => 
    c.id !== first && c.id !== second && c.id !== third
  );

  const getContestantColor = (groupName: string) => {
    return groupName === 'Cheetahs' ? 'text-yellow-500' : 'text-purple-500';
  };

  if (submitted) {
    const { cheetahsPoints, rhinosPoints } = calculatePoints(
      { first, second, third },
      event.className
    );
    const cheetahsName = contestants.find(c => c.id === first)?.name || '';
    const rhinosName = contestants.find(c => c.id === second)?.name || '';

    return (
      <Card className="p-4 bg-card border-green-500/30">
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">{event.name}</h4>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">
              1st: <span className="text-foreground">{contestants.find(c => c.id === first)?.name}</span>
            </p>
            <p className="text-muted-foreground">
              Points: Cheetahs <span className="text-yellow-500 font-bold">{cheetahsPoints}</span> | Rhinos <span className="text-purple-500 font-bold">{rhinosPoints}</span>
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSubmitted(false)}
            className="mt-2"
          >
            Edit
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-card border-border">
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground text-sm">{event.name}</h4>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">1st Place</label>
            <Select value={first} onValueChange={setFirst}>
              <SelectTrigger className="bg-input text-foreground">
                <SelectValue placeholder="Select contestant" />
              </SelectTrigger>
              <SelectContent>
                {contestants.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} <span className={`ml-2 ${getContestantColor(c.group)}`}>({c.group})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">2nd Place</label>
            <Select value={second} onValueChange={setSecond}>
              <SelectTrigger className="bg-input text-foreground">
                <SelectValue placeholder="Select contestant" />
              </SelectTrigger>
              <SelectContent>
                {contestants.filter(c => c.id !== first).map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} <span className={`ml-2 ${getContestantColor(c.group)}`}>({c.group})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">3rd Place</label>
            <Select value={third} onValueChange={setThird}>
              <SelectTrigger className="bg-input text-foreground">
                <SelectValue placeholder="Select contestant" />
              </SelectTrigger>
              <SelectContent>
                {contestants.filter(c => c.id !== first && c.id !== second).map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} <span className={`ml-2 ${getContestantColor(c.group)}`}>({c.group})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!first || !second || !third}
          className="w-full"
          size="sm"
        >
          Submit Result
        </Button>
      </div>
    </Card>
  );
}
