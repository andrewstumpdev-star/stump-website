/* ─── Contact Form ────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');
  const statusEl  = document.getElementById('form-status');
  const serviceSelect = document.getElementById('service');

  applyInquiryParam();

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    if (statusEl) statusEl.style.display = 'none';

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        window.location.href = 'thanks.html';
      } else {
        const json = await response.json().catch(() => ({}));
        const msg = (json.errors && json.errors[0] && json.errors[0].message)
          || 'Something went wrong. Please email us directly at officestumpdev@gmail.com.';
        showStatus('error', msg);
      }
    } catch (_) {
      showStatus('error', 'Unable to send. Please email us at officestumpdev@gmail.com.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  function showStatus(type, message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'form-status form-status--' + type;
    statusEl.style.display = 'block';
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function applyInquiryParam() {
    if (!serviceSelect) return;

    const params = new URLSearchParams(window.location.search);
    const interest = params.get('interest');
    const legacyService = params.get('service');
    const selected = mapInquiry(interest) || mapInquiry(legacyService);

    if (selected) serviceSelect.value = selected;
  }

  function mapInquiry(value) {
    const inquiryMap = {
      intelligence: 'intelligence',
      partnership: 'partnership',
      'development-partnership': 'partnership',
      capital: 'capital',
      'capital-partnership': 'capital',
      'design-build-gc': 'design-build-gc',
      'design-build': 'design-build-gc',
      'permitting-preconstruction': 'permitting-preconstruction',
      permitting: 'permitting-preconstruction',
      'site-evaluation': 'site-evaluation',
      general: 'general',
      sample: 'intelligence',
      'stump-report': 'intelligence',
      'development-brief': 'intelligence',
      'feasibility-study': 'intelligence',
      'risk-assessment': 'site-evaluation',
      'hbu-diagnostic': 'site-evaluation'
    };

    return inquiryMap[value] || '';
  }
})();
