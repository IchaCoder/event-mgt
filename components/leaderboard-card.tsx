'use client';

import { Card } from '@/components/ui/card';

interface LeaderboardCardProps {
  group: 'Cheetahs' | 'Rhinos';
  points: number;
  rank?: 'first' | 'second' | 'tied';
}

export function LeaderboardCard({ group, points, rank = 'tied' }: LeaderboardCardProps) {
  const isCheetahs = group === 'Cheetahs';
  const bgGradient = isCheetahs
    ? 'from-yellow-500/10 to-orange-500/10'
    : 'from-purple-500/10 to-pink-500/10';
  const borderColor = isCheetahs ? 'border-yellow-500/30' : 'border-purple-500/30';
  const textColor = isCheetahs ? 'text-yellow-500' : 'text-purple-500';
  const emoji = isCheetahs ? '🐆' : '🦏';

  let rankIcon = '';
  let rankText = '';
  if (rank === 'first') {
    rankIcon = '👑';
    rankText = 'Winning';
  } else if (rank === 'second') {
    rankIcon = '🥈';
    rankText = 'Second';
  } else {
    rankIcon = '⚖️';
    rankText = 'Tied';
  }

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} border-2 ${borderColor} p-8 h-full flex flex-col justify-between`}>
      <div className="absolute top-0 right-0 text-6xl opacity-20 select-none">
        {emoji}
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{rankIcon}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {rankText}
          </span>
        </div>
        <h3 className={`text-3xl font-bold ${textColor}`}>{group}</h3>
      </div>

      <div className="relative z-10">
        <p className="text-muted-foreground text-sm mb-1">Total Points</p>
        <p className={`text-5xl font-black ${textColor}`}>{points}</p>
      </div>
    </Card>
  );
}
