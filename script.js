/* ─────────────────────────────────────────────
   Jake Woollard Portfolio — script.js
   ───────────────────────────────────────────── */

(function () {
  'use strict';

  // ── Password (security through obscurity — see spec) ──
  const PASSWORD = 'hardware2software';
  const SESSION_KEY = 'jw_unlocked';

  // ── DOM refs ──
  const nav = document.querySelector('.nav');
  const lockBtn = document.querySelector('.lock-btn');
  const lockIcon = document.querySelector('.lock-icon');
  const unlockIcon = document.querySelector('.unlock-icon');
  const passwordPrompt = document.querySelector('.password-prompt');
  const passwordInput = document.querySelector('.password-input');
  const privateRows = document.querySelectorAll('.project-private');

  // ── Scroll: sticky nav ──
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Lock / unlock state ──
  function isUnlocked() {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  }

  function applyUnlocked() {
    document.body.classList.add('unlocked');
    if (lockIcon) lockIcon.style.display = 'none';
    if (unlockIcon) unlockIcon.style.display = 'block';
    if (lockBtn) lockBtn.classList.add('unlocked');
    if (lockBtn) lockBtn.setAttribute('aria-label', 'Projects unlocked');
  }

  function applyLocked() {
    document.body.classList.remove('unlocked');
    if (lockIcon) lockIcon.style.display = 'block';
    if (unlockIcon) unlockIcon.style.display = 'none';
    if (lockBtn) lockBtn.classList.remove('unlocked');
    if (lockBtn) lockBtn.setAttribute('aria-label', 'Unlock private projects');
  }

  // Restore from session
  if (isUnlocked()) applyUnlocked();

  // ── Lock button click ──
  if (lockBtn) {
    lockBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      if (isUnlocked()) {
        // Toggle back to locked
        sessionStorage.removeItem(SESSION_KEY);
        applyLocked();
        if (passwordPrompt) passwordPrompt.classList.remove('visible');
        return;
      }

      // Show/hide password prompt
      if (passwordPrompt) {
        const isVisible = passwordPrompt.classList.contains('visible');
        passwordPrompt.classList.toggle('visible', !isVisible);
        if (!isVisible && passwordInput) {
          passwordInput.value = '';
          passwordInput.focus();
        }
      }
    });
  }

  // ── Password submission ──
  if (passwordInput) {
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkPassword(passwordInput.value.trim());
      }
    });

    // Remove shake on input
    passwordInput.addEventListener('input', () => {
      passwordInput.classList.remove('shake');
    });
  }

  function checkPassword(value) {
    if (value === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      applyUnlocked();
      if (passwordPrompt) passwordPrompt.classList.remove('visible');
    } else {
      if (passwordInput) {
        passwordInput.classList.remove('shake');
        void passwordInput.offsetWidth; // reflow to restart animation
        passwordInput.classList.add('shake');
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  }

  // ── Close prompt on outside click ──
  document.addEventListener('click', (e) => {
    if (!passwordPrompt) return;
    if (!lockBtn?.contains(e.target) && !passwordPrompt.contains(e.target)) {
      passwordPrompt.classList.remove('visible');
    }
  });

  // ── Close prompt on Escape ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && passwordPrompt) {
      passwordPrompt.classList.remove('visible');
    }
  });

  // ── Smooth page load fade-in ──
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    // Already handled by CSS animation-delay, but ensure visible if JS runs late
    fadeEls.forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }

})();