/* Optional starting points: pick a game and its scoring categories are created
   for you. Everything stays editable afterwards. */
export const TEMPLATES = [
  {
    id: 'rounds',
    name: 'Rounds 1–5',
    note: 'Any game scored per round',
    categories: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5'],
  },
  {
    id: 'catan',
    name: 'Catan',
    categories: ['Settlements & cities', 'Longest road', 'Largest army', 'Victory point cards'],
  },
  {
    id: 'ticket-to-ride',
    name: 'Ticket to Ride',
    categories: ['Train routes', 'Destination tickets', 'Longest continuous path'],
  },
  {
    id: 'carcassonne',
    name: 'Carcassonne',
    categories: ['Scored during play', 'Cities at the end', 'Roads at the end', 'Cloisters at the end', 'Farms'],
  },
  {
    id: 'wingspan',
    name: 'Wingspan',
    categories: ['Birds', 'Bonus cards', 'End-of-round goals', 'Eggs', 'Food on cards', 'Tucked cards'],
  },
  {
    id: 'seven-wonders',
    name: '7 Wonders',
    categories: ['Military', 'Treasury', 'Wonder', 'Civilian (blue)', 'Commercial (yellow)', 'Science (green)', 'Guilds (purple)'],
  },
  {
    id: 'splendor',
    name: 'Splendor',
    categories: ['Card points', 'Nobles'],
  },
  {
    id: 'azul',
    name: 'Azul',
    categories: ['Scored during play', 'Full rows', 'Full columns', 'Colour sets', 'Floor line'],
  },
  {
    id: 'cascadia',
    name: 'Cascadia',
    categories: ['Wildlife', 'Habitat corridors', 'Nature tokens'],
  },
  {
    id: 'everdell',
    name: 'Everdell',
    categories: ['Cards', 'Point tokens', 'Prosperity', 'Events', 'Journey'],
  },
  {
    id: 'terraforming-mars',
    name: 'Terraforming Mars',
    categories: ['Terraform rating', 'Awards', 'Milestones', 'Cities & greenery', 'Card points'],
  },
  {
    id: 'scythe',
    name: 'Scythe',
    categories: ['Coins', 'Stars', 'Territories', 'Resources', 'Structure bonus'],
  },
  {
    id: 'yahtzee',
    name: 'Yahtzee',
    categories: [
      'Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'Upper bonus',
      'Three of a kind', 'Four of a kind', 'Full house',
      'Small straight', 'Large straight', 'Yahtzee', 'Chance',
    ],
  },
];

export const findTemplate = (id) => TEMPLATES.find((t) => t.id === id) || null;
