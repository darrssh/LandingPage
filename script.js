(() => {
  /* ============================================================
     CompanyName — site behaviour
     - mobile navigation
     - current year
     - "Request a Quote" modal (injected once, shared by every page)
     - front-end only enquiry / quote forms
     ============================================================ */

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }));
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll('#year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Shared form helper ----------
     Forms validate locally and open the visitor's email app with a
     pre-filled draft. No data is transmitted or stored on a server. */
  const setupForm = ({ formId, statusId, subjectPrefix, buildBody, successMessage }) => {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form || !status) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.classList.remove('error');

      if (!form.reportValidity()) {
        status.textContent = 'Please complete the required fields and check your consent.';
        status.classList.add('error');
        return;
      }

      const data = new FormData(form);
      const subject = `${subjectPrefix} — ${data.get('company') || 'Website enquiry'}`;
      const body = buildBody(data, form).join('\n');

      status.textContent = successMessage;
      const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  };

  /* ---------- Request a Quote modal ----------
     The modal markup lives in one place here and is injected into
     every page, so the quote form is never duplicated in the HTML.
     The form is intentionally short: four essentials, one optional
     select and one optional note. */
  const pathPrefix = document.querySelector('link[rel="stylesheet"][href^="../"]') ? '../' : '';

  const modalMarkup = `
  <div class="modal" id="quote-modal" aria-hidden="true">
    <div class="modal-backdrop" data-modal-close></div>
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
      <button class="modal-close" type="button" data-modal-close aria-label="Close request form">&times;</button>
      <div class="modal-scroll">
        <div class="modal-head">
          <p class="eyebrow">REQUEST A QUOTE</p>
          <h2 id="quote-modal-title">Get a Tailored Collection Proposal</h2>
          <p class="modal-lede">Share a few details and our team will prepare a tailored approach and commercial proposal.</p>
          <ul class="modal-trust">
            <li><span aria-hidden="true">&#10003;</span> Reply within 1 business day</li>
            <li><span aria-hidden="true">&#10003;</span> NDA on request</li>
            <li><span aria-hidden="true">&#10003;</span> No obligation</li>
          </ul>
        </div>

        <form class="contact-form quote-form" id="quote-form" novalidate>
          <div class="form-grid">
            <label>Full name <span>*</span><input name="person" autocomplete="name" required placeholder="Your name"></label>
            <label>Work email <span>*</span><input name="email" type="email" autocomplete="email" required placeholder="name@company.com"></label>
            <label>Company <span>*</span><input name="company" autocomplete="organization" required placeholder="Company name"></label>
            <label>Phone <span>*</span><input name="phone" type="tel" autocomplete="tel" required inputmode="tel" placeholder="+91"></label>
            <label class="full">Service of interest<select name="service">
              <option value="">Select a service</option>
              <option>Tele-Collection</option>
              <option>Field Collection</option>
              <option>Legal Coordination</option>
              <option>Skip Tracing</option>
              <option>Early Delinquency</option>
              <option>Portfolio Recovery</option>
              <option>Receivables Management</option>
              <option>Customer Connect</option>
              <option>Not sure yet</option>
            </select></label>
            <label class="full">Brief requirement<textarea name="requirements" rows="3" placeholder="Portfolio size, timelines or anything specific"></textarea></label>
          </div>

          <label class="consent"><input type="checkbox" name="consent" required><span>I agree to be contacted about this enquiry and have read the privacy notice. <b>*</b></span></label>
          <button class="button button-orange submit-button" type="submit">Request a Quote <span aria-hidden="true">&rarr;</span></button>
          <p class="form-hint">Demo form: it prepares an email draft on your device; it does not send or store data on a server.</p>
          <div class="form-status" id="quote-status" role="status" aria-live="polite"></div>
        </form>

        <div class="modal-next">
          <span class="modal-next-label">What happens next</span>
          <ol class="modal-steps">
            <li>Review</li><li>Discovery call</li><li>Proposal</li><li>Onboarding</li>
          </ol>
        </div>

        <div class="modal-alt">
          <span>Prefer to talk first? Our team is happy to schedule a discovery call.</span>
          <a href="${pathPrefix}Contact/index.html">Contact us instead &rarr;</a>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.getElementById('quote-modal');
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const openModal = (trigger) => {
    lastFocused = trigger || document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const first = modal.querySelector(focusableSelector);
    if (first) setTimeout(() => first.focus(), 20);
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  };

  document.querySelectorAll('[data-quote-open]').forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(trigger);
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') { closeModal(); return; }
    if (event.key !== 'Tab') return;

    const items = Array.from(modal.querySelectorAll(focusableSelector))
      .filter(el => el.offsetParent !== null);
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Support deep links such as index.html#quote
  if (window.location.hash === '#quote') {
    openModal(document.querySelector('[data-quote-open]'));
  }

  /* ---------- Quote form (inside the modal) ---------- */
  setupForm({
    formId: 'quote-form',
    statusId: 'quote-status',
    subjectPrefix: 'CompanyName quote request',
    successMessage: 'Your email app will open with the quote request drafted. This demo does not submit data to a server.',
    buildBody: (data) => [
      'CompanyName quote request',
      '',
      `Name: ${data.get('person')}`,
      `Work email: ${data.get('email')}`,
      `Company: ${data.get('company')}`,
      `Phone: ${data.get('phone')}`,
      `Service of interest: ${data.get('service') || 'Not specified'}`,
      '',
      'Brief requirement:',
      `${data.get('requirements') || 'Not specified'}`,
      '',
      'Please configure the recipient email before publishing this demo.'
    ]
  });

  /* ---------- Contact page enquiry form ---------- */
  setupForm({
    formId: 'enquiry-form',
    statusId: 'form-status',
    subjectPrefix: 'CompanyName enquiry',
    successMessage: 'Your email app will open with the enquiry drafted. This demo does not submit data to a server.',
    buildBody: (data) => [
      'CompanyName website enquiry',
      '',
      `Company: ${data.get('company')}`,
      `Contact person: ${data.get('person')}`,
      `Business email: ${data.get('email')}`,
      `Phone: ${data.get('phone')}`,
      `Monthly account volume: ${data.get('volume')}`,
      `Requirements: ${data.get('requirements') || 'Not specified'}`,
      '',
      'Please configure the recipient email before publishing this demo.'
    ]
  });

  /* ---------- Home hero preview: illustrative sample metrics ----------
     The hero card shows a small "Collections workspace" preview. These
     figures are generated randomly on each load purely to demonstrate the
     interface — they are not real performance data and are labelled as
     illustrative in the UI. Ranges are set per tile via data-min/data-max. */
  document.querySelectorAll('[data-hero-metric]').forEach(el => {
    const min = Number(el.dataset.min) || 100;
    const max = Number(el.dataset.max) || 9999;
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    el.textContent = value.toLocaleString('en-US');
  });

  function initReveals() {
    const els = document.querySelectorAll('.reveal,.reveal-group');
    if (els.length === 0) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      els.forEach(el => {
        if (el.classList.contains('reveal')) el.classList.add('is-visible');
        if (el.classList.contains('reveal-group')) el.classList.add('is-visible');
      });
      return;
    }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -60px', threshold: 0.1 });
      els.forEach(el => io.observe(el));
    } else {
      els.forEach(el => {
        if (el.classList.contains('reveal')) el.classList.add('is-visible');
        if (el.classList.contains('reveal-group')) el.classList.add('is-visible');
      });
    }
  }

  initReveals();
})();
