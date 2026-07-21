/**
 * Orchestrates the dynamic Cursy + Canyon Creative Agency workflow
 */

const GeminiClient = require('./GeminiClient');
const {
  DIRECTOR_SYSTEM,
  CURSY_SYSTEM,
  CANYON_SYSTEM,
  SYNTHESIS_SYSTEM,
  AGENCY_MOTTO,
} = require('./prompts');
const {
  mockDirectorShape,
  mockCursyWork,
  mockCanyonWork,
  mockSynthesis,
} = require('./mockResponses');

class AgencyOrchestrator {
  constructor(options = {}) {
    this.gemini = new GeminiClient(options);
    this.runs = new Map();
  }

  getStatus() {
    return {
      motto: AGENCY_MOTTO,
      mode: this.gemini.isMockMode() ? 'mock' : 'live',
      model: this.gemini.modelName,
      agents: ['director', 'cursy', 'canyon', 'synthesis'],
    };
  }

  async runEngagement(brief, options = {}) {
    const runId = options.runId || `run-${Date.now()}`;
    const trimmedBrief = (brief || '').trim();

    if (!trimmedBrief) {
      throw new Error('Client brief is required');
    }

    const run = {
      id: runId,
      brief: trimmedBrief,
      startedAt: new Date().toISOString(),
      phases: [],
      status: 'running',
    };
    this.runs.set(runId, run);

    try {
      const shape = await this.shapeAgency(trimmedBrief, run);
      const specialistWork = await this.delegateToSpecialists(trimmedBrief, shape, run);
      const synthesis = await this.synthesizePackage(trimmedBrief, shape, specialistWork, run);

      const result = {
        runId,
        motto: AGENCY_MOTTO,
        mode: this.gemini.isMockMode() ? 'mock' : 'live',
        brief: trimmedBrief,
        shape,
        specialists: specialistWork,
        package: synthesis,
        phases: run.phases,
        completedAt: new Date().toISOString(),
      };

      run.status = 'complete';
      run.result = result;
      return result;
    } catch (error) {
      run.status = 'error';
      run.error = error.message;
      throw error;
    }
  }

  async shapeAgency(brief, run) {
    this.logPhase(run, 'shape', 'Director is reading your brief and shaping Desired Agency State…');

    const shape = await this.gemini.generateJSON({
      systemPrompt: DIRECTOR_SYSTEM,
      userPrompt: `Client brief:\n${brief}`,
      mockFactory: () => mockDirectorShape(brief),
    });

    this.logPhase(run, 'shape', `Agency shaped: ${shape.agencyMode}`, shape);
    return shape;
  }

  async delegateToSpecialists(brief, shape, run) {
    const tasks = [];
    const context = JSON.stringify(shape, null, 2);

    if (shape.specialists.includes('cursy')) {
      tasks.push(
        this.gemini
          .generateJSON({
            systemPrompt: CURSY_SYSTEM,
            userPrompt: `Client brief:\n${brief}\n\nAgency configuration:\n${context}`,
            mockFactory: () => mockCursyWork(brief, shape),
          })
          .then((work) => {
            this.logPhase(run, 'cursy', work.headline, work);
            return { cursy: work };
          })
      );
    }

    if (shape.specialists.includes('canyon')) {
      tasks.push(
        this.gemini
          .generateJSON({
            systemPrompt: CANYON_SYSTEM,
            userPrompt: `Client brief:\n${brief}\n\nAgency configuration:\n${context}`,
            mockFactory: () => mockCanyonWork(brief, shape),
          })
          .then((work) => {
            this.logPhase(run, 'canyon', work.headline, work);
            return { canyon: work };
          })
      );
    }

    const results = await Promise.all(tasks);
    return Object.assign({}, ...results);
  }

  async synthesizePackage(brief, shape, specialists, run) {
    this.logPhase(run, 'synthesis', 'Weaving Cursy + Canyon outputs into client package…');

    const payload = JSON.stringify({ shape, specialists }, null, 2);

    const synthesis = await this.gemini.generateJSON({
      systemPrompt: SYNTHESIS_SYSTEM,
      userPrompt: `Client brief:\n${brief}\n\nAgency work:\n${payload}`,
      mockFactory: () =>
        mockSynthesis(
          brief,
          shape,
          specialists.cursy || { deliverables: [] },
          specialists.canyon || { deliverables: [] }
        ),
    });

    this.logPhase(run, 'synthesis', synthesis.packageTitle, synthesis);
    return synthesis;
  }

  logPhase(run, agent, message, data) {
    run.phases.push({
      agent,
      message,
      timestamp: new Date().toISOString(),
      data: data || null,
    });
  }

  getRun(runId) {
    return this.runs.get(runId) || null;
  }
}

module.exports = AgencyOrchestrator;
