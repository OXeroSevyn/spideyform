// --- Background Music & Splash Entrance Controller ---
const audio = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');
const splashOverlay = document.getElementById('splashOverlay');
const enterBtn = document.getElementById('enterBtn');
let isMusicInitialized = false;

// Function to safely set playtime to middle
function setToMiddle() {
  try {
    if (audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = audio.duration / 2;
    } else {
      audio.currentTime = 79; // Safe default middle point for Sunflower
    }
  } catch (e) {
    console.warn("Seeking failed:", e);
  }
}

// Seek to the middle when metadata loads
audio.addEventListener('loadedmetadata', () => {
  setToMiddle();
});

// Update the sound FAB UI
function updateToggleButton(isPlaying) {
  const icon = soundToggle.querySelector('i');
  if (isPlaying) {
    soundToggle.classList.add('playing');
    icon.className = 'fa-solid fa-volume-high';
  } else {
    soundToggle.classList.remove('playing');
    icon.className = 'fa-solid fa-volume-xmark';
  }
}

// Enter Portal Event Handler (Triggering unmuted audio)
enterBtn.addEventListener('click', () => {
  // Seek to middle
  setToMiddle();
  
  // Play unmuted audio (guaranteed to succeed since it runs inside a user click handler)
  audio.muted = false;
  audio.play()
    .then(() => {
      isMusicInitialized = true;
      updateToggleButton(true);
      console.log("Audio started playing successfully on entrance.");
    })
    .catch((err) => {
      console.error("Audio playback failed on entrance:", err);
    });

  // Fade out and remove splash screen from view
  splashOverlay.classList.add('hidden');
});

// Handle manual sound toggle interactions
soundToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  
  if (audio.muted) {
    audio.muted = false;
    audio.play();
    updateToggleButton(true);
  } else if (audio.paused) {
    if (audio.currentTime === 0) {
      setToMiddle();
    }
    audio.muted = false;
    audio.play();
    updateToggleButton(true);
  } else {
    audio.pause();
    updateToggleButton(false);
  }
});
