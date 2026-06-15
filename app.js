// --- Background Music Autoplay Controller ---
const audio = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');
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
function updateToggleButton(isPlaying, isMuted = false) {
  const icon = soundToggle.querySelector('i');
  if (isPlaying && !isMuted) {
    soundToggle.classList.add('playing');
    icon.className = 'fa-solid fa-volume-high';
  } else {
    soundToggle.classList.remove('playing');
    icon.className = 'fa-solid fa-volume-xmark';
  }
}

// Autoplay attempt when page loads
function initAutoplay() {
  setToMiddle();
  
  // 1. Try playing with sound
  audio.play()
    .then(() => {
      isMusicInitialized = true;
      updateToggleButton(true);
      console.log("Autoplay success: Audio playing with sound.");
    })
    .catch((err) => {
      console.warn("Standard autoplay blocked by browser policy. Attempting muted autoplay...", err);
      
      // 2. Fallback: play muted in the background
      audio.muted = true;
      audio.play()
        .then(() => {
          isMusicInitialized = true;
          updateToggleButton(true, true); // Visual indicator stays muted
          console.log("Muted autoplay success. Waiting for user to unmute.");
        })
        .catch((e) => {
          console.error("Muted autoplay also blocked:", e);
        });
    });
}

// Execute autoplay sequence
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAutoplay);
} else {
  initAutoplay();
}

// Handle manual sound toggle interactions
soundToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  
  if (audio.muted) {
    // If it was playing muted, unmute it
    audio.muted = false;
    audio.play();
    updateToggleButton(true);
    console.log("Audio unmuted manually.");
  } else if (audio.paused) {
    // If paused, resume playback from middle or current position
    if (audio.currentTime === 0) {
      setToMiddle();
    }
    audio.muted = false;
    audio.play();
    updateToggleButton(true);
    console.log("Audio playing.");
  } else {
    // If playing, pause playback
    audio.pause();
    updateToggleButton(false);
    console.log("Audio paused.");
  }
});
