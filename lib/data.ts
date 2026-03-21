export type TeamName = 'Cheetahs' | 'Rhinos';
export type GenderCategory = 'boys' | 'girls';

export interface Contestant {
  id: string;
  name: string;
  group: TeamName;
}

export interface Event {
  id: string;
  name: string;
  className: string;
}

export interface Class {
  id: string;
  name: string;
  module: 'early' | 'matured';
}

export interface EventResult {
  eventId: string;
  className: string;
  eventName: string;
  gender: GenderCategory;
  placements: {
    first: string;
    second: string;
    third?: string;
  };
}

export interface ScoredEventResult extends EventResult {
  cheetahsPoints: number;
  rhinosPoints: number;
}

export const EARLY_CLASSES: Class[] = [
  { id: 'apple', name: 'Apple', module: 'early' },
  { id: 'emerald', name: 'Emerald Green', module: 'early' },
  { id: 'red', name: 'Red', module: 'early' },
  { id: 'yellow', name: 'Yellow', module: 'early' },
];

export const MATURED_CLASSES: Class[] = [
  { id: 'year-1', name: 'Year 1', module: 'matured' },
  { id: 'year-2', name: 'Year 2', module: 'matured' },
  { id: 'year-3', name: 'Year 3', module: 'matured' },
  { id: 'year-4', name: 'Year 4', module: 'matured' },
  { id: 'year-5', name: 'Year 5', module: 'matured' },
  { id: 'year-6', name: 'Year 6', module: 'matured' },
  { id: 'lower-primary', name: 'Lower Primary', module: 'matured' },
  { id: 'upper-primary', name: 'Upper Primary', module: 'matured' },
  { id: 'secondary', name: 'Secondary', module: 'matured' },
];

const MATURED_DASH_CLASSES = ['year-1', 'year-2', 'year-3', 'year-4', 'year-5', 'year-6', 'secondary'] as const;
const MATURED_CAPTURE_CLASSES = ['year-1', 'year-2', 'year-3', 'year-4', 'year-5', 'year-6', 'secondary'] as const;
const MATURED_RELAY_CLASSES = ['upper-primary', 'lower-primary', 'secondary'] as const;

export const MATURED_EVENTS: Event[] = [
  ...MATURED_DASH_CLASSES.map((className) => ({
    id: `${className}-50m-dash`,
    name: '50m Dash',
    className,
  })),
  ...MATURED_CAPTURE_CLASSES.map((className) => ({
    id: `${className}-capture-the-ball`,
    name: 'Capture the Ball',
    className,
  })),
  ...MATURED_RELAY_CLASSES.map((className) => ({
    id: `${className}-4x50m-relay`,
    name: '4 x 50m Relay',
    className,
  })),
];

export const EARLY_EVENTS: Event[] = [
  { id: 'apple-ball-race', name: 'Ball Race', className: 'apple' },

  { id: 'emerald-hoop-pulling', name: 'Hoop Pulling', className: 'emerald' },
  { id: 'emerald-20m-dash', name: '20m Dash', className: 'emerald' },
  { id: 'emerald-football-shooting', name: 'Football Shooting', className: 'emerald' },

  { id: 'red-hoop-pulling', name: 'Hoop Pulling', className: 'red' },
  { id: 'red-ice-cream-race', name: 'Ice Cream Race', className: 'red' },
  { id: 'red-20m-dash', name: '20m Dash', className: 'red' },
  { id: 'red-football-shooting', name: 'Football Shooting', className: 'red' },

  { id: 'yellow-hoop-pulling', name: 'Hoop Pulling', className: 'yellow' },
  { id: 'yellow-ice-cream-race', name: 'Ice Cream Race', className: 'yellow' },
  { id: 'yellow-20m-dash', name: '20m Dash', className: 'yellow' },
  { id: 'yellow-football-shooting', name: 'Football Shooting', className: 'yellow' },
];

const DEFAULT_CONTESTANT_NAMES: Record<GenderCategory, Record<TeamName, [string, string]>> = {
  boys: {
    Cheetahs: ['Ethan', 'Liam'],
    Rhinos: ['Noah', 'Mason'],
  },
  girls: {
    Cheetahs: ['Ava', 'Mia'],
    Rhinos: ['Zoe', 'Ella'],
  },
};

