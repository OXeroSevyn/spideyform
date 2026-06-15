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
    console.log("Audio seeked to middle successfully.");
  } catch (e) {
    console.warn("Seeking to middle failed, will retry on play/loadedmetadata.", e);
  }
}

// Seek to the middle of the track when metadata loads
audio.addEventListener('loadedmetadata', () => {
  if (isMusicInitialized) {
    setToMiddle();
  }
});

// Play audio on first user interaction (browser restriction bypass)
function startAutoplay() {
  if (isMusicInitialized) return;
  
  // Try to play first (browsers require play action on click before seeking is reliable)
  audio.play()
    .then(() => {
      isMusicInitialized = true;
      updateToggleButton(true);
      
      // Once playing, safely set the position to the middle
      if (audio.readyState >= 1) {
        setToMiddle();
      } else {
        audio.addEventListener('loadedmetadata', setToMiddle, { once: true });
      }
      
      // Clean up event listeners
      document.removeEventListener('click', startAutoplay);
      document.removeEventListener('touchstart', startAutoplay);
    })
    .catch((err) => {
      console.warn("Autoplay blocked by browser policy. Waiting for explicit click.", err);
    });
}

// Add listeners for interaction
document.addEventListener('click', startAutoplay);
document.addEventListener('touchstart', startAutoplay);

// Toggle sound manually
soundToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Avoid triggering startAutoplay again
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
      .catch((err) => console.error("Error playing audio manually:", err));
  } else {
    audio.pause();
    updateToggleButton(false);
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
