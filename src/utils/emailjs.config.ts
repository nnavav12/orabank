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
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  loginTemplateId: import.meta.env.VITE_EMAILJS_LOGIN_TEMPLATE_ID || 'YOUR_LOGIN_TEMPLATE_ID',
};
