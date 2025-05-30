/**
 * Script to scan for console logs in the codebase
 * 
 * Usage:
 * node scripts/remove-console-logs.js --scan      # Only scan and report console logs
 * node scripts/remove-console-logs.js --clean     # Remove console logs (creates backup files)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to exclude from scanning
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
];

// File extensions to scan
const INCLUDE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Console log patterns to look for
const CONSOLE_PATTERNS = [
  'console.log',
  'console.error',
  'console.warn',
  'console.info',
  'console.debug',
];

// Arguments
const args = process.argv.slice(2);
const shouldClean = args.includes('--clean');
const shouldScan = args.includes('--scan') || !shouldClean;

// Function to scan a file for console logs
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const matches = [];

    lines.forEach((line, index) => {
      CONSOLE_PATTERNS.forEach(pattern => {
        if (line.includes(pattern)) {
          matches.push({
            line: index + 1,
            content: line.trim(),
            pattern
          });
        }
      });
    });

    if (matches.length > 0) {
      return { filePath, matches };
    }
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error.message);
  }
  return null;
}

// Function to scan directory recursively
function scanDirectory(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(entry.name)) {
        results.push(...scanDirectory(fullPath));
      }
    } else if (entry.isFile() && INCLUDE_EXTENSIONS.includes(path.extname(entry.name))) {
      const result = scanFile(fullPath);
      if (result) results.push(result);
    }
  }

  return results;
}

// Function to clean console logs from a file
function cleanFile(filePath) {
  try {
    // Create backup
    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    
    // Read content
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace console log lines with comments
    CONSOLE_PATTERNS.forEach(pattern => {
      const regex = new RegExp(`.*${pattern}\\s*\\(.*\\).*`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, match => {
          modified = true;
          return `// Removed: ${match}`;
        });
      }
    });
    
    // Write modified content if changes were made
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    // Remove backup if no changes
    fs.unlinkSync(backupPath);
    return false;
  } catch (error) {
    console.error(`Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('Scanning for console logs...');
  const startTime = Date.now();
  
  // Get project root directory
  const rootDir = path.resolve(__dirname, '..');
  
  // Scan for console logs
  const results = scanDirectory(rootDir);
  
  // Report results
  console.log('\nScan complete!');
  console.log(`Found ${results.length} files with console logs`);
  console.log(`Scanned in ${Date.now() - startTime}ms\n`);
  
  if (results.length > 0) {
    console.log('Files with console logs:');
    results.forEach(result => {
      console.log(`\n${result.filePath} (${result.matches.length} matches):`);
      result.matches.forEach(match => {
        console.log(`  Line ${match.line}: ${match.pattern} - ${match.content}`);
      });
    });
    
    // Clean if requested
    if (shouldClean) {
      console.log('\nCleaning console logs...');
      let cleanedCount = 0;
      
      results.forEach(result => {
        const cleaned = cleanFile(result.filePath);
        if (cleaned) cleanedCount++;
      });
      
      console.log(`Cleaned ${cleanedCount} files`);
      console.log('Backup files created with .bak extension');
    } else {
      console.log('\nTo remove these console logs, run:');
      console.log('node scripts/remove-console-logs.js --clean');
    }
  }
}

// Run main function
main(); 