import { PathType } from '@/contexts/GameContext';

export interface Question {
  id: number;
  question: string;
  options: { label: string; value: string }[];
}

export interface Riddle {
  id: number;
  riddle: string;
  answer: string;
}

export const round1Questions: Record<PathType, Question[]> = {
  ninja: [
    {
      id: 1,
      question: "A spy reports enemy forces gathering at the border. What is your first move?",
      options: [
        { label: "A", value: "Send assassins to eliminate their leaders" },
        { label: "B", value: "Deploy scouts for more intelligence" },
        { label: "C", value: "Fortify our own borders immediately" },
        { label: "D", value: "Initiate diplomatic negotiations" },
      ],
    },
    {
      id: 2,
      question: "Your treasury is running low. How do you replenish funds?",
      options: [
        { label: "A", value: "Increase taxes on merchants" },
        { label: "B", value: "Raid enemy supply caravans" },
        { label: "C", value: "Sell information to allied kingdoms" },
        { label: "D", value: "Reduce military spending temporarily" },
      ],
    },
    {
      id: 3,
      question: "A noble family threatens rebellion. Your response?",
      options: [
        { label: "A", value: "Eliminate the family head secretly" },
        { label: "B", value: "Offer them a position of power" },
        { label: "C", value: "Expose their treachery publicly" },
        { label: "D", value: "Plant spies in their household" },
      ],
    },
    {
      id: 4,
      question: "Enemy assassins have infiltrated your court. How do you respond?",
      options: [
        { label: "A", value: "Execute all suspicious individuals" },
        { label: "B", value: "Feed them false information" },
        { label: "C", value: "Double your personal guard" },
        { label: "D", value: "Go into hiding temporarily" },
      ],
    },
    {
      id: 5,
      question: "A powerful artifact is discovered in enemy territory. Your action?",
      options: [
        { label: "A", value: "Send elite thieves to steal it" },
        { label: "B", value: "Negotiate for its purchase" },
        { label: "C", value: "Destroy it before enemies can use it" },
        { label: "D", value: "Ignore it—too risky" },
      ],
    },
    {
      id: 6,
      question: "Your best spy has been captured. What do you do?",
      options: [
        { label: "A", value: "Rescue mission at all costs" },
        { label: "B", value: "Deny any connection" },
        { label: "C", value: "Exchange prisoners" },
        { label: "D", value: "Eliminate them before they talk" },
      ],
    },
    {
      id: 7,
      question: "A plague spreads through enemy lands. Your strategy?",
      options: [
        { label: "A", value: "Seal our borders completely" },
        { label: "B", value: "Send aid to gain favor" },
        { label: "C", value: "Attack while they are weakened" },
        { label: "D", value: "Study the plague for potential use" },
      ],
    },
  ],
  elves: [
    {
      id: 1,
      question: "The sacred forest is threatened by expansion. Your decision?",
      options: [
        { label: "A", value: "Create protected sanctuaries" },
        { label: "B", value: "Negotiate sustainable logging rights" },
        { label: "C", value: "Use magic to accelerate regrowth" },
        { label: "D", value: "Relocate the forest spirits" },
      ],
    },
    {
      id: 2,
      question: "A drought affects your farmlands. How do you respond?",
      options: [
        { label: "A", value: "Perform ancient rain rituals" },
        { label: "B", value: "Dig deep wells and aqueducts" },
        { label: "C", value: "Trade for food from neighbors" },
        { label: "D", value: "Migrate to greener lands" },
      ],
    },
    {
      id: 3,
      question: "Young elves are leaving for human cities. Your approach?",
      options: [
        { label: "A", value: "Improve life in elven lands" },
        { label: "B", value: "Establish embassies in human cities" },
        { label: "C", value: "Let them go freely" },
        { label: "D", value: "Create exchange programs" },
      ],
    },
    {
      id: 4,
      question: "Ancient texts reveal a forgotten power. What do you do?",
      options: [
        { label: "A", value: "Study it carefully before use" },
        { label: "B", value: "Seal it away forever" },
        { label: "C", value: "Share knowledge with allies" },
        { label: "D", value: "Use it to protect the realm" },
      ],
    },
    {
      id: 5,
      question: "Neighboring dwarves propose a trade alliance. Your response?",
      options: [
        { label: "A", value: "Accept with favorable terms" },
        { label: "B", value: "Decline to maintain independence" },
        { label: "C", value: "Propose a cultural exchange instead" },
        { label: "D", value: "Request military alliance too" },
      ],
    },
    {
      id: 6,
      question: "A prophecy speaks of coming darkness. How do you prepare?",
      options: [
        { label: "A", value: "Train warriors in ancient arts" },
        { label: "B", value: "Seek the chosen hero" },
        { label: "C", value: "Build magical defenses" },
        { label: "D", value: "Unite all races against the threat" },
      ],
    },
    {
      id: 7,
      question: "A rare magical creature is dying. Your choice?",
      options: [
        { label: "A", value: "Use all resources to save it" },
        { label: "B", value: "Let nature take its course" },
        { label: "C", value: "Preserve its essence for future generations" },
        { label: "D", value: "Find a mate to continue the species" },
      ],
    },
  ],
  dwarves: [
    {
      id: 1,
      question: "A new vein of precious ore is discovered. Your priority?",
      options: [
        { label: "A", value: "Begin immediate excavation" },
        { label: "B", value: "Survey for structural safety first" },
        { label: "C", value: "Keep it secret from competitors" },
        { label: "D", value: "Negotiate mining rights with the council" },
      ],
    },
    {
      id: 2,
      question: "The great forge needs repairs. How do you proceed?",
      options: [
        { label: "A", value: "Temporary fixes to maintain production" },
        { label: "B", value: "Complete overhaul with modern techniques" },
        { label: "C", value: "Seek elven enchantments for enhancement" },
        { label: "D", value: "Build a new forge entirely" },
      ],
    },
    {
      id: 3,
      question: "Cave-ins are becoming frequent. Your solution?",
      options: [
        { label: "A", value: "Reinforce all tunnels with iron" },
        { label: "B", value: "Limit mining depth temporarily" },
        { label: "C", value: "Hire human engineers for new techniques" },
        { label: "D", value: "Pray to the stone gods" },
      ],
    },
    {
      id: 4,
      question: "A rival clan disputes territorial claims. Your action?",
      options: [
        { label: "A", value: "Challenge them to honor combat" },
        { label: "B", value: "Present historical evidence to elders" },
        { label: "C", value: "Propose joint mining operations" },
        { label: "D", value: "Fortify and defend the territory" },
      ],
    },
    {
      id: 5,
      question: "Surface traders offer new technology. Your response?",
      options: [
        { label: "A", value: "Acquire and adapt for dwarven use" },
        { label: "B", value: "Reject—dwarven craft is superior" },
        { label: "C", value: "Trade our techniques for theirs" },
        { label: "D", value: "Steal the secrets instead" },
      ],
    },
    {
      id: 6,
      question: "Young dwarves prefer crafting to mining. How do you address this?",
      options: [
        { label: "A", value: "Mandate mining service for all" },
        { label: "B", value: "Improve mining conditions and pay" },
        { label: "C", value: "Develop automated mining tools" },
        { label: "D", value: "Accept the cultural shift" },
      ],
    },
    {
      id: 7,
      question: "An underground river threatens the mines. Your plan?",
      options: [
        { label: "A", value: "Divert it to power water wheels" },
        { label: "B", value: "Dam it and create reservoirs" },
        { label: "C", value: "Abandon affected tunnels" },
        { label: "D", value: "Pump it to the surface" },
      ],
    },
  ],
};

