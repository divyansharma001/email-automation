import { GoogleGenerativeAI } from '@google/generative-ai';
import inquirer from 'inquirer';
import 'dotenv/config';
import { sendEmail } from './emailSender.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Comprehensive conversation context
let conversationContext = {
  // Basic Info
  senderName: '',
  senderTitle: '',
  senderCompany: '',
  senderContact: '',
  
  // Recipient Info
  recipientEmail: '',
  recipientName: '',
  recipientTitle: '',
  recipientCompany: '',
  
  // Email Details
  emailType: '',
  purpose: '',
  urgency: '',
  tone: '',
  
  // Content Details
  specificDetails: [],
  achievements: [],
  skills: [],
  experience: '',
  education: '',
  projects: [],
  
  // Additional Context
  deadline: '',
  followUpNeeded: '',
  attachments: [],
  callToAction: '',
  additionalNotes: ''
};

// Email templates and prompts
const emailTemplates = {
  internship: {
    name: 'Internship Application',
    requiredFields: ['skills', 'education', 'experience', 'projects'],
    prompt: `You are a professional email writing assistant. Create a compelling internship application email that showcases the candidate's potential.

Guidelines:
- Use a professional, enthusiastic but not overly eager tone
- Highlight relevant skills and experience
- Show genuine interest in the company/role
- Include specific examples when possible
- Keep it concise but comprehensive
- End with a clear call to action`
  },
  
  job_application: {
    name: 'Job Application',
    requiredFields: ['skills', 'experience', 'achievements'],
    prompt: `Create a professional job application email that demonstrates the candidate's qualifications and fit for the role.

Guidelines:
- Professional and confident tone
- Highlight key achievements and relevant experience
- Show understanding of the role and company
- Use specific examples and metrics when possible
- Clear value proposition`
  },
  
  networking: {
    name: 'Professional Networking',
    requiredFields: ['purpose', 'callToAction'],
    prompt: `Create a professional networking email that builds genuine connections.

Guidelines:
- Warm and professional tone
- Clear purpose for reaching out
- Offer value or mutual benefit
- Respectful of recipient's time
- Clear next steps`
  },
  
  follow_up: {
    name: 'Follow-up Email',
    requiredFields: ['purpose', 'callToAction'],
    prompt: `Create a professional follow-up email that is polite and effective.

Guidelines:
- Polite and professional tone
- Reference previous interaction
- Clear purpose for following up
- Respectful of recipient's time
- Specific call to action`
  },
  
  meeting_request: {
    name: 'Meeting Request',
    requiredFields: ['purpose', 'deadline'],
    prompt: `Create a professional meeting request email that is clear and compelling.

Guidelines:
- Clear and direct tone
- Specific meeting purpose and agenda
- Suggested times and format
- Respectful of recipient's schedule
- Clear value proposition for the meeting`
  },
  
  custom: {
    name: 'Custom Email',
    requiredFields: ['purpose'],
    prompt: `Create a professional email based on the specific requirements provided.

Guidelines:
- Match the appropriate tone for the context
- Clear and well-structured content
- Professional formatting
- Appropriate call to action`
  }
};

// Advanced email generation with LangChain-style prompting
async function generateProfessionalEmail(context) {
  const template = emailTemplates[context.emailType] || emailTemplates.custom;
  
  const systemPrompt = `You are a professional email writing expert with years of experience crafting compelling business communications. ${template.prompt}

Context Information:
- Sender: ${context.senderName}${context.senderTitle ? ` (${context.senderTitle})` : ''}
- Company: ${context.senderCompany || 'N/A'}
- Recipient: ${context.recipientName || 'Hiring Manager'}${context.recipientTitle ? ` (${context.recipientTitle})` : ''}
- Company: ${context.recipientCompany || 'N/A'}
- Email Type: ${template.name}
- Urgency: ${context.urgency || 'Normal'}
- Tone: ${context.tone || 'Professional'}

Content Details:
- Purpose: ${context.purpose}
- Skills: ${context.skills.join(', ') || 'N/A'}
- Experience: ${context.experience || 'N/A'}
- Education: ${context.education || 'N/A'}
- Projects: ${context.projects.join(', ') || 'N/A'}
- Achievements: ${context.achievements.join(', ') || 'N/A'}
- Specific Details: ${context.specificDetails.join(', ') || 'N/A'}
- Deadline: ${context.deadline || 'N/A'}
- Call to Action: ${context.callToAction || 'N/A'}
- Additional Notes: ${context.additionalNotes || 'N/A'}

Requirements:
1. Generate a compelling, specific subject line (no placeholders)
2. Write a professional email body with proper structure
3. Use the sender's actual name and details (no placeholders like [Your Name])
4. Include specific, relevant details from the context
5. Make it sound natural and human-written
6. Ensure proper email etiquette and formatting

Format your response EXACTLY as:
SUBJECT: [specific subject line]
BODY: [complete email body with proper formatting]

Do not use any placeholders. Use the actual information provided.`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response
    const subjectMatch = text.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
    const bodyMatch = text.match(/BODY:\s*([\s\S]*)/i);
    
    if (subjectMatch && bodyMatch) {
      return {
        subject: subjectMatch[1].trim(),
        body: bodyMatch[1].trim()
      };
    } else {
      throw new Error('Failed to parse email content');
    }
  } catch (error) {
    console.error('Error generating email content:', error);
    throw new Error('Failed to generate email content');
  }
}

