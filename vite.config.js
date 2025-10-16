import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path';
import {glob} from 'glob';

// Define the directories where your HTML files are located.
const htmlDirectories = ['solutions', 'trust'];

const getHtmlEntryFiles = () => {
  const entries = {};
  const rootDir = __dirname;
  
  // Create an array to hold all glob patterns
  const patterns = [];

  // Add the pattern to find HTML files directly in the root directory
  patterns.push('*.html');

  // Add a glob pattern for each specified subdirectory
  htmlDirectories.forEach(dir => {
    patterns.push(`${dir}/**/*.html`);
  });
  
  // Search for HTML files using the combined patterns
  const files = glob.sync(patterns, { cwd: rootDir });
  
  // Create an entry for each HTML file found
  files.forEach((file) => {
    // Ensure the entry name is unique
    const name = file.replace(`${rootDir}/`, '').replace('.html', '').replace(/\//g, '-');
    entries[name] = resolve(rootDir, file);
  });
  
  return entries;
};
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: getHtmlEntryFiles(),
    }
  }
})