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

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const soundName = button.getAttribute("data-sound");

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
        currentAudio = null;
        playIcon.style.display = "inline";
        pauseIcon.style.display = "none";
      }
    }
  });

  progressContainer.addEventListener("click", e => {
    if (currentAudio) {
      const clickPosition = (e.clientX - progressContainer.getBoundingClientRect().left) / progressContainer.clientWidth;
      const newTime = clickPosition * currentAudio.duration;
      currentAudio.currentTime = newTime;
      updateProgressBar(currentAudio.currentTime);
    }
  });

  volumeSlider.addEventListener("input", () => {
    if (currentAudio) {
      currentAudio.volume = volumeSlider.value;
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