// Enhanced information gathering
async function gatherInformation() {
  console.log('\n🤖 Welcome to your Professional AI Email Assistant!');
  console.log('I\'ll help you create a compelling, professional email by gathering some key information.\n');

  // Step 1: Basic sender information
  console.log('📝 First, let me get your basic information:');
  
  const senderInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'senderName',
      message: 'What is your full name?',
      validate: input => input.trim() ? true : 'Please enter your name'
    },
    {
      type: 'input',
      name: 'senderTitle',
      message: 'What is your current title/position? (e.g., Computer Science Student, Software Developer)',
      default: ''
    },
    {
      type: 'input',
      name: 'senderCompany',
      message: 'What is your current company/university?',
      default: ''
    }
  ]);

  Object.assign(conversationContext, senderInfo);

  // Step 2: Recipient information
  console.log('\n👤 Now, about the recipient:');
  
  const recipientInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'recipientEmail',
      message: 'Recipient\'s email address:',
      validate: input => {
        if (!input.trim()) return 'Please enter an email address';
        if (!input.includes('@')) return 'Please enter a valid email address';
        return true;
      }
    },
    {
      type: 'input',
      name: 'recipientName',
      message: 'Recipient\'s name (if known):',
      default: ''
    },
    {
      type: 'input',
      name: 'recipientTitle',
      message: 'Recipient\'s title (if known):',
      default: ''
    },
    {
      type: 'input',
      name: 'recipientCompany',
      message: 'Recipient\'s company:',
      default: ''
    }
  ]);

  Object.assign(conversationContext, recipientInfo);

  // Step 3: Email type and purpose
  console.log('\n📧 What type of email are you sending?');
  
  const emailTypeInfo = await inquirer.prompt([
    {
      type: 'list',
      name: 'emailType',
      message: 'Select the type of email:',
      choices: [
        { name: 'Internship Application', value: 'internship' },
        { name: 'Job Application', value: 'job_application' },
        { name: 'Professional Networking', value: 'networking' },
        { name: 'Follow-up Email', value: 'follow_up' },
        { name: 'Meeting Request', value: 'meeting_request' },
        { name: 'Custom Email', value: 'custom' }
      ]
    },
    {
      type: 'input',
      name: 'purpose',
      message: 'What is the specific purpose of this email?',
      validate: input => input.trim() ? true : 'Please describe the purpose'
    },
    {
      type: 'list',
      name: 'tone',
      message: 'What tone should the email have?',
      choices: ['Professional', 'Friendly Professional', 'Formal', 'Casual Professional']
    },
    {
      type: 'list',
      name: 'urgency',
      message: 'How urgent is this email?',
      choices: ['Normal', 'High Priority', 'Time Sensitive', 'Low Priority']
    }
  ]);

  Object.assign(conversationContext, emailTypeInfo);

  // Step 4: Content-specific information
  await gatherContentDetails();

  // Step 5: Additional details
  await gatherAdditionalDetails();
}

async function gatherContentDetails() {
  const template = emailTemplates[conversationContext.emailType];
  
  console.log('\n💼 Let me gather some specific details to make your email more compelling:');

  if (template.requiredFields.includes('skills')) {
    const skillsAnswer = await inquirer.prompt([{
      type: 'input',
      name: 'skills',
      message: 'What are your key skills relevant to this email? (comma-separated)',
      default: ''
    }]);
    conversationContext.skills = skillsAnswer.skills.split(',').map(s => s.trim()).filter(s => s);
  }

  if (template.requiredFields.includes('experience')) {
    const experienceAnswer = await inquirer.prompt([{
      type: 'input',
      name: 'experience',
      message: 'Describe your relevant work experience:',
      default: ''
    }]);
    conversationContext.experience = experienceAnswer.experience;
  }

  if (template.requiredFields.includes('education')) {
    const educationAnswer = await inquirer.prompt([{
      type: 'input',
      name: 'education',
      message: 'What is your educational background?',
      default: ''
    }]);
    conversationContext.education = educationAnswer.education;
  }

  if (template.requiredFields.includes('projects')) {
    const projectsAnswer = await inquirer.prompt([{
      type: 'input',
      name: 'projects',
      message: 'Any relevant projects to mention? (comma-separated)',
      default: ''
    }]);
    conversationContext.projects = projectsAnswer.projects.split(',').map(p => p.trim()).filter(p => p);
  }

  if (template.requiredFields.includes('achievements')) {
    const achievementsAnswer = await inquirer.prompt([{
      type: 'input',
      name: 'achievements',
      message: 'Any key achievements or accomplishments? (comma-separated)',
      default: ''
    }]);
    conversationContext.achievements = achievementsAnswer.achievements.split(',').map(a => a.trim()).filter(a => a);
  }

  // Always ask for specific details
  const detailsAnswer = await inquirer.prompt([{
    type: 'input',
    name: 'specificDetails',
    message: 'Any specific details you want to include in the email?',
    default: ''
  }]);
  
  if (detailsAnswer.specificDetails) {
    conversationContext.specificDetails = detailsAnswer.specificDetails.split(',').map(d => d.trim()).filter(d => d);
  }
}

