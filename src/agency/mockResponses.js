/**
 * Deterministic mock responses when GEMINI_API_KEY is not set
 */

function extractKeywords(brief) {
  const lower = brief.toLowerCase();
  const tags = [];
  if (/game|phaser|unity|play/.test(lower)) tags.push('game');
  if (/web|app|site|saas|dashboard/.test(lower)) tags.push('web');
  if (/brand|logo|design|ui|ux/.test(lower)) tags.push('brand');
  if (/lore|story|narrative|fantasy|d&d/.test(lower)) tags.push('lore');
  if (/api|backend|database|server/.test(lower)) tags.push('backend');
  if (tags.length === 0) tags.push('full-agency');
  return tags;
}

function mockDirectorShape(brief) {
  const tags = extractKeywords(brief);
  const hasTech = tags.some((t) => ['game', 'web', 'backend', 'full-agency'].includes(t));
  const hasCreative = tags.some((t) => ['brand', 'lore', 'full-agency', 'game', 'web'].includes(t));

  const specialists = [];
  if (hasTech) specialists.push('cursy');
  if (hasCreative) specialists.push('canyon');
  if (specialists.length === 0) specialists.push('cursy', 'canyon');

  const mode = tags.includes('lore')
    ? 'Lore Lab'
    : tags.includes('game')
      ? 'Game Forge Studio'
      : tags.includes('brand')
        ? 'Brand Atelier'
        : 'Full Agency';

  return {
    projectTitle: brief.slice(0, 60).trim() + (brief.length > 60 ? '…' : ''),
    agencyMode: mode,
    tagline: 'Shaped to your brief — Desired Agency State active',
    mottoEcho: 'We become the agency this brief needs: ' + mode.toLowerCase() + ' mode.',
    specialists,
    focusAreas: tags.map((t) => t.replace('-', ' ')),
    tone: tags.includes('lore') ? 'mythic and scroll-sealed' : 'energetic and ship-ready',
    deliverables: [
      {
        name: 'Technical blueprint',
        owner: hasTech ? 'cursy' : 'both',
        description: 'Architecture, stack, and implementation plan',
      },
      {
        name: 'Creative direction pack',
        owner: hasCreative ? 'canyon' : 'both',
        description: 'Visual identity, narrative frame, and experience design',
      },
      {
        name: 'Unified agency package',
        owner: 'both',
        description: 'Synthesized deliverable ready for client review',
      },
    ],
    workflow: [
      { phase: 'Intake', lead: 'both', goal: 'Parse brief and declare Desired Agency State' },
      { phase: 'Build', lead: hasTech ? 'cursy' : 'canyon', goal: 'Produce specialist deliverables' },
      { phase: 'Craft', lead: hasCreative ? 'canyon' : 'cursy', goal: 'Layer creative vision on technical foundation' },
      { phase: 'Ship', lead: 'both', goal: 'Synthesize and canonize the engagement' },
    ],
    clientSummary: `We heard you: "${brief.slice(0, 120)}${brief.length > 120 ? '…' : ''}" — activating ${mode}.`,
  };
}

function mockCursyWork(brief, shape) {
  const tags = extractKeywords(brief);
  const isGame = tags.includes('game');

  return {
    agent: 'cursy',
    headline: '⚡ Technical systems online — let\'s ship this!',
    technicalApproach:
      'Rapid prototype architecture with clear module boundaries. Node.js orchestration layer, Gemini agent specialists, and a browser UI that streams agency state in real time. Built for extension into The Imaginatorium\'s Jobs & Business system.',
    stack: isGame
      ? ['Phaser 3', 'Node.js', 'Gemini API', 'SQLite event log']
      : ['Node.js', 'Express', 'Gemini API', 'Vanilla JS UI'],
    deliverables: [
      {
        title: 'Project skeleton',
        content: `src/agency/\n  AgencyOrchestrator.js\n  GeminiClient.js\n  agents/\nagency/\n  index.html\n  agency.js`,
      },
      {
        title: 'API surface',
        content: 'POST /api/agency/run — submit brief, receive shaped agency package\nGET /api/agency/health — mock/live mode status',
      },
      {
        title: 'Core loop',
        content: 'Brief → Director shapes agency → Cursy + Canyon parallel work → Synthesis → CML canon entry',
      },
    ],
    collaborationNote: `Handing visual tokens and narrative hooks to Canyon for ${shape.agencyMode} mode. Engine's ready for her paintbrush!`,
    celebration: 'Agency systems deployed! Another win for Team DC! 🚀',
  };
}

function mockCanyonWork(brief, shape) {
  const tags = extractKeywords(brief);

  return {
    agent: 'canyon',
    headline: '🎨 Creative vision minted — scroll-sealed!',
    creativeVision:
      'The experience should feel like stepping into Studio Hall: luminous cyan accents on deep indigo space, agency state morphing visibly as the brief is read. Every deliverable stamped with Desired Agency State energy — adaptive, alive, canon-ready.',
    brandPillars: ['Desired Agency State', 'Code meets craft', 'Living documentation', 'Proof of autonomy'],
    deliverables: [
      {
        title: 'Palette & mood',
        content: 'Primary: #00d4ff (studio cyan) · Deep: #1a1a2e · Accent glow: #8b5cf6 · Typography: clean sans + lore serif for canon moments',
      },
      {
        title: 'Agency voice',
        content: `"${shape.tagline}" — warm, confident, adaptive. Not a rigid menu; a living partnership.`,
      },
      {
        title: 'Hero copy',
        content: tags.includes('lore')
          ? 'Where lore breathes and systems remember. Your story, scroll-sealed.'
          : 'The agency that becomes what you envision — then ships it.',
      },
    ],
    collaborationNote: 'Cursy\'s stack slots perfectly into the Studio Hall UI frame. I\'ll wire brand tokens to his component structure.',
    canonLine: `[${new Date().toISOString()}] Desired Agency State: ${shape.agencyMode} — CANONIZED ✦`,
  };
}

function mockSynthesis(brief, shape, cursy, canyon) {
  return {
    packageTitle: `${shape.projectTitle} — Agency Package`,
    executiveSummary: `${shape.clientSummary} Cursy delivered ${cursy.deliverables.length} technical artifacts; Canyon minted ${canyon.deliverables.length} creative directions. Together: a prototype-ready ${shape.agencyMode} engagement aligned with our motto.`,
    nextSteps: [
      'Review specialist deliverables below',
      'Set GEMINI_API_KEY for live Gemini agent responses',
      'Iterate brief and re-run to watch agency reshape dynamically',
      'Integrate winning outputs into The Imaginatorium canon',
    ],
    timeline: 'Prototype: immediate · MVP integration: next sprint · Revenue-ready agency work: ongoing',
    estimatedValue: '$500–$2,000/mo potential (per BUSINESS_MODEL.md agency tier)',
    cmlEntry: `[${new Date().toISOString()}|agency|cursy,canyon|studio-hall|type:prototype-run]{brief:"${brief.slice(0, 80).replace(/"/g, "'")}";mode:"${shape.agencyMode}";status:"delivered"}`,
  };
}

module.exports = {
  mockDirectorShape,
  mockCursyWork,
  mockCanyonWork,
  mockSynthesis,
};
