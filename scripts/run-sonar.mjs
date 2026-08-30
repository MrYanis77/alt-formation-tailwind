import 'dotenv/config';
import { spawn } from 'node:child_process';

if (!process.env.SONAR_TOKEN) {
  console.error('SONAR_TOKEN est absent du fichier .env.');
  process.exit(1);
}

// Le shell est nécessaire sous Windows pour résoudre le binaire .cmd installé par npm.
const scanner = spawn('sonar-scanner-npm', process.argv.slice(2), {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

scanner.on('error', (error) => {
  console.error(`Impossible de lancer SonarQube : ${error.message}`);
  process.exit(1);
});

scanner.on('close', (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});
