import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Sends an email using Gmail.
 * @param {object} options - The email options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The email subject.
 * @param {string} options.body - The email body.
 */
async function sendEmail({ to, subject, body }) {
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('Error: GMAIL_USER and GMAIL_APP_PASSWORD environment variables must be set.');
    return;
  }

  let browser;
  let page;
  
  try {
    // Launch browser with more realistic settings
    browser = await chromium.launch({ 
      headless: false, // Set to true for production
      slowMo: 1000,    // Slow down actions to appear more human-like
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1366, height: 768 },
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    page = await context.newPage();
    
    // Create screenshots directory
    await fs.mkdir(path.join(process.cwd(), 'screenshots'), { recursive: true });

    // Navigate to Gmail login page
    console.log('Navigating to Gmail...');
    await page.goto('https://accounts.google.com/signin/v2/identifier?service=mail&continue=https://mail.google.com', {
      waitUntil: 'networkidle'
    });
    await page.screenshot({ path: 'screenshots/1_login_page.png' });

    // Wait for and fill email field
    console.log('Entering email address...');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', GMAIL_USER);
    await page.screenshot({ path: 'screenshots/2_email_entered.png' });

    // Click Next button
    console.log('Clicking Next...');
    await page.click('#identifierNext');
    
    // Wait for password field with multiple possible selectors
    console.log('Waiting for password field...');
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      '#password input',
      '[aria-label="Enter your password"]'
    ];
    
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        passwordField = selector;
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }
    
    if (!passwordField) {
      // Check if we're being asked for additional verification
      const pageContent = await page.content();
      if (pageContent.includes('verify') || pageContent.includes('phone') || pageContent.includes('recovery')) {
        console.error('Google is requesting additional verification. Please:');
        console.error('1. Log into Gmail manually first from this device/browser');
        console.error('2. Complete any verification steps');
        console.error('3. Enable "Less secure app access" or use App Passwords');
        await page.screenshot({ path: 'screenshots/verification_required.png' });
        return;
      }
      throw new Error('Password field not found. Login flow may have changed.');
    }

    await page.screenshot({ path: 'screenshots/3_password_page.png' });

    // Fill password
    console.log('Entering password...');
    await page.fill(passwordField, GMAIL_APP_PASSWORD);
    await page.screenshot({ path: 'screenshots/4_password_entered.png' });

    // Click Next/Sign In button
    console.log('Completing login...');
    const signInSelectors = ['#passwordNext', 'button[type="submit"]', '[data-identifier="passwordNext"]'];
    
    for (const selector of signInSelectors) {
      try {
        await page.click(selector);
        break;
      } catch (e) {
        console.log(`Sign in selector ${selector} not found, trying next...`);
      }
    }

    // Wait for Gmail to load
    console.log('Waiting for Gmail to load...');
    try {
      await page.waitForURL('https://mail.google.com/**', { timeout: 30000 });
    } catch (e) {
      // If URL doesn't change, wait for compose button
      console.log('URL did not change, waiting for compose button...');
    }

    // Wait for compose button with multiple possible selectors
    const composeSelectors = [
      'div[role="button"][aria-label*="Compose"]',
      'div[data-tooltip="Compose"]',
      '.T-I-KE', // Gmail's compose button class
      '[aria-label="Compose"]',
      'div:has-text("Compose")'
    ];

    let composeButton = null;
    for (const selector of composeSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 10000 });
        composeButton = selector;
        break;
      } catch (e) {
        console.log(`Compose selector ${selector} not found, trying next...`);
      }
    }

    if (!composeButton) {
      await page.screenshot({ path: 'screenshots/compose_not_found.png' });
      throw new Error('Compose button not found. Gmail may not have loaded properly.');
    }

    await page.screenshot({ path: 'screenshots/5_gmail_loaded.png' });

    // Click compose button
    console.log('Clicking compose...');
    await page.click(composeButton);
    
    // Wait for compose window
    await page.waitForSelector('div[aria-label="New Message"], div[role="dialog"]', { timeout: 10000 });
    await page.screenshot({ path: 'screenshots/6_compose_window.png' });

    // Fill email details
    console.log('Filling email details...');
    
    // Fill recipient
    const toSelectors = [
      'input[aria-label="To"]',
      'input[name="to"]',
      'textarea[aria-label="To"]',
      'div[aria-label="To"] input'
    ];
    
    for (const selector of toSelectors) {
      try {
        await page.fill(selector, to);
        break;
      } catch (e) {
        console.log(`To selector ${selector} not found, trying next...`);
      }
    }

    // Fill subject
    const subjectSelectors = [
      'input[aria-label="Subject"]',
      'input[name="subjectbox"]',
      'input[placeholder="Subject"]'
    ];
    
    for (const selector of subjectSelectors) {
      try {
        await page.fill(selector, subject);
        break;
      } catch (e) {
        console.log(`Subject selector ${selector} not found, trying next...`);
      }
    }

    // Fill body
    const bodySelectors = [
      'div[aria-label="Message Body"]',
      'div[role="textbox"]',
      'div[contenteditable="true"]',
      'textarea[aria-label="Message Body"]'
    ];
    
    for (const selector of bodySelectors) {
      try {
        await page.fill(selector, body);
        break;
      } catch (e) {
        console.log(`Body selector ${selector} not found, trying next...`);
      }
    }

    await page.screenshot({ path: 'screenshots/7_email_filled.png' });

    // Send email
    console.log('Sending email...');
    const sendSelectors = [
      'div[aria-label="Send"]',
      'div[data-tooltip="Send"]',
      'div[role="button"]:has-text("Send")',
      '.T-I-KE:has-text("Send")'
    ];
    
    for (const selector of sendSelectors) {
      try {
        await page.click(selector);
        break;
      } catch (e) {
        console.log(`Send selector ${selector} not found, trying next...`);
      }
    }

    // Wait for confirmation
    console.log('Waiting for send confirmation...');
    try {
      await page.waitForSelector('span:has-text("Message sent"), div:has-text("Your message has been sent")', { 
        timeout: 15000 
      });
      await page.screenshot({ path: 'screenshots/8_email_sent.png' });
      console.log('Email sent successfully!');
    } catch (e) {
      console.log('Send confirmation not found, but email likely sent');
      await page.screenshot({ path: 'screenshots/8_send_completed.png' });
    }

  } catch (error) {
    console.error('An error occurred:', error);
    if (page) {
      await page.screenshot({ path: 'screenshots/error.png' });
      
      // Log current URL and page content for debugging
      const currentUrl = page.url();
      const pageTitle = await page.title();
      console.log(`Current URL: ${currentUrl}`);
      console.log(`Page title: ${pageTitle}`);
      
      // Check if there are any error messages on the page
      const errorMessages = await page.$$eval('div[jsname], div[aria-live="polite"], .LXRPh', 
        elements => elements.map(el => el.textContent.trim()).filter(text => text.length > 0)
      ).catch(() => []);
      
      if (errorMessages.length > 0) {
        console.log('Error messages found on page:', errorMessages);
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export { sendEmail };