const CONTESTANT_NAMES_BY_CLASS: Record<string, Record<GenderCategory, Record<TeamName, [string, string]>>> = {
  apple: {
    boys: { Cheetahs: ['Ethan', 'Luca'], Rhinos: ['Noah', 'Kai'] },
    girls: { Cheetahs: ['Ava', 'Mila'], Rhinos: ['Zoe', 'Nia'] },
  },
  emerald: {
    boys: { Cheetahs: ['Caleb', 'Milo'], Rhinos: ['Owen', 'Jude'] },
    girls: { Cheetahs: ['Layla', 'Aria'], Rhinos: ['Nora', 'Ivy'] },
  },
  red: {
    boys: { Cheetahs: ['Ryan', 'Zane'], Rhinos: ['Isaac', 'Leo'] },
    girls: { Cheetahs: ['Chloe', 'Ruby'], Rhinos: ['Hazel', 'Esme'] },
  },
  yellow: {
    boys: { Cheetahs: ['Adam', 'Ben'], Rhinos: ['Joel', 'Seth'] },
    girls: { Cheetahs: ['Luna', 'Maya'], Rhinos: ['Elsie', 'Skye'] },
  },
  'year-1': {
    boys: { Cheetahs: ['Aiden', 'Tyler'], Rhinos: ['Blake', 'Cole'] },
    girls: { Cheetahs: ['Emma', 'Sara'], Rhinos: ['Leah', 'Nina'] },
  },
  'year-2': {
    boys: { Cheetahs: ['Daniel', 'Victor'], Rhinos: ['Peter', 'Simon'] },
    girls: { Cheetahs: ['Hannah', 'Grace'], Rhinos: ['Daisy', 'Freya'] },
  },
  'year-3': {
    boys: { Cheetahs: ['Brandon', 'Julian'], Rhinos: ['Trevor', 'Marcus'] },
    girls: { Cheetahs: ['Clara', 'Naomi'], Rhinos: ['Mabel', 'Jade'] },
  },
  'year-4': {
    boys: { Cheetahs: ['Xavier', 'Adrian'], Rhinos: ['Damian', 'Kevin'] },
    girls: { Cheetahs: ['Sophie', 'Elena'], Rhinos: ['Bianca', 'Kira'] },
  },
  'year-5': {
    boys: { Cheetahs: ['Nathan', 'Gavin'], Rhinos: ['Tristan', 'Felix'] },
    girls: { Cheetahs: ['Ariel', 'Tessa'], Rhinos: ['Lydia', 'Rhea'] },
  },
  'year-6': {
    boys: { Cheetahs: ['Connor', 'Hudson'], Rhinos: ['Derek', 'Jonas'] },
    girls: { Cheetahs: ['Phoebe', 'Iris'], Rhinos: ['Nyla', 'Selah'] },
  },
  'lower-primary': {
    boys: { Cheetahs: ['Micah', 'Eli'], Rhinos: ['Riley', 'Otis'] },
    girls: { Cheetahs: ['Piper', 'Aaliyah'], Rhinos: ['Talia', 'Keira'] },
  },
  'upper-primary': {
    boys: { Cheetahs: ['Preston', 'Rowan'], Rhinos: ['Harvey', 'Quentin'] },
    girls: { Cheetahs: ['Amara', 'Bella'], Rhinos: ['Kiara', 'Sienna'] },
  },
  secondary: {
    boys: { Cheetahs: ['Zachary', 'Ian'], Rhinos: ['Roman', 'Calvin'] },
    girls: { Cheetahs: ['Jasmine', 'Olivia'], Rhinos: ['Camila', 'Violet'] },
  },
};

function createCompetitionContestants(className: string, gender: GenderCategory): Contestant[] {
  const namesByGroupAndGender = CONTESTANT_NAMES_BY_CLASS[className] ?? DEFAULT_CONTESTANT_NAMES;
  const names = namesByGroupAndGender[gender];

  return [
    { id: `${className}-${gender}-cheetahs-1`, name: names.Cheetahs[0], group: 'Cheetahs' },
    { id: `${className}-${gender}-cheetahs-2`, name: names.Cheetahs[1], group: 'Cheetahs' },
    { id: `${className}-${gender}-rhinos-1`, name: names.Rhinos[0], group: 'Rhinos' },
    { id: `${className}-${gender}-rhinos-2`, name: names.Rhinos[1], group: 'Rhinos' },
  ];
}

