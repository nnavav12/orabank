import emailjs from '@emailjs/browser';

// Initialize EmailJS with your Public Key
// Get these from: https://dashboard.emailjs.com
export const initEmailJS = () => {
  emailjs.init({
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
  });
};

// Configuration constants
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_qh1p3sh',
  loginTemplateId: import.meta.env.VITE_EMAILJS_LOGIN_TEMPLATE_ID || 'cJcTNwUcLcI7uY3l-',
};
