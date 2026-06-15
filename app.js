// --- Background Music Autoplay Controller ---
const audio = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');
let isMusicInitialized = false;

// Seek to the middle of the track when metadata loads
audio.addEventListener('loadedmetadata', () => {
  audio.currentTime = audio.duration / 2;
});

// Fallback if metadata is preloaded or cached
if (audio.readyState >= 1) {
  audio.currentTime = audio.duration / 2 || 79;
}

// Play audio on first user interaction (browser restriction bypass)
function startAutoplay() {
  if (isMusicInitialized) return;
  
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
      console.warn("Autoplay blocked by browser policy. Waiting for user interaction.");
    });
}

// Add listeners for interaction
document.addEventListener('click', startAutoplay);
document.addEventListener('touchstart', startAutoplay);

// Toggle sound manually
soundToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Avoid triggering startAutoplay again
  if (audio.paused) {
    // If not initialized, set position to middle
    if (!isMusicInitialized) {
      audio.currentTime = audio.duration / 2 || 79;
      isMusicInitialized = true;
    }
    audio.play();
    updateToggleButton(true);
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
