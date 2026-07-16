/**
 * Damo is Trapped in a Gravity Well
 * Tetris + Klax hybrid point-and-click climb game
 * MCP-accessible via window.GameAPI
 */

(function () {
  'use strict';

  const COLS = 8;
  const ROWS = 16;
  const EXIT_ROW = 0;
  const COLORS = ['red', 'blue', 'yellow', 'green', 'purple', 'cyan'];
  const MATCH_MIN = 3;

  const SHAPES = [
  { name: 'single', cells: [[0, 0]] },
  { name: 'domino-h', cells: [[0, 0], [1, 0]] },
  { name: 'domino-v', cells: [[0, 0], [0, 1]] },
  { name: 'L', cells: [[0, 0], [0, 1], [1, 1]] },
  { name: 'T', cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { name: 'square', cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { name: 'tri', cells: [[0, 0], [1, 0], [0, 1]] },
  ];

  const state = {
    grid: [],
    damo: { col: 3, row: ROWS - 1, standing: false },
    piece: null,
    score: 0,
    stoneCount: 0,
    won: false,
    gameOver: false,
    message: 'Damo is lying at the bottom of the well...',
  };

  const els = {};

  function emptyGrid() {
    return Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => null)
    );
  }

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function randomShape() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const color = randomColor();
    return {
      name: shape.name,
      cells: shape.cells.map(([x, y]) => [x, y]),
      color,
      col: Math.floor(COLS / 2) - 1,
      row: 0,
    };
  }

  function rotateCells(cells) {
    const maxX = Math.max(...cells.map(([x]) => x));
    return cells.map(([x, y]) => [y, maxX - x]);
  }

  function getPieceCells(piece, col = piece.col, row = piece.row) {
    return piece.cells.map(([x, y]) => [col + x, row + y]);
  }

  function inBounds(col, row) {
    return col >= 0 && col < COLS && row >= 0 && row < ROWS;
  }

  function cellOccupied(col, row, ignorePiece = false) {
    if (!inBounds(col, row)) return true;
    if (state.grid[row][col]) return true;
    if (ignorePiece && state.piece) {
      const pieceCells = getPieceCells(state.piece);
      if (pieceCells.some(([pc, pr]) => pc === col && pr === row)) return false;
    }
    return false;
  }

  function canPlacePiece(piece, col, row) {
    return getPieceCells(piece, col, row).every(([c, r]) => {
      if (!inBounds(c, r)) return false;
      if (state.grid[r][c]) return false;
      return true;
    });
  }

  function spawnPiece() {
    state.piece = randomShape();
    if (!canPlacePiece(state.piece, state.piece.col, state.piece.row)) {
      state.gameOver = true;
      state.message = 'The well overflowed! Bricks blocked the sky. Restart and try again.';
      Sfx.play('gameOver');
    } else {
      Sfx.play('spawn');
    }
  }

  function lockPiece() {
    const piece = state.piece;
    if (!piece) return;

    getPieceCells(piece).forEach(([c, r]) => {
      state.grid[r][c] = { type: 'brick', color: piece.color };
    });

    state.score += piece.cells.length * 10;
    state.piece = null;
    const fusedCount = fuseMatches();
    if (fusedCount > 0) {
      Sfx.play('fuse', { count: fusedCount });
    } else {
      Sfx.play('land');
    }
    spawnPiece();
    updateUI();
  }

  function dropPiece() {
    if (!state.piece || state.won || state.gameOver) return false;

    let { col, row } = state.piece;
    while (canPlacePiece(state.piece, col, row + 1)) {
      row += 1;
    }
    state.piece.row = row;
    lockPiece();
    return true;
  }

  function movePiece(dx) {
    if (!state.piece || state.won || state.gameOver) return false;
    const newCol = state.piece.col + dx;
    if (canPlacePiece(state.piece, newCol, state.piece.row)) {
      state.piece.col = newCol;
      Sfx.play('move');
      updateUI();
      return true;
    }
    Sfx.play('bump');
    return false;
  }

  function rotatePiece() {
    if (!state.piece || state.won || state.gameOver) return false;
    const rotated = rotateCells(state.piece.cells);
    const prev = state.piece.cells;
    state.piece.cells = rotated;
    if (!canPlacePiece(state.piece, state.piece.col, state.piece.row)) {
      state.piece.cells = prev;
      Sfx.play('bump');
      return false;
    }
    Sfx.play('rotate');
    updateUI();
    return true;
  }

  function fuseMatches() {
    const matched = new Set();

    for (let r = 0; r < ROWS; r++) {
      let runColor = null;
      let run = [];
      for (let c = 0; c <= COLS; c++) {
        const cell = c < COLS ? state.grid[r][c] : null;
        const color = cell && cell.type === 'brick' ? cell.color : null;
        if (color && color === runColor) {
          run.push([c, r]);
        } else {
          if (run.length >= MATCH_MIN) run.forEach(([cc, rr]) => matched.add(`${cc},${rr}`));
          runColor = color;
          run = color ? [[c, r]] : [];
        }
      }
    }

    for (let c = 0; c < COLS; c++) {
      let runColor = null;
      let run = [];
      for (let r = 0; r <= ROWS; r++) {
        const cell = r < ROWS ? state.grid[r][c] : null;
        const color = cell && cell.type === 'brick' ? cell.color : null;
        if (color && color === runColor) {
          run.push([c, r]);
        } else {
          if (run.length >= MATCH_MIN) run.forEach(([cc, rr]) => matched.add(`${cc},${rr}`));
          runColor = color;
          run = color ? [[c, r]] : [];
        }
      }
    }

    if (matched.size === 0) return 0;

    matched.forEach((key) => {
      const [c, r] = key.split(',').map(Number);
      state.grid[r][c] = { type: 'stone', color: 'stone' };
      state.stoneCount += 1;
      state.score += 50;
    });

    state.message = `Klax fusion! ${matched.size} bricks became climbable stone.`;
    return matched.size;
  }

  function damoAt(col, row) {
    return state.damo.col === col && state.damo.row === row;
  }

  function canStandUp() {
    return !state.damo.standing && state.damo.row === ROWS - 1;
  }

  function standUp() {
    if (!canStandUp()) return false;
    state.damo.standing = true;
    state.message = 'Damo is on his feet! Fuse stone and climb.';
    Sfx.play('stand');
    updateUI();
    return true;
  }

  function isClimbableTarget(col, row) {
    if (!state.damo.standing || state.won) return false;
    const cell = state.grid[row][col];
    if (!cell || cell.type !== 'stone') return false;

    const dRow = state.damo.row - row;
    const dCol = Math.abs(state.damo.col - col);
    return dRow === 1 && dCol <= 1;
  }

  function climbTo(col, row) {
    if (!isClimbableTarget(col, row)) return false;
    state.damo.col = col;
    state.damo.row = row;
    state.score += 100;
    state.message = `Damo climbed to row ${row}. ${row === EXIT_ROW ? 'Almost free!' : 'Keep building!'}`;
    Sfx.play('climb', { row });

    if (row <= EXIT_ROW) {
      state.won = true;
      state.message = 'Damo escaped the gravity well! Freedom at last.';
      Sfx.play('win');
      showOverlay('Freedom!', `Score: ${state.score}. Damo climbed out brick by brick.`);
    }

    updateUI();
    return true;
  }

  function getGhostLanding() {
    if (!state.piece) return null;
    let row = state.piece.row;
    while (canPlacePiece(state.piece, state.piece.col, row + 1)) row += 1;
    return getPieceCells(state.piece, state.piece.col, row);
  }

  function dropInColumn(col) {
    if (!state.piece || state.won || state.gameOver) return false;
    const shapeWidth = Math.max(...state.piece.cells.map(([x]) => x)) + 1;
    let targetCol = Math.min(col, COLS - shapeWidth);
    targetCol = Math.max(0, targetCol);
    state.piece.col = targetCol;
    return dropPiece();
  }

  function buildGrid() {
    els.wellGrid.innerHTML = '';
    const ghost = getGhostLanding();
    const ghostSet = new Set((ghost || []).map(([c, r]) => `${c},${r}`));

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'well-cell';
        cell.dataset.col = String(c);
        cell.dataset.row = String(r);
        cell.setAttribute('aria-label', `Well cell column ${c + 1} row ${r + 1}`);

        if (r === EXIT_ROW) cell.classList.add('exit-row');

        const data = state.grid[r][c];
        if (data) {
          cell.classList.add(data.type);
          if (data.type === 'brick') cell.classList.add(`color-${data.color}`);
          if (data.type === 'stone' && isClimbableTarget(c, r)) {
            cell.classList.add('climbable');
            cell.dataset.action = 'climb';
            cell.dataset.mcpAction = 'climb';
          }
        }

        if (ghostSet.has(`${c},${r}`) && !data) {
          cell.classList.add('ghost');
          if (state.piece) cell.classList.add(`color-${state.piece.color}`);
        }

        if (state.piece) {
          const active = getPieceCells(state.piece);
          if (active.some(([pc, pr]) => pc === c && pr === r)) {
            cell.classList.add('brick', `color-${state.piece.color}`);
          }
        }

        if (damoAt(c, r)) {
          cell.classList.add('damo');
          const sprite = document.createElement('span');
          sprite.className = `damo-sprite ${state.damo.standing ? 'standing' : 'prone'}`;
          sprite.textContent = state.damo.standing ? '🧍' : '🛌';
          sprite.setAttribute('aria-hidden', 'true');
          cell.appendChild(sprite);
        }

        cell.addEventListener('click', () => onCellClick(c, r));
        els.wellGrid.appendChild(cell);
      }
    }
  }

  function renderPreview() {
    els.nextPreview.innerHTML = '';
    if (!state.piece) return;

    const maxX = Math.max(...state.piece.cells.map(([x]) => x));
    const maxY = Math.max(...state.piece.cells.map(([, y]) => y));
    els.nextPreview.style.gridTemplateColumns = `repeat(${maxX + 1}, 18px)`;

    for (let y = 0; y <= maxY; y++) {
      for (let x = 0; x <= maxX; x++) {
        const div = document.createElement('div');
        const filled = state.piece.cells.some(([px, py]) => px === x && py === y);
        div.style.width = '18px';
        div.style.height = '18px';
        div.style.borderRadius = '3px';
        if (filled) {
          div.className = `color-${state.piece.color}`;
        } else {
          div.style.background = 'transparent';
        }
        els.nextPreview.appendChild(div);
      }
    }
  }

  function updateUI() {
    buildGrid();
    renderPreview();

    els.statusText.textContent = state.message;
    els.scoreValue.textContent = String(state.score);
    els.stoneValue.textContent = String(state.stoneCount);

    const depth = state.damo.row;
    els.heightValue.textContent = String(depth);
    els.climbProgress.style.width = `${((ROWS - 1 - depth) / (ROWS - 1)) * 100}%`;

    els.damoPortrait.textContent = state.damo.standing ? '🧍' : '🛌';
    els.damoPortrait.className = `damo-portrait ${state.damo.standing ? 'standing' : 'prone'}`;
    els.damoState.textContent = state.won
      ? 'FREE!'
      : state.damo.standing
        ? `Standing at row ${state.damo.row}`
        : 'Prone — stand up first!';

    els.btnStand.disabled = !canStandUp() || state.won;

    publishMcpState();
  }

  function publishMcpState() {
    const climbable = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (isClimbableTarget(c, r)) climbable.push({ col: c, row: r });
      }
    }

    const payload = {
      game: 'damo-gravity-well',
      won: state.won,
      gameOver: state.gameOver,
      score: state.score,
      stoneCount: state.stoneCount,
      message: state.message,
      damo: { ...state.damo },
      piece: state.piece
        ? { name: state.piece.name, color: state.piece.color, col: state.piece.col, row: state.piece.row }
        : null,
      climbable,
      availableActions: getAvailableActions(),
      gridSummary: {
        rows: ROWS,
        cols: COLS,
        stones: state.stoneCount,
      },
      soundEnabled: Sfx.isEnabled(),
    };

    els.mcpState.textContent = JSON.stringify(payload, null, 2);
    window.GameAPI._state = payload;
  }

  function getAvailableActions() {
    const actions = [];
    if (state.won) return ['restart'];
    if (state.gameOver) return ['restart'];
    if (canStandUp()) actions.push('stand-up');
    if (state.piece) {
      actions.push('move-left', 'move-right', 'rotate', 'drop');
    }
    const climbable = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (isClimbableTarget(c, r)) climbable.push({ col: c, row: r });
      }
    }
    if (climbable.length) actions.push('climb');
    return actions;
  }

  function onCellClick(col, row) {
    if (state.won) return;
    if (isClimbableTarget(col, row)) {
      climbTo(col, row);
      return;
    }
    dropInColumn(col);
  }

  function showOverlay(title, message) {
    els.overlayTitle.textContent = title;
    els.overlayMessage.textContent = message;
    els.overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    els.overlay.classList.add('hidden');
  }

  function restart() {
    state.grid = emptyGrid();
    state.damo = { col: 3, row: ROWS - 1, standing: false };
    state.piece = null;
    state.score = 0;
    state.stoneCount = 0;
    state.won = false;
    state.gameOver = false;
    state.message = 'Damo is lying at the bottom of the well. Stand him up. Build stone. Climb.';
    hideOverlay();
    Sfx.play('restart');
    spawnPiece();
    updateUI();
  }

  function act(action, params = {}) {
    switch (action) {
      case 'move-left': return movePiece(-1);
      case 'move-right': return movePiece(1);
      case 'rotate': return rotatePiece();
      case 'drop': return dropPiece();
      case 'stand-up': return standUp();
      case 'climb':
        if (params.col != null && params.row != null) return climbTo(params.col, params.row);
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (isClimbableTarget(c, r)) return climbTo(c, r);
          }
        }
        return false;
      case 'restart':
        restart();
        return true;
      case 'toggle-sound':
        return toggleSound();
      default:
        return false;
    }
  }

  function clickCell(col, row) {
    if (isClimbableTarget(col, row)) return climbTo(col, row);
    return dropInColumn(col);
  }

  window.GameAPI = {
    getState: () => JSON.parse(JSON.stringify(window.GameAPI._state || {})),
    act,
    clickCell,
    restart,
    toggleSound,
    _state: {},
  };

  function toggleSound() {
    const on = Sfx.toggle();
    updateMuteButton();
    return on;
  }

  function updateMuteButton() {
    if (!els.btnMute) return;
    const on = Sfx.isEnabled();
    els.btnMute.textContent = on ? '🔊 Sound On' : '🔇 Sound Off';
    els.btnMute.setAttribute('aria-pressed', on ? 'false' : 'true');
  }

  function bindEvents() {
    els.btnLeft.addEventListener('click', () => movePiece(-1));
    els.btnRight.addEventListener('click', () => movePiece(1));
    els.btnRotate.addEventListener('click', () => rotatePiece());
    els.btnDrop.addEventListener('click', () => dropPiece());
    els.btnStand.addEventListener('click', () => standUp());
    els.btnMute.addEventListener('click', () => toggleSound());
    els.btnRestart.addEventListener('click', () => restart());
    els.btnPlayAgain.addEventListener('click', () => restart());

    document.querySelectorAll('[data-mcp-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        publishMcpState();
      });
    });
  }

  function init() {
    els.wellGrid = document.getElementById('well-grid');
    els.statusText = document.getElementById('status-text');
    els.scoreValue = document.getElementById('score-value');
    els.stoneValue = document.getElementById('stone-value');
    els.heightValue = document.getElementById('height-value');
    els.climbProgress = document.getElementById('climb-progress');
    els.damoPortrait = document.getElementById('damo-portrait');
    els.damoState = document.getElementById('damo-state');
    els.nextPreview = document.getElementById('next-preview');
    els.mcpState = document.getElementById('mcp-game-state');
    els.overlay = document.getElementById('overlay');
    els.overlayTitle = document.getElementById('overlay-title');
    els.overlayMessage = document.getElementById('overlay-message');
    els.btnLeft = document.getElementById('btn-left');
    els.btnRight = document.getElementById('btn-right');
    els.btnRotate = document.getElementById('btn-rotate');
    els.btnDrop = document.getElementById('btn-drop');
    els.btnStand = document.getElementById('btn-stand');
    els.btnMute = document.getElementById('btn-mute');
    els.btnRestart = document.getElementById('btn-restart');
    els.btnPlayAgain = document.getElementById('btn-play-again');

    bindEvents();
    Sfx.setRows(ROWS);
    updateMuteButton();
    restart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
