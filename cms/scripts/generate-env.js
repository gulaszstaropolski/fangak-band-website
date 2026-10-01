#!/usr/bin/env node

/**
 * Generates cms/.env from cms/.env.example, replacing every secret
 * placeholder with a freshly generated cryptographic value.
 *
 * Usage: npm run env:generate
 *
 * This never commits secrets to the repository: the resulting .env file
 * stays untracked (see .gitignore), and existing files are left untouched
 * unless --force is passed.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const cmsDir = path.resolve(__dirname, '..');
const examplePath = path.join(cmsDir, '.env.example');
const envPath = path.join(cmsDir, '.env');
const force = process.argv.includes('--force');

if (fs.existsSync(envPath) && !force) {
  console.log(`'.env' already exists at ${envPath}. Use --force to overwrite it.`);
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.error(`Could not find ${examplePath}`);
  process.exit(1);
}

const SECRET_BYTE_LENGTH = 32;
const generateSecret = () => crypto.randomBytes(SECRET_BYTE_LENGTH).toString('base64');

const secretKeys = {
  APP_KEYS: () => [generateSecret(), generateSecret()].join(','),
  API_TOKEN_SALT: generateSecret,
  ADMIN_JWT_SECRET: generateSecret,
  TRANSFER_TOKEN_SALT: generateSecret,
  JWT_SECRET: generateSecret,
  ENCRYPTION_KEY: generateSecret,
};

const lines = fs.readFileSync(examplePath, 'utf8').replace(/\r\n/g, '\n').split('\n');

const output = lines
  .map((line) => {
    const match = line.match(/^([A-Z0-9_]+)=/);
    if (match && Object.prototype.hasOwnProperty.call(secretKeys, match[1])) {
      return `${match[1]}=${secretKeys[match[1]]()}`;
    }
    return line;
  })
  .join('\n');

fs.writeFileSync(envPath, output, { mode: 0o600 });
console.log(`Generated ${envPath} with fresh secrets for: ${Object.keys(secretKeys).join(', ')}`);
