'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface LeaderboardCardProps {
  group: 'Cheetahs' | 'Rhinos';
  points: number;
  rank?: 'first' | 'second' | 'tied';
}

export function LeaderboardCard({ group, points, rank = 'tied' }: LeaderboardCardProps) {
  const isCheetahs = group === 'Cheetahs';
  const logoSrc = isCheetahs ? '/teams/cheetahs.png' : '/teams/rhinos.png';
  const accentClass = isCheetahs ? 'text-amber-600' : 'text-orange-700';
  const borderClass = isCheetahs ? 'border-amber-200' : 'border-orange-200';
  const backgroundClass = isCheetahs
    ? 'from-amber-50 via-white to-amber-100'
    : 'from-orange-50 via-white to-orange-100';

  const rankLabel = rank === 'first' ? 'Leading' : rank === 'second' ? 'Runner-up' : 'Level Score';

  return (
    <Card className={`border-2 ${borderClass} bg-linear-to-br ${backgroundClass} h-full overflow-hidden p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{rankLabel}</p>
          <h3 className={`text-3xl font-black ${accentClass}`}>{group}</h3>
          <p className="text-sm text-muted-foreground">Total Points</p>
          <p className={`text-5xl font-black ${accentClass}`}>{points}</p>
        </div>

        <div className="rounded-xl bg-white/85 p-2 shadow-sm">
          <Image
            src={logoSrc}
            alt={`${group} logo`}
            width={110}
            height={110}
            className="h-20 w-20 object-contain md:h-24 md:w-24"
            priority
          />
        </div>
      </div>
    </Card>
  );
}
