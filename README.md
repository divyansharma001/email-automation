# Email Automator

A Node.js application that combines conversational AI (Google's Gemini) with browser automation (Playwright) to send emails via Gmail. The application provides an interactive conversation interface that gathers email details and then automatically sends the email through Gmail's web interface.

## Features

- 🤖 **Conversational AI Interface**: Uses Google's Gemini AI to understand user intent and generate professional email content
- 📧 **Automatic Email Sending**: Browser automation using Playwright to send emails through Gmail
- 📸 **Visual Logging**: Screenshots are saved at each step for debugging and verification
- 🔒 **Secure**: Uses Gmail App Passwords for authentication
- 💬 **Interactive**: Command-line interface with validation and error handling

## Prerequisites

- Node.js (v16 or higher)
- Gmail account with App Password enabled
- Google Gemini API key

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## Configuration

Create a `.env` file in the project root with the following variables:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gmail Credentials
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
```

### Setting up Gmail App Password

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in your `.env` file

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## Usage

### Main Application

Run the integrated conversational email assistant:

```bash
npm start
```

The application will:
1. Ask for the recipient email address
2. Ask for the purpose of the email
3. Collect additional details (optional)
4. Generate professional email content using AI
5. Automatically send the email through Gmail
6. Save screenshots of the process

### Example Interaction

```
🤖 Hi! I'm your AI Email Assistant. What would you like to do today?

? Who should receive this email? hr@company.com
? What is the purpose of this email? (e.g., leave application, meeting request, etc.) leave application
? Any additional details you'd like to include? (Press Enter if complete) August 15-20, 2024

📧 Perfect! I have all the details. I will now log in to Gmail and send this email for you. You can see my progress in the screenshots folder as I work.

Generated Email:
To: hr@company.com
Subject: Leave Application - August 15-20, 2024
Body: [AI-generated professional email content]

Navigating to Gmail...
Entering email address...
Clicking Next...
Entering password...
Completing login...
Waiting for Gmail to load...
Clicking compose...
Filling email details...
Sending email...
Waiting for send confirmation...

✅ The email has been sent successfully! You can check the screenshots folder for the complete visual log.
```

### Testing Email Sender

Test the email automation module directly:

```bash
npm test
```

This will send a test email using the credentials in your `.env` file.

## Project Structure

```
email-automator/
├── index.js              # Main application (conversational AI + automation)
├── emailSender.js        # Browser automation module
├── testSender.js         # Test script for email automation
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (create this)
├── screenshots/          # Visual logs of automation process
└── README.md            # This file
```

## Screenshots

The application automatically saves screenshots during the email sending process:

- `1_login_page.png` - Gmail login page
- `2_email_entered.png` - Email field filled
- `3_password_page.png` - Password page
- `4_password_entered.png` - Password field filled
- `5_gmail_loaded.png` - Gmail interface loaded
- `6_compose_window.png` - Compose window opened
- `7_email_filled.png` - Email details filled
- `8_email_sent.png` - Email sent confirmation

## Troubleshooting

### Common Issues

1. **"Gmail is requesting additional verification"**
   - Log into Gmail manually from the same device first
   - Complete any verification steps
   - Ensure App Passwords are enabled

2. **"Password field not found"**
   - Gmail's login flow may have changed
   - Check the screenshots folder for visual debugging
   - Try logging in manually first

3. **"Compose button not found"**
   - Gmail may not have loaded completely
   - Check your internet connection
   - Try running the test script first

4. **"Error generating email content"**
   - Check your Gemini API key
   - Ensure you have sufficient API credits
   - Verify internet connectivity

### Debug Mode

The application runs in non-headless mode by default, so you can see the browser automation in action. For production use, you can modify `emailSender.js` to run in headless mode.

## Dependencies

- `@google/generative-ai` - Google's Gemini AI API
- `inquirer` - Interactive command-line interface
- `playwright` - Browser automation
- `dotenv` - Environment variable management

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of your main Gmail password
- Keep your API keys secure
- The application runs in non-headless mode for debugging - change to headless for production

## License

ISC License 