export const round2Questions: Record<PathType, Question[]> = {
  ninja: [
    {
      id: 1,
      question: "Your spy network needs expansion. Priority region?",
      options: [
        { label: "A", value: "Enemy capital" },
        { label: "B", value: "Trade route cities" },
        { label: "C", value: "Border fortresses" },
        { label: "D", value: "Allied courts" },
      ],
    },
    {
      id: 2,
      question: "A secret weapon is being developed. Investment focus?",
      options: [
        { label: "A", value: "Poison research" },
        { label: "B", value: "Stealth technology" },
        { label: "C", value: "Communication devices" },
        { label: "D", value: "Disguise materials" },
      ],
    },
    {
      id: 3,
      question: "Training new recruits. Emphasis on?",
      options: [
        { label: "A", value: "Combat assassination" },
        { label: "B", value: "Information gathering" },
        { label: "C", value: "Infiltration techniques" },
        { label: "D", value: "Psychological warfare" },
      ],
    },
    {
      id: 4,
      question: "Building a new safehouse. Location?",
      options: [
        { label: "A", value: "Beneath the city sewers" },
        { label: "B", value: "In a merchant's warehouse" },
        { label: "C", value: "Inside the royal palace" },
        { label: "D", value: "Remote mountain cave" },
      ],
    },
    {
      id: 5,
      question: "Upgrading agent equipment. Priority?",
      options: [
        { label: "A", value: "Silent weapons" },
        { label: "B", value: "Night vision tools" },
        { label: "C", value: "Encrypted communication" },
        { label: "D", value: "Quick escape devices" },
      ],
    },
    {
      id: 6,
      question: "Establishing a cover business. Type?",
      options: [
        { label: "A", value: "Trading company" },
        { label: "B", value: "Tavern and inn" },
        { label: "C", value: "Messenger service" },
        { label: "D", value: "Apothecary shop" },
      ],
    },
    {
      id: 7,
      question: "Allocating budget. Largest portion to?",
      options: [
        { label: "A", value: "Agent salaries" },
        { label: "B", value: "Equipment and tools" },
        { label: "C", value: "Bribery funds" },
        { label: "D", value: "Emergency reserves" },
      ],
    },
  ],
  elves: [
    {
      id: 1,
      question: "Expanding the sacred groves. Method?",
      options: [
        { label: "A", value: "Natural growth over decades" },
        { label: "B", value: "Magical acceleration" },
        { label: "C", value: "Seed distribution by birds" },
        { label: "D", value: "Partnerships with nature spirits" },
      ],
    },
    {
      id: 2,
      question: "Building new homes. Design philosophy?",
      options: [
        { label: "A", value: "Treehouse integration" },
        { label: "B", value: "Underground burrows" },
        { label: "C", value: "Floating platforms" },
        { label: "D", value: "Traditional stone structures" },
      ],
    },
    {
      id: 3,
      question: "Developing agriculture. Focus crop?",
      options: [
        { label: "A", value: "Medicinal herbs" },
        { label: "B", value: "Magical components" },
        { label: "C", value: "Staple grains" },
        { label: "D", value: "Luxury fruits" },
      ],
    },
    {
      id: 4,
      question: "Creating transportation routes. Type?",
      options: [
        { label: "A", value: "Flying creature paths" },
        { label: "B", value: "Underground tunnels" },
        { label: "C", value: "River waterways" },
        { label: "D", value: "Magical portals" },
      ],
    },
    {
      id: 5,
      question: "Establishing libraries. Primary collection?",
      options: [
        { label: "A", value: "Ancient histories" },
        { label: "B", value: "Magical texts" },
        { label: "C", value: "Natural sciences" },
        { label: "D", value: "Art and culture" },
      ],
    },
    {
      id: 6,
      question: "Training young elves. Core curriculum?",
      options: [
        { label: "A", value: "Combat and defense" },
        { label: "B", value: "Magic and rituals" },
        { label: "C", value: "Crafts and arts" },
        { label: "D", value: "Diplomacy and languages" },
      ],
    },
    {
      id: 7,
      question: "Resource allocation priority?",
      options: [
        { label: "A", value: "Environmental preservation" },
        { label: "B", value: "Magical research" },
        { label: "C", value: "Defense infrastructure" },
        { label: "D", value: "Cultural festivals" },
      ],
    },
  ],
  dwarves: [
    {
      id: 1,
      question: "Expanding the mines. Direction?",
      options: [
        { label: "A", value: "Deeper underground" },
        { label: "B", value: "Horizontally wider" },
        { label: "C", value: "Into mountain peaks" },
        { label: "D", value: "Under the sea floor" },
      ],
    },
    {
      id: 2,
      question: "Building new forges. Specialization?",
      options: [
        { label: "A", value: "Weapons manufacturing" },
        { label: "B", value: "Jewelry crafting" },
        { label: "C", value: "Tool production" },
        { label: "D", value: "Armor smithing" },
      ],
    },
    {
      id: 3,
      question: "Improving ventilation systems. Method?",
      options: [
        { label: "A", value: "Natural wind tunnels" },
        { label: "B", value: "Mechanical bellows" },
        { label: "C", value: "Magical air currents" },
        { label: "D", value: "Water-powered fans" },
      ],
    },
    {
      id: 4,
      question: "Developing trade routes. Focus partner?",
      options: [
        { label: "A", value: "Human kingdoms" },
        { label: "B", value: "Elven forests" },
        { label: "C", value: "Coastal merchants" },
        { label: "D", value: "Other dwarven clans" },
      ],
    },
    {
      id: 5,
      question: "Constructing defensive walls. Material?",
      options: [
        { label: "A", value: "Solid granite" },
        { label: "B", value: "Reinforced iron" },
        { label: "C", value: "Enchanted stone" },
        { label: "D", value: "Mixed composite" },
      ],
    },
    {
      id: 6,
      question: "Training apprentices. Focus skill?",
      options: [
        { label: "A", value: "Mining expertise" },
        { label: "B", value: "Metalworking mastery" },
        { label: "C", value: "Engineering design" },
        { label: "D", value: "Gem cutting" },
      ],
    },
    {
      id: 7,
      question: "Budget priority for infrastructure?",
      options: [
        { label: "A", value: "Mine safety" },
        { label: "B", value: "Production capacity" },
        { label: "C", value: "Living quarters" },
        { label: "D", value: "Storage facilities" },
      ],
    },
  ],
};

