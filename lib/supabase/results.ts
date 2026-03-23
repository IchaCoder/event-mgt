import { createClient } from '@/lib/supabase/client';
import type { ScoredEventResult } from '@/lib/data';

type ModuleType = 'early' | 'matured';

export interface EventResultRow {
  event_id: string;
  class_name: string;
  event_name: string;
  gender: 'boys' | 'girls';
  first_contestant_id: string;
  second_contestant_id: string;
  third_contestant_id: string | null;
  cheetahs_points: number;
  rhinos_points: number;
}

export function mapEventResultRow(row: EventResultRow): ScoredEventResult {
  return {
    eventId: row.event_id,
    className: row.class_name,
    eventName: row.event_name,
    gender: row.gender,
    placements: {
      first: row.first_contestant_id,
      second: row.second_contestant_id,
      third: row.third_contestant_id ?? undefined,
    },
    cheetahsPoints: row.cheetahs_points,
    rhinosPoints: row.rhinos_points,
  };
}

export interface PersistEventResultInput {
  module: ModuleType;
  result: ScoredEventResult;
}

export async function fetchPersistedResults(module: ModuleType): Promise<ScoredEventResult[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('event_results')
    .select(
      'event_id,class_name,event_name,gender,first_contestant_id,second_contestant_id,third_contestant_id,cheetahs_points,rhinos_points',
    )
    .eq('module', module);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as EventResultRow[];

  return rows.map(mapEventResultRow);
}

export async function persistEventResult({ module, result }: PersistEventResultInput): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from('event_results').upsert(
    {
      module,
      event_id: result.eventId,
      class_name: result.className,
      event_name: result.eventName,
      gender: result.gender,
      first_contestant_id: result.placements.first,
      second_contestant_id: result.placements.second,
      third_contestant_id: result.placements.third ?? null,
      cheetahs_points: result.cheetahsPoints,
      rhinos_points: result.rhinosPoints,
    },
    {
      onConflict: 'module,event_id,gender',
    },
  );

  if (error) {
    throw new Error(error.message);
  }
}