export const EARLY_CONTESTANTS: Record<string, Record<GenderCategory, Contestant[]>> = {
  apple: {
    boys: createCompetitionContestants('apple', 'boys'),
    girls: createCompetitionContestants('apple', 'girls'),
  },
  emerald: {
    boys: createCompetitionContestants('emerald', 'boys'),
    girls: createCompetitionContestants('emerald', 'girls'),
  },
  red: {
    boys: createCompetitionContestants('red', 'boys'),
    girls: createCompetitionContestants('red', 'girls'),
  },
  yellow: {
    boys: createCompetitionContestants('yellow', 'boys'),
    girls: createCompetitionContestants('yellow', 'girls'),
  },
};

const maturedClassIds = MATURED_CLASSES.map((cls) => cls.id);

export const MATURED_CONTESTANTS: Record<string, Record<GenderCategory, Contestant[]>> = Object.fromEntries(
  maturedClassIds.map((classId) => [
    classId,
    {
      boys: createCompetitionContestants(classId, 'boys'),
      girls: createCompetitionContestants(classId, 'girls'),
    },
  ]),
) as Record<string, Record<GenderCategory, Contestant[]>>;

export const POINTS_FOR_PLACEMENT = {
  first: 6,
  second: 4,
  third: 2,
} as const;

export function getClassById(classId: string, module: 'early' | 'matured' = 'early'): Class | undefined {
  const classes = module === 'early' ? EARLY_CLASSES : MATURED_CLASSES;
  return classes.find((cls) => cls.id === classId);
}

export function getCompetitionKey(eventId: string, gender: GenderCategory): string {
  return `${eventId}-${gender}`;
}

export function getContestantsForCompetition(
  classId: string,
  gender: GenderCategory,
  module: 'early' | 'matured' = 'early',
): Contestant[] {
  const contestantMap = module === 'early' ? EARLY_CONTESTANTS : MATURED_CONTESTANTS;
  return contestantMap[classId]?.[gender] ?? [];
}

export function getContestantById(
  classId: string,
  gender: GenderCategory,
  contestantId?: string,
  module: 'early' | 'matured' = 'early',
): Contestant | undefined {
  if (!contestantId) {
    return undefined;
  }

  return getContestantsForCompetition(classId, gender, module).find((contestant) => contestant.id === contestantId);
}

export function calculatePoints(
  placements: { first: string; second: string; third?: string },
  classId: string,
  gender: GenderCategory,
  module: 'early' | 'matured' = 'early',
): { cheetahsPoints: number; rhinosPoints: number } {
  const contestants = getContestantsForCompetition(classId, gender, module);
  const firstContestant = contestants.find((contestant) => contestant.id === placements.first);
  const secondContestant = contestants.find((contestant) => contestant.id === placements.second);
  const thirdContestant = placements.third
    ? contestants.find((contestant) => contestant.id === placements.third)
    : undefined;

  let cheetahsPoints = 0;
  let rhinosPoints = 0;

  if (firstContestant?.group === 'Cheetahs') cheetahsPoints += POINTS_FOR_PLACEMENT.first;
  if (firstContestant?.group === 'Rhinos') rhinosPoints += POINTS_FOR_PLACEMENT.first;

  if (secondContestant?.group === 'Cheetahs') cheetahsPoints += POINTS_FOR_PLACEMENT.second;
  if (secondContestant?.group === 'Rhinos') rhinosPoints += POINTS_FOR_PLACEMENT.second;

  if (thirdContestant?.group === 'Cheetahs') cheetahsPoints += POINTS_FOR_PLACEMENT.third;
  if (thirdContestant?.group === 'Rhinos') rhinosPoints += POINTS_FOR_PLACEMENT.third;

  return { cheetahsPoints, rhinosPoints };
}

export function calculateTotalPoints(results: ScoredEventResult[]): {
  cheetahsTotal: number;
  rhinosTotal: number;
} {
  return results.reduce(
    (totals, result) => {
      totals.cheetahsTotal += result.cheetahsPoints;
      totals.rhinosTotal += result.rhinosPoints;
      return totals;
    },
    { cheetahsTotal: 0, rhinosTotal: 0 },
  );
}

export function getCompetitionCountForClass(classId: string, module: 'early' | 'matured' = 'early'): number {
  const events = module === 'early' ? EARLY_EVENTS : MATURED_EVENTS;
  const eventCount = events.filter((event) => event.className === classId).length;
  return eventCount * 2;
}
