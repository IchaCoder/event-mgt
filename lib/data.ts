// Data types for the sports event management system

export interface Contestant {
  id: string;
  name: string;
  group: 'Cheetahs' | 'Rhinos';
}

export interface EventResult {
  eventId: string;
  className: string;
  eventName: string;
  placements: {
    first: string; // contestant id
    second: string; // contestant id
    third: string; // contestant id
  };
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
  color: string;
}

// Early classes
export const EARLY_CLASSES: Class[] = [
  { id: 'apple', name: 'Apple', module: 'early', color: 'from-red-500 to-red-600' },
  { id: 'emerald', name: 'Emerald Green', module: 'early', color: 'from-emerald-500 to-emerald-600' },
  { id: 'red', name: 'Red', module: 'early', color: 'from-rose-500 to-rose-600' },
  { id: 'yellow', name: 'Yellow', module: 'early', color: 'from-yellow-400 to-yellow-500' },
];

// Matured classes
export const MATURED_CLASSES: Class[] = [
  { id: 'primary', name: 'Primary', module: 'matured', color: 'from-blue-500 to-blue-600' },
  { id: 'secondary', name: 'Secondary', module: 'matured', color: 'from-purple-500 to-purple-600' },
];

// Events for each early class
export const EARLY_EVENTS: Event[] = [
  // Apple class events
  { id: 'apple-100m', name: '100m Sprint', className: 'apple' },
  { id: 'apple-relay', name: '4x100m Relay', className: 'apple' },
  { id: 'apple-jump', name: 'Long Jump', className: 'apple' },
  { id: 'apple-throw', name: 'Shot Put', className: 'apple' },
  
  // Emerald Green class events
  { id: 'emerald-100m', name: '100m Sprint', className: 'emerald' },
  { id: 'emerald-relay', name: '4x100m Relay', className: 'emerald' },
  { id: 'emerald-jump', name: 'Long Jump', className: 'emerald' },
  { id: 'emerald-throw', name: 'Shot Put', className: 'emerald' },
  
  // Red class events
  { id: 'red-100m', name: '100m Sprint', className: 'red' },
  { id: 'red-relay', name: '4x100m Relay', className: 'red' },
  { id: 'red-jump', name: 'Long Jump', className: 'red' },
  { id: 'red-throw', name: 'Shot Put', className: 'red' },
  
  // Yellow class events
  { id: 'yellow-100m', name: '100m Sprint', className: 'yellow' },
  { id: 'yellow-relay', name: '4x100m Relay', className: 'yellow' },
  { id: 'yellow-jump', name: 'Long Jump', className: 'yellow' },
  { id: 'yellow-throw', name: 'Shot Put', className: 'yellow' },
];

// Generate sample contestants for early classes
function generateContestants(className: string): Contestant[] {
  const firstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Cameron', 'Parker'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  const contestants: Contestant[] = [];
  let groupIndex = 0;
  
  for (let i = 0; i < 8; i++) {
    contestants.push({
      id: `${className}-contestant-${i}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length)]}`,
      group: groupIndex % 2 === 0 ? 'Cheetahs' : 'Rhinos',
    });
    groupIndex++;
  }
  
  return contestants;
}

// All contestants for early classes
export const EARLY_CONTESTANTS: { [key: string]: Contestant[] } = {
  apple: generateContestants('apple'),
  emerald: generateContestants('emerald'),
  red: generateContestants('red'),
  yellow: generateContestants('yellow'),
};

// Scoring system: 1st place = 6 points, 2nd = 4 points, 3rd = 2 points
export const POINTS_FOR_PLACEMENT = {
  first: 6,
  second: 4,
  third: 2,
};

// Utility functions
export function getClassById(classId: string, module: 'early' | 'matured' = 'early'): Class | undefined {
  const classes = module === 'early' ? EARLY_CLASSES : MATURED_CLASSES;
  return classes.find(c => c.id === classId);
}

export function getContestantName(classId: string, contestantId: string): string {
  const contestant = EARLY_CONTESTANTS[classId]?.find(c => c.id === contestantId);
  return contestant?.name || 'Unknown';
}

export function calculatePoints(
  placements: { first: string; second: string; third: string },
  classId: string
): { cheetahsPoints: number; rhinosPoints: number } {
  let cheetahsPoints = 0;
  let rhinosPoints = 0;

  const contestants = EARLY_CONTESTANTS[classId] || [];
  const firstContestant = contestants.find(c => c.id === placements.first);
  const secondContestant = contestants.find(c => c.id === placements.second);
  const thirdContestant = contestants.find(c => c.id === placements.third);

  if (firstContestant) {
    if (firstContestant.group === 'Cheetahs') {
      cheetahsPoints += POINTS_FOR_PLACEMENT.first;
    } else {
      rhinosPoints += POINTS_FOR_PLACEMENT.first;
    }
  }

  if (secondContestant) {
    if (secondContestant.group === 'Cheetahs') {
      cheetahsPoints += POINTS_FOR_PLACEMENT.second;
    } else {
      rhinosPoints += POINTS_FOR_PLACEMENT.second;
    }
  }

  if (thirdContestant) {
    if (thirdContestant.group === 'Cheetahs') {
      cheetahsPoints += POINTS_FOR_PLACEMENT.third;
    } else {
      rhinosPoints += POINTS_FOR_PLACEMENT.third;
    }
  }

  return { cheetahsPoints, rhinosPoints };
}

export function calculateTotalPoints(
  results: EventResult[],
  module: 'early' | 'matured' = 'early'
): { cheetahsTotal: number; rhinosTotal: number } {
  let cheetahsTotal = 0;
  let rhinosTotal = 0;

  results.forEach(result => {
    const { cheetahsPoints, rhinosPoints } = calculatePoints(result.placements, result.className);
    cheetahsTotal += cheetahsPoints;
    rhinosTotal += rhinosPoints;
  });

  return { cheetahsTotal, rhinosTotal };
}
