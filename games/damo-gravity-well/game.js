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
  const SLICE_ANGLE = 360 / COLS;
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
    dropAnim: null,
    landPopCells: null,
    inputLocked: false,
    wellRotation: 0,
  };

  const CELL_STEP = () => {
    const size = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'), 10) || 42;
    return size + 2;
  };

  function wrapCol(col) {
    return ((col % COLS) + COLS) % COLS;
  }

  function colDistance(a, b) {
    const d = Math.abs(a - b);
    return Math.min(d, COLS - d);
  }

  function hasLedge(col, row) {
    if (row === ROWS - 1) return true;
    const cell = state.grid[row][col];
    return Boolean(cell && cell.type === 'stone');
  }

  function easeInQuad(t) {
    return t * t;
  }

  function createBlock3d(color, options = {}) {
    const block = document.createElement('div');
    block.className = 'block-3d';
    if (options.ghost) block.classList.add('ghost-block');
    if (options.active) block.classList.add('active');
    if (options.falling) block.classList.add('falling');
    if (options.stone) block.classList.add('stone-block');
    if (options.landPop) block.classList.add('land-pop');

    if (options.fallOffset) {
      block.style.transform = `rotateX(-22deg) rotateY(28deg) translateY(${options.fallOffset}px)`;
    }

    ['top', 'front', 'right', 'shadow'].forEach((face) => {
      const el = document.createElement('span');
      el.className = `cube-face cube-${face}`;
      block.appendChild(el);
    });

    return block;
  }

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

    const landedCells = getPieceCells(piece);
    landedCells.forEach(([c, r]) => {
      state.grid[r][c] = { type: 'brick', color: piece.color };
    });

    state.landPopCells = new Set(landedCells.map(([c, r]) => `${c},${r}`));
    setTimeout(() => {
      state.landPopCells = null;
      if (!state.dropAnim) updateUI();
    }, 320);

    state.score += piece.cells.length * 10;
    state.piece = null;
    const fusedCount = fuseMatches();
    if (fusedCount > 0) {
      Sfx.play('fuse', { count: fusedCount });
    } else {
      Sfx.play('land');
    }
    spawnPiece();
    resolveDamoAfterBricks();
    updateUI();
  }

  function dropPiece() {
    if (!state.piece || state.won || state.gameOver || state.inputLocked) return false;

    const { col, row: startRow } = state.piece;
    let endRow = startRow;
    while (canPlacePiece(state.piece, col, endRow + 1)) {
      endRow += 1;
    }

    if (endRow === startRow) {
      lockPiece();
      return true;
    }

    const distance = endRow - startRow;
    state.inputLocked = true;
    state.dropAnim = {
      startRow,
      endRow,
      startTime: performance.now(),
      duration: Math.min(650, 100 + distance * 55),
      t: 0,
    };

    function tickDrop(now) {
      const anim = state.dropAnim;
      if (!anim || !state.piece) return;

      anim.t = Math.min(1, (now - anim.startTime) / anim.duration);
      const eased = easeInQuad(anim.t);
      anim.fallOffset = eased * distance * CELL_STEP();

      updateUI();

      if (anim.t < 1) {
        requestAnimationFrame(tickDrop);
      } else {
        state.piece.row = anim.endRow;
        state.dropAnim = null;
        state.inputLocked = false;
        lockPiece();
      }
    }

    requestAnimationFrame(tickDrop);
    return true;
  }

  function movePiece(dx) {
    if (!state.piece || state.won || state.gameOver || state.inputLocked) return false;
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
    if (!state.piece || state.won || state.gameOver || state.inputLocked) return false;
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

  function canDamoWalkTo(col, row) {
    if (!state.damo.standing || state.won || state.inputLocked) return false;
    return hasLedge(wrapCol(col), row);
  }

  function walkDamo(dx) {
    if (!state.damo.standing || state.won || state.inputLocked) return false;
    const newCol = wrapCol(state.damo.col + dx);
    if (!canDamoWalkTo(newCol, state.damo.row)) {
      Sfx.play('bump');
      return false;
    }
    state.damo.col = newCol;
    state.wellRotation = -state.damo.col * SLICE_ANGLE;
    Sfx.play('move');
    state.message = `Damo walks the inner wall… slice ${newCol + 1} of ${COLS}`;
    updateUI();
    return true;
  }

  function tryJump() {
    if (!state.damo.standing || state.won || state.inputLocked) return false;
    const candidates = [];
    for (let dc = -1; dc <= 1; dc += 1) {
      const c = wrapCol(state.damo.col + dc);
      const r = state.damo.row - 1;
      if (r >= EXIT_ROW && isClimbableTarget(c, r)) candidates.push([c, r]);
    }
    if (!candidates.length) {
      Sfx.play('bump');
      return false;
    }
    const preferred = candidates.find(([c]) => c === state.damo.col) || candidates[0];
    return climbTo(preferred[0], preferred[1]);
  }

  function settleDamo() {
    if (!state.damo.standing || state.won) return;
    if (hasLedge(state.damo.col, state.damo.row)) return;

    let r = state.damo.row;
    while (r < ROWS - 1 && !hasLedge(state.damo.col, r + 1)) {
      r += 1;
    }
    if (r !== state.damo.row) {
      state.damo.row = r;
      state.message = r < ROWS - 1 ? 'No ledge! Damo fell down the well shaft.' : 'Damo slid to the well floor.';
      Sfx.play('land');
    }
  }

  function resolveDamoAfterBricks() {
    if (!state.damo.standing || state.won) return;
    const { col, row } = state.damo;
    const occupant = state.grid[row][col];
    if (occupant && occupant.type === 'brick') {
      if (row > EXIT_ROW && !state.grid[row - 1][col]) {
        state.damo.row = row - 1;
        state.message = 'Brick incoming! Damo leaped up!';
      } else {
        state.message = 'Buried by bricks! Slide to safety.';
      }
    }
    settleDamo();
  }

  function canStandUp() {
    return !state.damo.standing && state.damo.row === ROWS - 1;
  }

  function standUp() {
    if (!canStandUp()) return false;
    state.damo.standing = true;
    state.message = 'Damo is on his feet! Walk the well wall. Build ledges. Jump up.';
    Sfx.play('stand');
    updateUI();
    return true;
  }

  function isClimbableTarget(col, row) {
    if (!state.damo.standing || state.won) return false;
    const cell = state.grid[row][col];
    if (!cell || cell.type !== 'stone') return false;

    const dRow = state.damo.row - row;
    return dRow === 1 && colDistance(state.damo.col, col) <= 1;
  }

  function climbTo(col, row) {
    if (!isClimbableTarget(col, row)) return false;
    state.damo.col = wrapCol(col);
    state.damo.row = row;
    state.wellRotation = -state.damo.col * SLICE_ANGLE;
    state.score += 100;
    state.message = `Damo jumped to ledge ${row + 1}. ${row === EXIT_ROW ? 'Almost free!' : 'Keep circling upward!'}`;
    Sfx.play('climb', { row });

    if (els.damoAnchor) {
      els.damoAnchor.classList.add('jump-anim');
      setTimeout(() => els.damoAnchor && els.damoAnchor.classList.remove('jump-anim'), 340);
    }

    if (row <= EXIT_ROW) {
      state.won = true;
      state.message = 'Damo escaped the gravity well! Freedom at last.';
      Sfx.play('win');
      Music.playFinale();
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

  function createWellCell(c, r, context) {
    const {
      ghostSet, activeCells, fallOffset, landPopCells,
    } = context;

    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'well-cell';
    cell.dataset.col = String(c);
    cell.dataset.row = String(r);
    cell.setAttribute('aria-label', `Well slice ${c + 1} row ${r + 1}`);

    if (r === EXIT_ROW) cell.classList.add('exit-row');
    if (r === ROWS - 1) cell.classList.add('well-floor');

    const key = `${c},${r}`;
    const data = state.grid[r][c];
    const isActive = activeCells.has(key);

    if (c === state.damo.col && r === state.damo.row) {
      cell.classList.add('damo-here');
    }

    if (data && !isActive) {
      cell.classList.add(data.type);
      if (data.type === 'brick') cell.classList.add(`color-${data.color}`);
      if (data.type === 'stone') cell.classList.add('color-stone');

      const landPop = landPopCells && landPopCells.has(key);
      cell.appendChild(createBlock3d(data.color, {
        stone: data.type === 'stone',
        landPop,
      }));

      if (data.type === 'stone' && isClimbableTarget(c, r)) {
        cell.classList.add('climbable');
        cell.dataset.action = 'climb';
        cell.dataset.mcpAction = 'climb';
      }
    }

    if (ghostSet.has(key) && !data && !isActive) {
      cell.classList.add('ghost');
      if (state.piece) {
        cell.classList.add(`color-${state.piece.color}`);
        cell.appendChild(createBlock3d(state.piece.color, { ghost: true }));
      }
    }

    if (isActive && state.piece) {
      cell.classList.add('brick', `color-${state.piece.color}`);
      cell.appendChild(createBlock3d(state.piece.color, {
        active: !state.dropAnim,
        falling: Boolean(state.dropAnim),
        fallOffset: state.dropAnim ? fallOffset : 0,
      }));
    }

    cell.addEventListener('click', () => onCellClick(c, r));
    return cell;
  }

  function updateDamoAnchor() {
    if (!els.damoAnchor) return;
    const top = 10 + state.damo.row * CELL_STEP();
    els.damoAnchor.style.top = `${top}px`;
    els.damoAnchor.textContent = state.damo.standing ? '🧍' : '🛌';
    els.damoAnchor.className = `damo-anchor ${state.damo.standing ? 'standing' : 'prone'}`;
  }

  function buildGrid() {
    els.wellGrid.innerHTML = '';
    els.wellGrid.className = 'well-cylinder-stage';

    const ghost = state.dropAnim ? null : getGhostLanding();
    const ghostSet = new Set((ghost || []).map(([c, r]) => `${c},${r}`));
    const activeCells = state.piece
      ? new Set(getPieceCells(state.piece).map(([c, r]) => `${c},${r}`))
      : new Set();
    const fallOffset = state.dropAnim ? state.dropAnim.fallOffset || 0 : 0;
    const context = {
      ghostSet,
      activeCells,
      fallOffset,
      landPopCells: state.landPopCells,
    };

    const ring = document.createElement('div');
    ring.className = 'well-cylinder-ring';
    ring.style.setProperty('--ring-rotation', `${-state.damo.col * SLICE_ANGLE}deg`);

    for (let c = 0; c < COLS; c += 1) {
      const slice = document.createElement('div');
      slice.className = 'well-slice';
      if (c === state.damo.col) slice.classList.add('is-front');
      slice.style.setProperty('--slice-index', String(c));
      slice.dataset.col = String(c);

      const stack = document.createElement('div');
      stack.className = 'well-slice-stack';

      for (let r = 0; r < ROWS; r += 1) {
        stack.appendChild(createWellCell(c, r, context));
      }

      slice.appendChild(stack);
      ring.appendChild(slice);
    }

    els.wellGrid.appendChild(ring);
    updateDamoAnchor();

    const lockControls = state.inputLocked || state.won || state.gameOver;
    [els.btnLeft, els.btnRight, els.btnRotate, els.btnDrop].forEach((btn) => {
      if (btn) btn.disabled = lockControls;
    });
    const lockDamo = state.won || state.gameOver || state.inputLocked || !state.damo.standing;
    [els.btnDamoLeft, els.btnDamoRight, els.btnDamoJump].forEach((btn) => {
      if (btn) btn.disabled = lockDamo;
    });
  }

  function renderPreview() {
    els.nextPreview.innerHTML = '';
    if (!state.piece) return;

    const maxX = Math.max(...state.piece.cells.map(([x]) => x));
    const maxY = Math.max(...state.piece.cells.map(([, y]) => y));
    els.nextPreview.style.gridTemplateColumns = `repeat(${maxX + 1}, 18px)`;

    for (let y = 0; y <= maxY; y++) {
      for (let x = 0; x <= maxX; x++) {
        const slot = document.createElement('div');
        slot.style.width = '18px';
        slot.style.height = '18px';
        const filled = state.piece.cells.some(([px, py]) => px === x && py === y);
        if (filled) {
          slot.className = `color-${state.piece.color}`;
          const cube = document.createElement('div');
          cube.className = 'preview-cube';
          ['top', 'front', 'right'].forEach((face) => {
            const el = document.createElement('span');
            el.className = `cube-face cube-${face}`;
            cube.appendChild(el);
          });
          slot.appendChild(cube);
        }
        els.nextPreview.appendChild(slot);
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
        ? `On the wall · slice ${state.damo.col + 1} · depth ${state.damo.row}`
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
      wellRotation: state.wellRotation,
      walkable: getWalkableCols(),
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
      musicEnabled: Music.isEnabled(),
      nowPlaying: Music.getCurrentTrack(),
    };

    els.mcpState.textContent = JSON.stringify(payload, null, 2);
    window.GameAPI._state = payload;
  }

  function getWalkableCols() {
    if (!state.damo.standing) return [];
    const cols = [];
    for (let c = 0; c < COLS; c += 1) {
      if (canDamoWalkTo(c, state.damo.row)) cols.push(c);
    }
    return cols;
  }

  function getAvailableActions() {
    const actions = [];
    if (state.won) return ['restart'];
    if (state.gameOver) return ['restart'];
    if (canStandUp()) actions.push('stand-up');
    if (state.damo.standing && !state.inputLocked) {
      if (canDamoWalkTo(wrapCol(state.damo.col - 1), state.damo.row)) actions.push('walk-left');
      if (canDamoWalkTo(wrapCol(state.damo.col + 1), state.damo.row)) actions.push('walk-right');
      const climbable = [];
      for (let r = 0; r < ROWS; r += 1) {
        for (let c = 0; c < COLS; c += 1) {
          if (isClimbableTarget(c, r)) climbable.push({ col: c, row: r });
        }
      }
      if (climbable.length) actions.push('jump', 'climb');
    }
    if (state.piece && !state.inputLocked) {
      actions.push('move-left', 'move-right', 'rotate', 'drop');
    }
    return actions;
  }

  function onCellClick(col, row) {
    if (state.won || state.inputLocked) return;
    Music.unlock();
    Sfx.unlock();
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
    state.dropAnim = null;
    state.landPopCells = null;
    state.inputLocked = false;
    state.wellRotation = 0;
    state.message = 'Damo is lying at the bottom of the well. Stand up. Walk the wall. Build ledges.';
    hideOverlay();
    Sfx.play('restart');
    if (Music.isEnabled()) Music.start();
    spawnPiece();
    updateUI();
  }

  function act(action, params = {}) {
    switch (action) {
      case 'walk-left': return walkDamo(-1);
      case 'walk-right': return walkDamo(1);
      case 'jump': return tryJump();
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
      case 'toggle-music':
        return toggleMusic();
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
    toggleMusic,
    _state: {},
  };

  function toggleMusic() {
    const on = Music.toggle();
    updateMusicButton();
    publishMcpState();
    return on;
  }

  function updateMusicButton() {
    if (!els.btnMusic) return;
    const on = Music.isEnabled();
    els.btnMusic.textContent = on ? '🎵 Music On' : '🔇 Music Off';
    els.btnMusic.setAttribute('aria-pressed', on ? 'false' : 'true');
  }

  function updateNowPlaying(track) {
    if (!els.nowPlaying || !track) return;
    els.nowPlaying.textContent = `♪ ${track.num}. ${track.title} — ${track.genre}`;
  }

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
    els.btnDamoLeft.addEventListener('click', () => walkDamo(-1));
    els.btnDamoRight.addEventListener('click', () => walkDamo(1));
    els.btnDamoJump.addEventListener('click', () => tryJump());
    els.btnStand.addEventListener('click', () => standUp());
    els.btnMute.addEventListener('click', () => toggleSound());
    els.btnMusic.addEventListener('click', () => toggleMusic());
    els.btnRestart.addEventListener('click', () => restart());
    els.btnPlayAgain.addEventListener('click', () => restart());

    document.addEventListener('keydown', (e) => {
      if (state.won || state.gameOver) return;
      const key = e.key;
      if (key === 'ArrowLeft' && !e.shiftKey) { e.preventDefault(); walkDamo(-1); }
      if (key === 'ArrowRight' && !e.shiftKey) { e.preventDefault(); walkDamo(1); }
      if ((key === 'ArrowUp' || key === ' ') && !e.shiftKey) { e.preventDefault(); tryJump(); }
      if (key === 'ArrowLeft' && e.shiftKey) { e.preventDefault(); movePiece(-1); }
      if (key === 'ArrowRight' && e.shiftKey) { e.preventDefault(); movePiece(1); }
      if (key === 'ArrowDown' && e.shiftKey) { e.preventDefault(); dropPiece(); }
      if (key === 'z' || key === 'Z') rotatePiece();
    });

    document.querySelectorAll('[data-mcp-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        publishMcpState();
      });
    });
  }

  function init() {
    els.wellGrid = document.getElementById('well-grid');
    els.damoAnchor = document.getElementById('damo-anchor');
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
    els.btnDamoLeft = document.getElementById('btn-damo-left');
    els.btnDamoRight = document.getElementById('btn-damo-right');
    els.btnDamoJump = document.getElementById('btn-damo-jump');
    els.btnStand = document.getElementById('btn-stand');
    els.btnMute = document.getElementById('btn-mute');
    els.btnMusic = document.getElementById('btn-music');
    els.nowPlaying = document.getElementById('now-playing');
    els.btnRestart = document.getElementById('btn-restart');
    els.btnPlayAgain = document.getElementById('btn-play-again');

    bindEvents();
    Sfx.setRows(ROWS);
    Music.setOnTrackChange(updateNowPlaying);
    updateMuteButton();
    updateMusicButton();
    restart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
