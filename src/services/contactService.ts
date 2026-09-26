export interface InquiryPayload {
  name: string;
  email: string;
  type: string;
  message: string;
  botcheck?: string; // Honeypot field - bots fill this in, humans never see it
  recaptchaToken?: string; // Google reCAPTCHA verification token
}

export interface InquiryResult {
  success: boolean;
  provider: 'web3forms' | 'mailto';
  message: string;
}


// Sanitize user input to prevent XSS and strip unwanted HTML/script injections
function sanitizeInput(text: string, maxLength: number): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[<>]/g, '') // Remove dangerous brackets
    .trim()
    .slice(0, maxLength);
}

// RFC 5322 standard email regex validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

export async function sendInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  // 1. Honeypot check: If the hidden botcheck field has any value, a bot filled it out.
  // Silently drop it and return fake success so bots do not attempt retry exploits.
  if (payload.botcheck && payload.botcheck.trim() !== '') {
    console.warn('Bot detected via honeypot trap. Submission dropped silently.');
    return {
      success: true,
      provider: 'web3forms',
      message: 'Your inquiry has been received! Alfie will review your details shortly.'
    };
  }

  // 2. Input sanitization & security bounds
  const cleanName = sanitizeInput(payload.name, 100);
  const cleanEmail = sanitizeInput(payload.email, 120);
  const cleanType = sanitizeInput(payload.type || 'General Inquiry', 100);
  const cleanMessage = sanitizeInput(payload.message, 3000);

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return {
      success: false,
      provider: 'web3forms',
      message: 'Please ensure all required fields are filled out correctly.'
    };
  }

  if (!isValidEmail(cleanEmail)) {
    return {
      success: false,
      provider: 'web3forms',
      message: 'Please provide a valid email address.'
    };
  }

  const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (web3FormsKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          name: cleanName,
          email: cleanEmail,
          replyto: cleanEmail,
          subject: `New Project Inquiry: [${cleanType}] from ${cleanName}`,
          project_type: cleanType,
          message: cleanMessage,
          from_name: 'Alfie Lynard Portfolio',
          botcheck: payload.botcheck || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          provider: 'web3forms',
          message: 'Your inquiry has been sent successfully! Alfie will review your details and get back to you within 24 hours.'
        };
      } else {
        console.error('Web3Forms returned an error:', data);
        return {
          success: false,
          provider: 'web3forms',
          message: data.message || 'Unable to send inquiry through Web3Forms. Please try again or reach out directly.'
        };
      }
    } catch (err) {
      console.error('Network error communicating with Web3Forms:', err);
    }
  }

  // Fallback: If network is offline or Web3Forms is unavailable, launch direct email client
  const subject = encodeURIComponent(
    `Project inquiry: [${cleanType}] from ${cleanName}`
  );
  const body = encodeURIComponent(
    `Hi Alfie,\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nProject Category: ${cleanType}\n\nProject Details:\n${cleanMessage}`
  );

  window.open(`mailto:alfielynard23@gmail.com?subject=${subject}&body=${body}`, '_blank');

  return {
    success: true,
    provider: 'mailto',
    message: 'Opening your email client to send this inquiry directly to alfielynard23@gmail.com...'
  };
}
