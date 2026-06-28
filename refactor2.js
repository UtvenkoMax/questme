const fs = require('fs');
const path = require('path');

const questsPath = path.resolve(__dirname, 'src/app/(main)/quests.tsx');
let questsContent = fs.readFileSync(questsPath, 'utf8');

// Replace Hero section
questsContent = questsContent.replace(
  /<View style=\{styles\.heroWrapper\}>[\s\S]*?<\/View>\s*<\/Card>\s*<\/View>/,
  '<QuestHero progress={progress} />'
);

// Replace Explore section
questsContent = questsContent.replace(
  /<View style=\{\[styles\.exploreSection, isPhoneSize && styles\.exploreSectionPhone\]\}>[\s\S]*?<\/View>\s*<\/View>/,
  '<ExploreSection isPhoneSize={isPhoneSize} layout={layout} />'
);

// Add imports
questsContent = questsContent.replace(
  /import \{ PersonalQuestCard \} from '@\/components\/home\/personal-quest-card';/,
  `import { PersonalQuestCard } from '@/components/home/personal-quest-card';\nimport { QuestHero } from '@/components/home/quest-hero';\nimport { ExploreSection } from '@/components/home/explore-section';`
);

// Remove unused state
questsContent = questsContent.replace(
  /const EXPLORE_FILTERS = \['Усі', 'Поряд', 'Популярні'\] as const;\n\n/,
  ''
);

questsContent = questsContent.replace(
  /const \[activeFilter, setActiveFilter\] = useState<\(typeof EXPLORE_FILTERS\)\[number\]>\('Усі'\);\n\n/,
  ''
);

questsContent = questsContent.replace(
  /const filteredRoutes = useMemo\(\(\) => \{[\s\S]*?\}, \[activeFilter\]\);\n\n/,
  ''
);

fs.writeFileSync(questsPath, questsContent);
console.log('Refactored quests.tsx');
