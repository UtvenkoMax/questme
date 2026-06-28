const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/app/(main)/profile.tsx',
  'src/app/(main)/quests.tsx',
  'src/app/login.tsx',
  'src/app/pin-code.tsx',
  'src/app/quest/[id].tsx',
  'src/app/security.tsx',
  'src/components/auth/register-screen-view.tsx',
  'src/components/explore-map.native.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/layout.tsx',
  'src/components/ui/text-field.tsx'
];

filesToProcess.forEach(file => {
  const absolutePath = path.resolve(__dirname, file);
  if (!fs.existsSync(absolutePath)) return;
  
  const content = fs.readFileSync(absolutePath, 'utf8');
  
  // Find where styles start
  const styleMatch = content.match(/const styles = StyleSheet\.create\({/);
  
  if (styleMatch) {
    const styleStartIndex = styleMatch.index;
    
    let imports = [];
    const importRegex = /import\s+.*?from\s+['"].*?['"];?/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      if (match.index < styleStartIndex) {
        imports.push(match[0]);
      }
    }
    
    const componentCode = content.substring(0, styleStartIndex).trim();
    const stylesCode = content.substring(styleStartIndex).trim();
    
    if (stylesCode.length > 50) {
      const fileNameWithoutExt = path.basename(file, '.tsx');
      const dirName = path.dirname(absolutePath);
      
      // Determine what to import in styles
      let styleImports = `import { StyleSheet } from 'react-native';\nimport { colors, radii, spacing, typography, hitSlop } from '@/theme';\n`;
      
      const newStylesPath = path.join(dirName, `${fileNameWithoutExt}.styles.ts`);
      fs.writeFileSync(newStylesPath, styleImports + '\nexport ' + stylesCode, 'utf8');
      
      const newComponentCode = componentCode.replace(/import \{.*?StyleSheet.*?\} from 'react-native';/g, (m) => m.replace('StyleSheet, ', '').replace(', StyleSheet', '').replace('StyleSheet', '')) + 
        `\n\nimport { styles } from './${fileNameWithoutExt}.styles';\n`;
        
      fs.writeFileSync(absolutePath, newComponentCode, 'utf8');
      console.log(`Extracted styles from ${file}`);
    }
  }
});
