import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

/**
 * Save the token to disk for later program executions
 * @param {string} code The authorization code from Google
 */
async function saveToken(code) {
  try {
    // Load client secrets
    const content = await fs.readFile(CREDENTIALS_PATH);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    
    // Create OAuth2 client
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
    
    // Get token from code
    const { tokens } = await oAuth2Client.getToken(code);
    
    // Save token to file
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', TOKEN_PATH);
    
    // Test the token
    oAuth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    
    console.log('✅ Authentication successful!');
    console.log(`Authenticated as: ${profile.data.emailAddress}`);
    
    return tokens;
  } catch (err) {
    console.error('❌ Error saving token:', err);
    if (err.message.includes('invalid_grant')) {
      console.error('\n⚠️ The authorization code has expired or is invalid.');
      console.error('Please get a new authorization code by visiting the auth URL again.');
    }
    process.exit(1);
  }
}

// If this file is run directly, use the command line argument as the code
if (process.argv[2]) {
  saveToken(process.argv[2]);
}

export { saveToken }; 