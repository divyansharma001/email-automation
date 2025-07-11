# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   npx playwright install chromium
   ```

2. **Create Environment File**
   Create a `.env` file in the project root with:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=your_app_password_here
   ```

3. **Get Your API Keys**

   **Google Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

   **Gmail App Password:**
   - Go to your [Google Account settings](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification
   - Scroll down to "App passwords"
   - Generate a new app password for "Mail"
   - Use this password in your `.env` file (NOT your regular Gmail password)

4. **Run the Application**
   ```bash
   npm start
   ```

## Troubleshooting

### Common Setup Issues

1. **"GEMINI_API_KEY environment variable is required"**
   - Make sure your `.env` file exists in the project root
   - Check that the API key is correctly copied (no extra spaces)

2. **"GMAIL_USER and GMAIL_APP_PASSWORD environment variables are required"**
   - Ensure both variables are set in your `.env` file
   - Use your full Gmail address (e.g., `user@gmail.com`)
   - Use the App Password, not your regular Gmail password

3. **"Gmail is requesting additional verification"**
   - Log into Gmail manually from the same device first
   - Complete any verification steps
   - Make sure App Passwords are enabled

4. **"Error generating email content"**
   - Check your Gemini API key is valid
   - Ensure you have sufficient API credits
   - Verify internet connectivity

### Testing

Test the email automation separately:
```bash
npm test
```

This will send a test email using your configured credentials.

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of your main Gmail password
- Keep your API keys secure and private
- The application runs in non-headless mode for debugging 