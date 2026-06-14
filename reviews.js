/* ============================================================
   ConcertID Review & Rating System
   Supabase primary, localStorage fallback
   ============================================================ */

(function () {
  'use strict';

  const LS_KEY = 'cid_reviews';

  /* ── localStorage fallback ── */
  function lsGetAll()     { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } }
  function lsSaveAll(d)   { localStorage.setItem(LS_KEY, JSON.stringify(d)); }
  function lsGetFor(id)   { return lsGetAll()[id] || []; }

  /* ── Supabase helpers ── */
  async function fetchReviews(concertId) {
    try {
      const rows = await DB.select('reviews',
        `concert_id=eq.${encodeURIComponent(concertId)}&order=created_at.desc`);
      return rows.map(r => ({
        id:      r.id,
        uid:     r.device_uid,
        author:  r.author,
        rating:  r.rating,
        comment: r.comment,
        date:    r.created_at,
        likes:   r.likes,
      }));
    } catch {
      return lsGetFor(concertId);
    }
  }

  async function addReview(concertId, { rating, comment, author }) {
    if (comment.trim().length < 10) return { ok: false, msg: 'Komentar minimal 10 karakter.' };
    if (rating < 1 || rating > 5)   return { ok: false, msg: 'Rating harus 1–5 bintang.' };
    const uid = getDeviceUID();
    try {
      // Cek duplikat
      const existing = await DB.select('reviews',
        `concert_id=eq.${encodeURIComponent(concertId)}&device_uid=eq.${uid}`);
      if (existing.length > 0) return { ok: false, msg: 'Kamu sudah pernah review konser ini!' };
      await DB.insert('reviews', {
        concert_id: concertId,
        device_uid: uid,
        author:     (author || 'Anonim').trim().slice(0, 30),
        rating:     parseInt(rating),
        comment:    sanitize(comment.trim()),
      });
      return { ok: true };
    } catch {
      // fallback localStorage
      const all = lsGetAll();
      if (!all[concertId]) all[concertId] = [];
      if (all[concertId].find(r => r.uid === uid)) return { ok: false, msg: 'Kamu sudah pernah review konser ini!' };
      all[concertId].push({ uid, author: author || 'Anonim', rating: parseInt(rating), comment: sanitize(comment.trim()), date: new Date().toISOString(), likes: 0 });
      lsSaveAll(all);
      return { ok: true };
    }
  }

  async function likeReview(concertId, reviewId) {
    try {
      const rows = await DB.select('reviews', `id=eq.${reviewId}&select=likes`);
      const cur  = rows[0]?.likes ?? 0;
      await DB.update('reviews', `id=eq.${reviewId}`, { likes: cur + 1 });
    } catch { /* silent */ }
  }

  /* ── Helpers ── */
  function getDeviceUIDLocal() {
    let uid = localStorage.getItem('cid_uid');
    if (!uid) { uid = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('cid_uid', uid); }
    return uid;
  }

  function sanitize(str) {
    return str.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').slice(0,500);
  }

  function avg(reviews) {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }

  function renderStars(rating, interactive = false, name = '') {
    if (!interactive) {
      const full  = Math.floor(rating);
      const empty = 5 - full;
      return `<span class="rv-stars-static">${'★'.repeat(full)}${'☆'.repeat(empty)}</span>`;
    }
    return [5,4,3,2,1].map(i => `
      <input type="radio" id="${name}_s${i}" name="${name}" value="${i}" class="rv-star-input" />
      <label for="${name}_s${i}" class="rv-star-label" title="${i} bintang">★</label>
    `).join('');
  }

  function renderReviewCard(r, concertId) {
    const ago    = timeAgo(new Date(r.date));
    const uid    = getDeviceUIDLocal();
    const isOwn  = r.uid === uid;
    return `
      <div class="rv-card" data-id="${r.id || ''}">
        <div class="rv-card-top">
          <div class="rv-card-author">
            <div class="rv-avatar">${r.author.charAt(0).toUpperCase()}</div>
            <div>
              <div class="rv-author-name">${r.author}${isOwn ? ' <span class="rv-you">Kamu</span>' : ''}</div>
              <div class="rv-date">${ago}</div>
            </div>
          </div>
          <div class="rv-rating-display">${renderStars(r.rating)}<span class="rv-rating-num">${r.rating}.0</span></div>
        </div>
        <p class="rv-comment">${r.comment}</p>
        <div class="rv-card-bottom">
          <button class="rv-like-btn" onclick="ConcertReviews.like('${concertId}', '${r.id || ''}', this)">
            👍 ${r.likes || 0}
          </button>
        </div>
      </div>`;
  }

  function renderReviewSection(concertId) {
    const uid      = getDeviceUIDLocal();
    const concert  = typeof CONCERTS !== 'undefined' ? CONCERTS.find(c => c.id === concertId) : null;
    const today    = typeof TODAY !== 'undefined' ? TODAY : new Date();
    const isPast   = concert ? concert.rawDate < today : false;
    const formName = `rvform_${concertId}`;

    // Async load
    setTimeout(async () => {
      const reviews   = await fetchReviews(concertId);
      const section   = document.getElementById(`rv_${concertId}`);
      if (!section) return;
      const avgR      = avg(reviews);
      const hasReviewed = reviews.some(r => r.uid === uid);
      const countEl   = section.querySelector('.rv-count');
      if (countEl) countEl.textContent = reviews.length ? `${reviews.length} review` : '';

      const dist = [5,4,3,2,1].map(s => ({
        star: s,
        count: reviews.filter(r => r.rating === s).length,
        pct:   reviews.length ? Math.round(reviews.filter(r => r.rating === s).length / reviews.length * 100) : 0,
      }));

      const summaryEl = section.querySelector('.rv-summary-wrap');
      if (summaryEl && reviews.length) {
        summaryEl.innerHTML = `
          <div class="rv-summary">
            <div class="rv-avg-wrap">
              <div class="rv-avg-num">${avgR.toFixed(1)}</div>
              <div>${renderStars(avgR)}</div>
              <div class="rv-avg-label">${reviews.length} review</div>
            </div>
            <div class="rv-dist">
              ${dist.map(d => `
                <div class="rv-dist-row">
                  <span class="rv-dist-star">${d.star}★</span>
                  <div class="rv-dist-track"><div class="rv-dist-fill" style="width:${d.pct}%"></div></div>
                  <span class="rv-dist-count">${d.count}</span>
                </div>`).join('')}
            </div>
          </div>`;
      }

      const alreadyEl = section.querySelector('.rv-already-wrap');
      if (alreadyEl) {
        alreadyEl.innerHTML = hasReviewed
          ? `<div class="rv-already">✅ Kamu sudah review konser ini. Terima kasih!</div>`
          : '';
      }

      const listEl = document.getElementById(`rvlist_${concertId}`);
      if (listEl) {
        listEl.innerHTML = reviews.length
          ? reviews.map(r => renderReviewCard(r, concertId)).join('')
          : `<div class="rv-empty">Belum ada review. Jadilah yang pertama! 🎵</div>`;
      }
    }, 0);

    return `
      <div class="rv-section" id="rv_${concertId}">
        <div class="rv-header">
          <h4>⭐ Review &amp; Rating</h4>
          <span class="rv-count"></span>
        </div>
        <div class="rv-summary-wrap"></div>
        <div class="rv-already-wrap"></div>
        ${isPast ? `
          <div class="rv-form-wrap">
            <h5>✍️ Tulis Review</h5>
            <form class="rv-form" onsubmit="ConcertReviews.submit(event, '${concertId}')">
              <div class="rv-star-picker">
                <label>Rating:</label>
                <div class="rv-stars-wrap">${renderStars(0, true, formName)}</div>
              </div>
              <input class="rv-author-input" type="text" placeholder="Nama kamu (opsional)" maxlength="30" />
              <textarea class="rv-textarea" placeholder="Bagaimana konsernya? (min 10 karakter)" rows="3" maxlength="500" required></textarea>
              <div class="rv-form-footer">
                <span class="rv-char-count">0 / 500</span>
                <button type="submit" class="btn btn-primary rv-submit-btn">Submit</button>
              </div>
              <div class="rv-form-msg"></div>
            </form>
          </div>` : `
          <div class="rv-form-wrap">
            <div class="rv-locked">🔒 Review hanya bisa ditulis <strong>setelah konser berlangsung</strong>.</div>
          </div>`}
        <div class="rv-list" id="rvlist_${concertId}">
          <div class="rv-empty" style="opacity:0.5">Memuat review...</div>
        </div>
      </div>`;
  }

  async function handleSubmit(e, concertId) {
    e.preventDefault();
    const form    = e.target;
    const rating  = parseInt(form.querySelector('input[type=radio]:checked')?.value || '0');
    const author  = form.querySelector('.rv-author-input')?.value || 'Anonim';
    const comment = form.querySelector('.rv-textarea')?.value || '';
    const msgEl   = form.querySelector('.rv-form-msg');

    if (!rating) {
      if (msgEl) { msgEl.textContent = '⚠️ Pilih rating bintang dulu!'; msgEl.style.color = '#f87171'; }
      return;
    }

    const result = await addReview(concertId, { rating, comment, author });
    if (!result.ok) {
      if (msgEl) { msgEl.textContent = '⚠️ ' + result.msg; msgEl.style.color = '#f87171'; }
      return;
    }

    const section = document.getElementById(`rv_${concertId}`);
    if (section) {
      section.outerHTML = renderReviewSection(concertId);
      bindCharCount(concertId);
    }
    if (window.gtag) gtag('event', 'review_submitted', { event_category: 'reviews', event_label: concertId });
  }

  async function handleLike(concertId, reviewId, btn) {
    await likeReview(concertId, reviewId);
    if (btn) {
      const cur = parseInt(btn.textContent.replace('👍 ','')) || 0;
      btn.textContent = `👍 ${cur + 1}`;
      btn.disabled    = true;
    }
  }

  function bindCharCount(concertId) {
    const section = document.getElementById(`rv_${concertId}`);
    if (!section) return;
    const ta  = section.querySelector('.rv-textarea');
    const cnt = section.querySelector('.rv-char-count');
    if (ta && cnt) {
      ta.addEventListener('input', () => {
        cnt.textContent = `${ta.value.length} / 500`;
        cnt.style.color = ta.value.length > 450 ? '#f87171' : 'var(--text-muted)';
      });
    }
  }

  function timeAgo(date) {
    const diff = Date.now() - date.getTime();
    const m = Math.floor(diff/60000), h = Math.floor(m/60), d = Math.floor(h/24);
    if (d > 30) return date.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
    if (d > 0)  return `${d} hari lalu`;
    if (h > 0)  return `${h} jam lalu`;
    if (m > 0)  return `${m} menit lalu`;
    return 'Baru saja';
  }

  window.ConcertReviews = {
    render:  renderReviewSection,
    submit:  handleSubmit,
    like:    handleLike,
    bind:    bindCharCount,
    getAll:  lsGetFor,
    avgFor:  async (id) => avg(await fetchReviews(id)),
  };

})();
