const API_BASE = window.location.origin;

const els = {
  statusPill: document.getElementById('status-pill'),
  statusText: document.getElementById('status-text'),
  brief: document.getElementById('brief'),
  runBtn: document.getElementById('run-btn'),
  emptyState: document.getElementById('empty-state'),
  runOutput: document.getElementById('run-output'),
  shapeCard: document.getElementById('shape-card'),
  cursyCard: document.getElementById('cursy-card'),
  canyonCard: document.getElementById('canyon-card'),
  packageCard: document.getElementById('package-card'),
  phaseLog: document.getElementById('phase-log'),
};

async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/agency/health`);
    const data = await res.json();
    els.statusPill.classList.remove('error');
    els.statusPill.classList.add(data.mode === 'live' ? 'live' : 'mock');
    els.statusText.textContent =
      data.mode === 'live'
        ? `Live · ${data.model}`
        : 'Mock mode · set GEMINI_API_KEY for live agents';
  } catch {
    els.statusPill.classList.add('error');
    els.statusText.textContent = 'Server offline · run npm run agency';
  }
}

function renderShape(shape) {
  const specialists = (shape.specialists || []).map((s) => s.toUpperCase()).join(' + ');
  els.shapeCard.innerHTML = `
    <span class="mode">${escapeHtml(shape.agencyMode)}</span>
    <h3>${escapeHtml(shape.projectTitle)}</h3>
    <p>${escapeHtml(shape.clientSummary)}</p>
    <dl class="meta-grid">
      <div><dt>Specialists</dt><dd>${escapeHtml(specialists)}</dd></div>
      <div><dt>Tone</dt><dd>${escapeHtml(shape.tone)}</dd></div>
      <div><dt>Tagline</dt><dd>${escapeHtml(shape.tagline)}</dd></div>
    </dl>
    <p><em>${escapeHtml(shape.mottoEcho)}</em></p>
    <div class="tag-list">
      ${(shape.focusAreas || []).map((a) => `<span class="tag">${escapeHtml(a)}</span>`).join('')}
    </div>
  `;
}

function renderAgentCard(el, work, emoji, label) {
  if (!work) {
    el.classList.add('hidden');
    return;
  }
  el.classList.remove('hidden');
  const deliverables = (work.deliverables || [])
    .map(
      (d) => `
      <div class="deliverable">
        <h4>${escapeHtml(d.title)}</h4>
        <pre>${escapeHtml(d.content)}</pre>
      </div>`
    )
    .join('');

  const extras =
    work.stack || work.brandPillars
      ? `<div class="tag-list">${(work.stack || work.brandPillars || [])
          .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
          .join('')}</div>`
      : '';

  const closer = work.celebration || work.canonLine || '';

  el.innerHTML = `
    <h3>${emoji} ${label}</h3>
    <p><strong>${escapeHtml(work.headline)}</strong></p>
    <p>${escapeHtml(work.technicalApproach || work.creativeVision || '')}</p>
    ${extras}
    ${deliverables}
    <p style="margin-top:0.75rem;font-size:0.85rem;color:var(--text-muted)">${escapeHtml(work.collaborationNote || '')}</p>
    ${closer ? `<p style="margin-top:0.5rem;font-size:0.85rem">${escapeHtml(closer)}</p>` : ''}
  `;
}

function renderPackage(pkg) {
  els.packageCard.classList.remove('hidden');
  els.packageCard.innerHTML = `
    <h3>📦 ${escapeHtml(pkg.packageTitle)}</h3>
    <p>${escapeHtml(pkg.executiveSummary)}</p>
    <p><strong>Timeline:</strong> ${escapeHtml(pkg.timeline)}</p>
    <p><strong>Est. value:</strong> ${escapeHtml(pkg.estimatedValue)}</p>
    <p><strong>Next steps</strong></p>
    <ul>${(pkg.nextSteps || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
    <div class="cml">${escapeHtml(pkg.cmlEntry)}</div>
  `;
}

function renderPhases(phases) {
  els.phaseLog.innerHTML = (phases || [])
    .map(
      (p) =>
        `<li><strong>${escapeHtml(p.agent)}</strong> · ${escapeHtml(p.message)} <span style="opacity:0.6">(${escapeHtml(p.timestamp)})</span></li>`
    )
    .join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function runAgency() {
  const brief = els.brief.value.trim();
  if (!brief) {
    els.brief.focus();
    return;
  }

  els.runBtn.disabled = true;
  els.runBtn.textContent = 'Agency shaping…';
  document.body.classList.add('loading');
  els.emptyState.classList.add('hidden');
  els.runOutput.classList.remove('hidden');
  els.cursyCard.classList.add('hidden');
  els.canyonCard.classList.add('hidden');
  els.packageCard.classList.add('hidden');
  els.shapeCard.innerHTML = '<p class="pulse">Director agent reading brief…</p>';

  try {
    const res = await fetch(`${API_BASE}/api/agency/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brief }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Agency run failed');

    renderShape(data.shape);
    renderAgentCard(els.cursyCard, data.specialists.cursy, '⚡', 'Cursy · Technical');
    renderAgentCard(els.canyonCard, data.specialists.canyon, '🎨', 'Canyon · Creative');
    renderPackage(data.package);
    renderPhases(data.phases);
  } catch (err) {
    els.shapeCard.innerHTML = `<p style="color:#f87171">Error: ${escapeHtml(err.message)}</p>`;
  } finally {
    els.runBtn.disabled = false;
    els.runBtn.textContent = 'Activate Desired Agency State';
    document.body.classList.remove('loading');
  }
}

document.querySelectorAll('.chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    els.brief.value = btn.dataset.brief;
    els.brief.focus();
  });
});

els.runBtn.addEventListener('click', runAgency);
checkHealth();