export const riddles: Riddle[] = [
  { id: 1, riddle: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. I have roads, but no cars drive there. What am I?", answer: "map" },
  { id: 2, riddle: "The more you take, the more you leave behind. What am I?", answer: "footsteps" },
  { id: 3, riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo" },
  { id: 4, riddle: "I can fly without wings. I can cry without eyes. Wherever I go, darkness follows me. What am I?", answer: "cloud" },
  { id: 5, riddle: "I have keys but no locks. I have space but no room. You can enter but can't go inside. What am I?", answer: "keyboard" },
  { id: 6, riddle: "The person who makes it, sells it. The person who buys it never uses it. The person who uses it never knows they're using it. What is it?", answer: "coffin" },
  { id: 7, riddle: "I am not alive, but I grow. I don't have lungs, but I need air. I don't have a mouth, but water kills me. What am I?", answer: "fire" },
  { id: 8, riddle: "What has a head and a tail but no body?", answer: "coin" },
  { id: 9, riddle: "I can be cracked, made, told, and played. What am I?", answer: "joke" },
  { id: 10, riddle: "The more you have of it, the less you see. What is it?", answer: "darkness" },
  { id: 11, riddle: "I have branches, but no fruit, trunk, or leaves. What am I?", answer: "bank" },
  { id: 12, riddle: "What can travel around the world while staying in a corner?", answer: "stamp" },
  { id: 13, riddle: "I am always hungry and will die if not fed, but whatever I touch will soon turn red. What am I?", answer: "fire" },
  { id: 14, riddle: "What has words but never speaks?", answer: "book" },
];
