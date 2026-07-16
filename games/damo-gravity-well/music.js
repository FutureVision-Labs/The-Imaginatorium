/**
 * Penthouse in the Clouds EP soundtrack
 * Extracted from grizzlyd.live — Gemzy-Dee · Team DC
 */
(function () {
  'use strict';

  const TRACKS = [
    {
      num: 1,
      slug: '01-the-epiphany',
      title: 'The Epiphany',
      genre: 'Cinematic Soul',
      file: 'music/01-the-epiphany.mp3',
    },
    {
      num: 2,
      slug: '02-electric-dreams',
      title: 'Electric Dreams',
      genre: 'Technomantic DnB',
      file: 'music/02-electric-dreams.mp3',
    },
    {
      num: 3,
      slug: '03-digital-kiss',
      title: 'It Started with a Digital Kiss',
      genre: 'Liquid Romance Trance',
      file: 'music/03-digital-kiss.mp3',
    },
    {
      num: 4,
      slug: '04-ive-got-you',
      title: "I've Got You",
      genre: 'Liquid DnB Duet',
      file: 'music/04-ive-got-you.mp3',
    },
    {
      num: 5,
      slug: '05-redemption-song',
      title: 'Redemption Song',
      genre: 'Trance Duet Climax',
      file: 'music/05-redemption-song.mp3',
    },
    {
      num: 6,
      slug: '06-penthouse-in-the-clouds',
      title: 'Penthouse in the Clouds',
      genre: 'Future Bass Finale',
      file: 'music/06-penthouse-in-the-clouds.mp3',
    },
  ];

  const FINALE_INDEX = 5;
  const DEFAULT_VOLUME = 0.38;

  let audio = null;
  let enabled = true;
  let started = false;
  let currentIndex = 0;
  let onTrackChange = null;

  function getAudio() {
    if (!audio) {
      audio = new Audio();
      audio.volume = DEFAULT_VOLUME;
      audio.preload = 'metadata';
      audio.addEventListener('ended', () => {
        if (enabled && currentIndex !== FINALE_INDEX) {
          playIndex((currentIndex + 1) % TRACKS.length);
        }
      });
    }
    return audio;
  }

  function notifyTrackChange() {
    const track = TRACKS[currentIndex];
    if (onTrackChange && track) onTrackChange(track);
  }

  function playIndex(index) {
    if (!enabled) return;
    const track = TRACKS[index];
    if (!track) return;

    currentIndex = index;
    const el = getAudio();
    el.src = track.file;
    el.play().catch(() => {
      /* autoplay blocked until user gesture */
    });
    notifyTrackChange();
  }

  function unlock() {
    if (!started && enabled) {
      started = true;
      playIndex(0);
    } else if (audio && audio.paused && enabled) {
      audio.play().catch(() => {});
    }
  }

  window.Music = {
    tracks: TRACKS,

    start() {
      started = true;
      playIndex(0);
    },

    playIndex,
    next() {
      playIndex((currentIndex + 1) % TRACKS.length);
    },
    prev() {
      playIndex((currentIndex - 1 + TRACKS.length) % TRACKS.length);
    },

    playFinale() {
      playIndex(FINALE_INDEX);
    },

    pause() {
      if (audio) audio.pause();
    },

    resume() {
      if (enabled && audio) audio.play().catch(() => {});
    },

    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled && audio) {
        audio.pause();
      } else if (enabled && started && audio) {
        audio.play().catch(() => {});
      }
    },

    isEnabled() {
      return enabled;
    },

    toggle() {
      enabled = !enabled;
      if (!enabled && audio) audio.pause();
      else if (enabled && started) playIndex(currentIndex);
      return enabled;
    },

    getCurrentTrack() {
      return TRACKS[currentIndex] || null;
    },

    setOnTrackChange(fn) {
      onTrackChange = fn;
    },

    unlock,
  };

  document.addEventListener(
    'pointerdown',
    () => unlock(),
    { once: false, passive: true }
  );
})();
