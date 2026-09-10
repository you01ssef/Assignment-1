document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const isExpanded = navMenu.classList.contains('show');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const generate2faBtn = document.getElementById('generate-2fa-btn');
  const verify2faBtn = document.getElementById('verify-2fa-btn');
  const codeDisplay = document.getElementById('current-otp-display');
  const otpInput = document.getElementById('otp-user-input');
  const otpResult = document.getElementById('otp-result-msg');

  let activeCode = '';

  if (generate2faBtn && codeDisplay) {
    generate2faBtn.addEventListener('click', () => {
      activeCode = Math.floor(100000 + Math.random() * 900000).toString();
      codeDisplay.textContent = activeCode;
      codeDisplay.style.color = '#00f2fe';
      if (otpResult) {
        otpResult.textContent = 'New 6-digit TOTP token generated! Enter it below to test verification.';
        otpResult.style.color = '#94a3b8';
      }
    });
  }

  if (verify2faBtn && otpInput && otpResult) {
    verify2faBtn.addEventListener('click', () => {
      const entered = otpInput.value.trim();
      if (!activeCode) {
        otpResult.textContent = '⚠️ Click "Generate Token" first to simulate an authenticator app!';
        otpResult.style.color = '#f59e0b';
        return;
      }
      if (entered === activeCode) {
        otpResult.textContent = '✅ Authentication Successful! Primary password + 2FA verified. Access granted.';
        otpResult.style.color = '#10b981';
      } else {
        otpResult.textContent = '❌ Verification Failed! Invalid OTP token. The unauthorized attempt was blocked.';
        otpResult.style.color = '#f43f5e';
      }
    });
  }
});
