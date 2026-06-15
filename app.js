// --- Background Music Autoplay Controller with Visual Diagnostics ---
const audio = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');
let isMusicInitialized = false;

// Create floating diagnostic panel for the user
const diag = document.createElement('div');
diag.id = 'audio-diagnostics';
diag.style.position = 'fixed';
diag.style.bottom = '15px';
diag.style.left = '15px';
diag.style.background = 'rgba(15, 20, 15, 0.9)';
diag.style.color = '#39ff14';
diag.style.padding = '12px 16px';
diag.style.borderRadius = '10px';
diag.style.fontSize = '12px';
diag.style.fontFamily = 'monospace';
diag.style.zIndex = '9999';
diag.style.border = '1.5px solid rgba(57, 255, 20, 0.4)';
diag.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
diag.style.pointerEvents = 'none';
diag.innerHTML = '⚡ Diagnostics: Ready. Click anywhere on the left page column to test playback.';
document.body.appendChild(diag);

function logDiag(msg, isError = false) {
  diag.style.color = isError ? '#ff0050' : '#39ff14';
  diag.style.borderColor = isError ? 'rgba(255, 0, 80, 0.5)' : 'rgba(57, 255, 20, 0.4)';
  diag.innerHTML = (isError ? '❌ ' : '⚡ ') + 'Diagnostics: ' + msg;
  console.log('[Diag] ' + msg);
}

// Function to safely set playtime to middle
function setToMiddle() {
  try {
    if (audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = audio.duration / 2;
    } else {
      audio.currentTime = 79; // Safe default middle point for Sunflower
    }
    logDiag("Position set to middle of track (" + Math.round(audio.currentTime) + "s).");
  } catch (e) {
    logDiag("Failed seeking. ReadyState: " + audio.readyState + ". Error: " + e.message, true);
  }
}

// Seek to the middle of the track when metadata loads
audio.addEventListener('loadedmetadata', () => {
  logDiag("Metadata loaded. Track duration: " + Math.round(audio.duration) + "s.");
  if (isMusicInitialized) {
    setToMiddle();
  }
});

// Play audio on first user interaction
function startAutoplay() {
  if (isMusicInitialized) return;
  
  logDiag("Click detected. Invoking audio.play()...");
  
  audio.play()
    .then(() => {
      isMusicInitialized = true;
      updateToggleButton(true);
      
      // Once playing, safely set the position to the middle
      if (audio.readyState >= 1) {
        setToMiddle();
      } else {
        logDiag("Playing. Waiting for metadata to seek...");
        audio.addEventListener('loadedmetadata', setToMiddle, { once: true });
      }
      
      // Clean up event listeners
      document.removeEventListener('click', startAutoplay);
      document.removeEventListener('touchstart', startAutoplay);
    })
    .catch((err) => {
      logDiag("Playback blocked or failed. Error name: " + err.name + " - Msg: " + err.message, true);
    });
}

// Add listeners for interaction
document.removeEventListener('click', startAutoplay);
document.addEventListener('click', startAutoplay);
document.addEventListener('touchstart', startAutoplay);

// Toggle sound manually
soundToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Avoid triggering startAutoplay again
  logDiag("Sound toggle FAB clicked.");
  if (audio.paused) {
    audio.play()
      .then(() => {
        isMusicInitialized = true;
        updateToggleButton(true);
        if (audio.readyState >= 1) {
          setToMiddle();
        } else {
          audio.addEventListener('loadedmetadata', setToMiddle, { once: true });
        }
      })
      .catch((err) => {
        logDiag("Manual play failed: " + err.message, true);
      });
  } else {
    audio.pause();
    updateToggleButton(false);
    logDiag("Audio paused manually.");
  }
});

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
