// --- Background Music Autoplay Controller ---
const audio = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');
let isMusicInitialized = false;

// Function to set playtime to middle (fallback to 79s if duration is NaN)
function setToMiddle() {
  if (audio.duration && !isNaN(audio.duration)) {
    audio.currentTime = audio.duration / 2;
  } else {
    audio.currentTime = 79; // Safe default middle point for Sunflower
  }
}

// Seek to the middle of the track when metadata loads
audio.addEventListener('loadedmetadata', () => {
  setToMiddle();
});

// Play audio on first user interaction (browser restriction bypass)
function startAutoplay() {
  if (isMusicInitialized) return;
  
  // Set to middle before playing
  setToMiddle();
  
  // Try to play
  audio.play()
    .then(() => {
      isMusicInitialized = true;
      updateToggleButton(true);
      // Clean up event listeners
      document.removeEventListener('click', startAutoplay);
      document.removeEventListener('touchstart', startAutoplay);
    })
    .catch((err) => {
      console.warn("Autoplay blocked by browser policy. waiting for click.", err);
    });
}

// Add listeners for interaction
document.addEventListener('click', startAutoplay);
document.addEventListener('touchstart', startAutoplay);

// Toggle sound manually
soundToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Avoid triggering startAutoplay again
  if (audio.paused) {
    setToMiddle();
    audio.play()
      .then(() => {
        isMusicInitialized = true;
        updateToggleButton(true);
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
