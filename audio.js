(() => {
  let context;
  let master;
  let muted = false;
  let volume = 0.35;
  let atmosphereStarted = false;

  function createAtmosphere() {
    if (context) return;

    context = new AudioContext();
    master = context.createGain();
    master.gain.value = volume * 0.08;
    master.connect(context.destination);

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.7;
    filter.connect(master);

    const drone = context.createOscillator();
    const droneGain = context.createGain();
    drone.type = 'sine';
    drone.frequency.value = 55;
    droneGain.gain.value = 0.7;
    drone.connect(droneGain).connect(filter);
    drone.start();

    const tension = context.createOscillator();
    const tensionGain = context.createGain();
    tension.type = 'triangle';
    tension.frequency.value = 82.41;
    tensionGain.gain.value = 0.16;
    tension.connect(tensionGain).connect(filter);
    tension.start();

    const pulse = context.createOscillator();
    const pulseGain = context.createGain();
    pulse.type = 'sine';
    pulse.frequency.value = 0.09;
    pulseGain.gain.value = 0.09;
    pulse.connect(pulseGain).connect(droneGain.gain);
    pulse.start();

    atmosphereStarted = true;
  }

  function resumeAudio() {
    createAtmosphere();
    if (context.state === 'suspended') context.resume();
  }

  function updateVolume() {
    if (!master) return;
    const target = muted ? 0 : volume * 0.08;
    master.gain.setTargetAtTime(target, context.currentTime, 0.08);
  }

  function syncControls() {
    const toggle = document.querySelector('#sound-toggle');
    if (!toggle) return;
    toggle.textContent = muted ? '🔇' : '🔊';
    toggle.title = muted ? 'Turn sound on' : 'Mute sound';
    toggle.setAttribute('aria-label', toggle.title);
  }

  window.startAtmosphere = () => {
    resumeAudio();
    if (!atmosphereStarted) return;
    updateVolume();
  };

  const toggle = document.querySelector('#sound-toggle');
  const volumeControl = document.querySelector('#sound-volume');

  toggle?.addEventListener('click', () => {
    resumeAudio();
    muted = !muted;
    updateVolume();
    syncControls();
  });

  volumeControl?.addEventListener('input', (event) => {
    volume = Number(event.target.value) / 100;
    if (volume > 0 && muted) muted = false;
    resumeAudio();
    updateVolume();
    syncControls();
  });

  document.querySelector('#enter-temple')?.addEventListener('click', resumeAudio);
  document.querySelector('#continue-game')?.addEventListener('click', resumeAudio);

  syncControls();
})();
