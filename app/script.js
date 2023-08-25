document.addEventListener("DOMContentLoaded", () => {
  let currentAudio = null;
  let progressBar = document.querySelector(".progress-bar");
  let timerDisplay = document.querySelector(".timer-display");
  let isPlaying = false;
  let pausePosition = 0;

  const buttons = document.querySelectorAll(".ice-button");
  const playButton = document.getElementById("play-button");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");
  const stopButton = document.getElementById("stop-button");
  const stopIcon = document.getElementById("stop-icon");
  const progressContainer = document.querySelector(".progress-timer-container");
  const volumeSlider = document.querySelector(".volume-slider");
  const volumeIcon = document.querySelector(".volume-icon img");

  
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const soundName = button.getAttribute("data-sound");
      const musicTitle = button.getAttribute("data-title");
      const musicImage = button.getAttribute("data-image");
      const musicArtist = button.getAttribute("data-artist");

      if (currentAudio) {
        currentAudio.pause();
        if (isPlaying) {
          pausePosition = currentAudio.currentTime;
        }
        progressBar.style.width = "0%";
        timerDisplay.textContent = "0:00";
      }

      if (soundName) {
        currentAudio = new Audio(soundName);
        currentAudio.play();
        document.getElementById("music-title").textContent = musicTitle;
        document.getElementById("music-image").setAttribute("src", musicImage);
        document.getElementById("music-artist").textContent = musicArtist;
        
        // Mettre à jour la classe hidden pour l'image
        const musicImageElement = document.getElementById("music-image");
        if (musicImage) {
          musicImageElement.classList.remove("hidden");
        } else {
          musicImageElement.classList.add("hidden");
        }

        currentAudio.addEventListener("ended", () => {
          isPlaying = false;
          playIcon.style.display = "inline";
          pauseIcon.style.display = "none";
          progressBar.style.width = "0%";
          timerDisplay.textContent = "0:00";
        });

        currentAudio.addEventListener("timeupdate", () => {
          const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
          progressBar.style.width = progress + "%";
          updateTimerDisplay(currentAudio.currentTime, currentAudio.duration);
        });

        isPlaying = true;
        playIcon.style.display = "none";
        pauseIcon.style.display = "inline";
      }
    });
  });

  playButton.addEventListener("click", () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        isPlaying = false;
        playIcon.style.display = "inline";
        pauseIcon.style.display = "none";
      } else {
        if (pausePosition > 0) {
          currentAudio.currentTime = pausePosition;
          pausePosition = 0;
        }
        currentAudio.play();
        isPlaying = true;
        playIcon.style.display = "none";
        pauseIcon.style.display = "inline";
      }
    }
  });

  stopButton.addEventListener("click", () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        isPlaying = false;
        document.getElementById("music-title").textContent = "";
        document.getElementById("music-image").setAttribute("src", "");
        document.getElementById("music-artist").textContent = "";
        const musicImageElement = document.getElementById("music-image");
        musicImageElement.classList.add("hidden");
        currentAudio = null;
        playIcon.style.display = "inline";
        pauseIcon.style.display = "none";
        progressBar.style.width = "0%";
        timerDisplay.textContent = "0:00";

      }
    }
  });

  progressContainer.addEventListener("click", e => {
    if (currentAudio) {
      const clickPosition = (e.clientX - progressContainer.getBoundingClientRect().left) / progressContainer.clientWidth;
      const newTime = clickPosition * currentAudio.duration;
      currentAudio.currentTime = newTime;
    }
  });
  

  volumeSlider.addEventListener("input", () => {
    if (currentAudio) {
      currentAudio.volume = volumeSlider.value;
    }
  });

  volumeIcon.addEventListener("click", () => {
    if (currentAudio) {
      if (currentAudio.volume > 0) {
        // Le son est actuellement activé, nous le désactivons
        previousVolume = currentAudio.volume; // Sauvegarder le volume actuel
        currentAudio.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.src = "icons/mute.png";
      } else {
        // Le son était désactivé, nous le réactivons avec le volume précédent
        currentAudio.volume = previousVolume; // Rétablir le volume précédent
        volumeSlider.value = previousVolume; // Rétablir la valeur du slider
        volumeIcon.src = "icons/sound.png";
      }
    }
  });

  function updateTimerDisplay(currentTime, duration) {
    const formattedCurrentTime = formatTime(currentTime);
    const formattedDuration = formatTime(duration);
    timerDisplay.textContent = `${formattedCurrentTime} / ${formattedDuration}`;
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

});
