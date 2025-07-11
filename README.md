# Email Automator

A Node.js application that combines conversational AI (Google's Gemini) with browser automation (Playwright) to send emails via Gmail. The application provides an interactive conversation interface that gathers email details and then automatically sends the email through Gmail's web interface.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Email Automator Architecture                │
├─────────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   User Input    │    │  Conversation   │    │   Gemini    │ │
│  │   Interface     │◄──►│     Engine      │◄──►│     AI      │ │
│  │  (Inquirer)     │    │   (index.js)    │    │   API       │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│           │                       │                       │     │
│           │                       │                       │     │
│           ▼                       ▼                       │     │
│  ┌─────────────────┐    ┌─────────────────┐              │     │
│  │  Email Content  │    │  Browser        │              │     │
│  │  Generation     │    │  Automation     │              │     │
│  │  (AI-Powered)   │    │  (Playwright)   │              │     │
│  └─────────────────┘    └─────────────────┘              │     │
│           │                       │                       │     │
│           │                       ▼                       │     │
│           │              ┌─────────────────┐              │     │
│           │              │     Gmail       │              │     │
│           │              │   Web Interface │              │     │
│           │              └─────────────────┘              │     │
│           │                       │                       │     │
│           └───────────────────────┼───────────────────────┘     │
│                                   │                             │
│                                   ▼                             │
│                          ┌─────────────────┐                    │
│                          │   Screenshots   │                    │
│                          │   (Visual Log)  │                    │
│                          └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Explanation

The application follows a **modular, event-driven architecture** with clear separation of concerns:

1. **User Interface Layer** (`index.js`): Handles user interaction through Inquirer prompts
2. **Conversation Engine** (`index.js`): Manages conversation flow and context
3. **AI Integration Layer** (`index.js`): Interfaces with Gemini AI for content generation
4. **Automation Layer** (`emailSender.js`): Handles browser automation using Playwright
5. **Visual Logging Layer**: Captures screenshots for debugging and verification

**Data Flow:**
1. User provides email details through interactive prompts
2. Conversation engine validates and stores information
3. AI generates professional email content
4. Browser automation logs into Gmail and sends the email
5. Screenshots are captured at each step for verification

## 🛠️ Technology Choices & Justification

### Core Technologies

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Node.js** | Runtime Environment | - Excellent async/await support for automation<br>- Rich ecosystem for AI and browser automation<br>- Cross-platform compatibility |
| **Google Gemini AI** | Content Generation | - State-of-the-art language model<br>- Excellent at understanding context and generating professional content<br>- Google's ecosystem integration |
| **Playwright** | Browser Automation | - Modern, reliable browser automation<br>- Better performance than Selenium<br>- Built-in stealth features to avoid detection<br>- Excellent debugging capabilities with screenshots |
| **Inquirer** | CLI Interface | - Rich interactive prompts<br>- Input validation<br>- Better UX than basic console.log/readline |

### Alternative Technologies Considered

| Technology | Why Not Chosen | Our Solution |
|------------|----------------|--------------|
| **Selenium** | Slower, more detection-prone | Playwright with stealth features |
| **Puppeteer** | Chrome-only, less stealth | Playwright (multi-browser) |
| **OpenAI GPT** | More expensive, rate limits | Gemini AI (Google's offering) |
| **Basic CLI** | Poor UX, no validation | Inquirer with rich prompts |
| **Gmail API** | Complex OAuth setup, limited features | Browser automation (more flexible) |

### Design Patterns

1. **Modular Architecture**: Each component has a single responsibility
2. **Dependency Injection**: Services are injected rather than tightly coupled
3. **Error Boundary Pattern**: Comprehensive error handling at each layer
4. **Observer Pattern**: Event-driven communication between components

## 📋 Prerequisites

- Node.js (v16 or higher)
- Gmail account with App Password enabled
- Google Gemini API key
- Modern web browser (for debugging)

## 🚀 Installation & Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd email-automator

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gmail Credentials
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
```

### 3. API Key Setup

**Google Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

**Gmail App Password:**
1. Go to [Google Account settings](https://myaccount.google.com/)
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in your `.env` file (NOT your regular Gmail password)

### 4. Run the Application

```bash
# Start the main application
npm start

# Or test the email automation separately
npm test
```

## 🎯 Usage

### Main Application

The application provides an interactive conversation flow:

```bash
npm start
```

**Example Interaction:**
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

### Testing

Test the email automation module independently:

```bash
npm test
```

## 🔧 Project Structure

```
email-automator/
├── index.js              # Main application (conversational AI + automation)
├── emailSender.js        # Browser automation module
├── testSender.js         # Test script for email automation
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (create this)
├── screenshots/          # Visual logs of automation process
├── SETUP.md             # Quick setup guide
└── README.md            # This file
```

## 📸 Screenshots & Visual Logging

The application automatically saves screenshots during the email sending process:

- `1_login_page.png` - Gmail login page
- `2_email_entered.png` - Email field filled
- `3_password_page.png` - Password page
- `4_password_entered.png` - Password field filled
- `5_gmail_loaded.png` - Gmail interface loaded
- `6_compose_window.png` - Compose window opened
- `7_email_filled.png` - Email details filled
- `8_email_sent.png` - Email sent confirmation

## ⚠️ Challenges Faced & Solutions Implemented

### 1. Gmail Login Detection

**Challenge:** Gmail's sophisticated bot detection systems can block automated logins.

**Solutions Implemented:**
- **Stealth Configuration**: Custom user agent and browser arguments
- **Human-like Timing**: SlowMo delays between actions
- **Multiple Selector Strategies**: Fallback selectors for UI elements
- **Manual Login First**: Instructions to log in manually before automation

```javascript
// Stealth configuration
browser = await chromium.launch({ 
  headless: false,
  slowMo: 1000,
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor'
  ]
});
```

### 2. Dynamic Gmail UI Elements

**Challenge:** Gmail's UI elements have dynamic selectors that change frequently.

**Solutions Implemented:**
- **Multiple Selector Arrays**: Fallback selectors for each element
- **Try-Catch Loops**: Attempt each selector until one works
- **Robust Error Handling**: Graceful degradation when selectors fail

```javascript
const passwordSelectors = [
  'input[type="password"]',
  'input[name="password"]',
  '#password input',
  '[aria-label="Enter your password"]'
];
```

### 3. AI Content Generation Reliability

**Challenge:** Ensuring consistent, professional email content generation.

**Solutions Implemented:**
- **Structured Prompts**: Clear formatting instructions for AI
- **Response Parsing**: Robust parsing of AI-generated content
- **Fallback Parsing**: Multiple parsing strategies for different AI responses
- **Context Preservation**: Maintain conversation context for better AI responses

```javascript
const prompt = `
You are an AI email assistant. Based on the following conversation context, generate a professional email:

Recipient: ${context.recipient}
Purpose: ${context.purpose}
Additional Details: ${context.details.join(', ')}

Please generate:
1. A clear, professional subject line
2. A well-structured email body

Format your response as:
SUBJECT: [subject line]
BODY: [email body]
`;
```

### 4. Error Handling & User Experience

**Challenge:** Providing clear feedback during complex automation processes.

**Solutions Implemented:**
- **Progressive Feedback**: Console logs at each automation step
- **Visual Logging**: Screenshots for debugging
- **Graceful Error Recovery**: Continue with fallback strategies
- **User-Friendly Messages**: Clear, actionable error messages

### 5. Environment Configuration

**Challenge:** Complex setup requirements with multiple API keys and credentials.

**Solutions Implemented:**
- **Environment Validation**: Check all required variables on startup
- **Clear Documentation**: Step-by-step setup instructions
- **Security Best Practices**: App passwords instead of regular passwords
- **Setup Guide**: Dedicated SETUP.md with troubleshooting

### 6. Cross-Platform Compatibility

**Challenge:** Ensuring the application works across different operating systems.

**Solutions Implemented:**
- **ES6 Modules**: Modern JavaScript syntax for better compatibility
- **Path Handling**: Cross-platform path resolution
- **Browser Compatibility**: Playwright's multi-browser support
- **Environment Variables**: Consistent configuration across platforms

## 🔒 Security Considerations

### Authentication Security
- **App Passwords**: Use Gmail App Passwords instead of regular passwords
- **Environment Variables**: Secure storage of sensitive credentials
- **No Hardcoding**: All credentials stored in environment variables

### API Security
- **Rate Limiting**: Respect API rate limits
- **Error Handling**: Secure error messages that don't expose sensitive data
- **Input Validation**: Validate all user inputs before processing

### Browser Security
- **Stealth Mode**: Avoid detection by Gmail's security systems
- **Session Management**: Proper cleanup of browser sessions
- **Screenshot Security**: Screenshots may contain sensitive data - handle carefully

## 🚨 Troubleshooting

### Common Issues

1. **"Gmail is requesting additional verification"**
   - **Solution**: Log into Gmail manually from the same device first
   - **Prevention**: Complete verification steps and enable App Passwords

2. **"Password field not found"**
   - **Solution**: Check screenshots folder for visual debugging
   - **Prevention**: Try logging in manually first to establish session

3. **"Compose button not found"**
   - **Solution**: Check internet connection and Gmail loading
   - **Prevention**: Ensure stable internet connection

4. **"Error generating email content"**
   - **Solution**: Verify Gemini API key and credits
   - **Prevention**: Check API key validity and internet connectivity

### Debug Mode

The application runs in non-headless mode by default for debugging. For production use, modify `emailSender.js`:

```javascript
browser = await chromium.launch({ 
  headless: true, // Change to true for production
  slowMo: 1000
});
```

## 📊 Performance Considerations

### Optimization Strategies
- **Selective Screenshots**: Only capture screenshots at key steps
- **Timeout Management**: Appropriate timeouts for network operations
- **Resource Cleanup**: Proper browser session cleanup
- **Error Recovery**: Fast fallback strategies for failed operations

### Scalability
- **Modular Design**: Easy to extend with new features
- **Configuration-Driven**: Environment-based configuration
- **Plugin Architecture**: Easy to add new automation targets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

ISC License

## 🙏 Acknowledgments

- Google Gemini AI for content generation capabilities
- Playwright team for excellent browser automation tools
- Inquirer.js for rich CLI interaction
- The Node.js community for the robust ecosystem 