async function gatherAdditionalDetails() {
  console.log('\n🎯 Finally, a few more details to perfect your email:');

  const additionalInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'callToAction',
      message: 'What action do you want the recipient to take?',
      default: ''
    },
    {
      type: 'input',
      name: 'deadline',
      message: 'Is there a deadline or time frame? (optional)',
      default: ''
    },
    {
      type: 'confirm',
      name: 'followUpNeeded',
      message: 'Do you plan to follow up on this email?',
      default: false
    },
    {
      type: 'input',
      name: 'additionalNotes',
      message: 'Any additional notes or context?',
      default: ''
    }
  ]);

  Object.assign(conversationContext, additionalInfo);
}

// Enhanced email preview and confirmation
async function previewAndConfirm(emailContent) {
  console.log('\n' + '='.repeat(80));
  console.log('📧 EMAIL PREVIEW');
  console.log('='.repeat(80));
  console.log(`To: ${conversationContext.recipientEmail}`);
  console.log(`Subject: ${emailContent.subject}`);
  console.log('\nBody:');
  console.log(emailContent.body);
  console.log('='.repeat(80));

  const confirmation = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { name: '✅ Send this email', value: 'send' },
      { name: '✏️  Edit the email', value: 'edit' },
      { name: '🔄 Regenerate with different tone', value: 'regenerate' },
      { name: '❌ Cancel', value: 'cancel' }
    ]
  }]);

  return confirmation.action;
}

// Main application flow
async function startApplication() {
  try {
    // Gather all information
    await gatherInformation();
    
    console.log('\n🚀 Generating your professional email...');
    
    // Generate email content
    const emailContent = await generateProfessionalEmail(conversationContext);
    
    let action = await previewAndConfirm(emailContent);
    
    while (action !== 'send' && action !== 'cancel') {
      if (action === 'edit') {
        const editAnswer = await inquirer.prompt([{
          type: 'input',
          name: 'editInstructions',
          message: 'What changes would you like to make?'
        }]);
        
        // Add edit instructions to context and regenerate
        conversationContext.additionalNotes += ` Edit request: ${editAnswer.editInstructions}`;
        const newEmailContent = await generateProfessionalEmail(conversationContext);
        action = await previewAndConfirm(newEmailContent);
        
      } else if (action === 'regenerate') {
        const toneAnswer = await inquirer.prompt([{
          type: 'list',
          name: 'newTone',
          message: 'Select a different tone:',
          choices: ['Professional', 'Friendly Professional', 'Formal', 'Casual Professional']
        }]);
        
        conversationContext.tone = toneAnswer.newTone;
        const newEmailContent = await generateProfessionalEmail(conversationContext);
        action = await previewAndConfirm(newEmailContent);
      }
    }
    
    if (action === 'send') {
      console.log('\n📤 Sending your email...');
      
      try {
        await sendEmail({
          to: conversationContext.recipientEmail,
          subject: emailContent.subject,
          body: emailContent.body
        });
        
        console.log('✅ Email sent successfully!');
        console.log('📸 Check the screenshots folder for the complete visual log.');
        
      } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.log('Please check your Gmail credentials and try again.');
      }
    } else {
      console.log('📧 Email cancelled. No email was sent.');
    }
    
  } catch (error) {
    console.error('❌ An error occurred:', error.message);
  }
}

// Application entry point
async function main() {
  try {
    // Environment validation
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Error: GEMINI_API_KEY environment variable is required.');
      console.log('Please add your Gemini API key to your .env file.');
      process.exit(1);
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ Error: GMAIL_USER and GMAIL_APP_PASSWORD environment variables are required.');
      console.log('Please add your Gmail credentials to your .env file.');
      process.exit(1);
    }

    await startApplication();
    
  } catch (error) {
    console.error('❌ An unexpected error occurred:', error.message);
    process.exit(1);
  }
}

// Start the application
main();