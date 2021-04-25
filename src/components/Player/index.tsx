import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    toggleLoop,
    hasPrevious,
    isShuffling,
    toggleShuffle,
    clearPlayerState,
    closePodcast,
  } = usePlayer();
  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", (event) => {
      setProgress(Math.floor(audioRef.current?.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  return (
    <>
      {episodeList.length > 0 && (
        <div className={styles.playerContainer}>
          <header>
            <span onClick={closePodcast}>Fechar</span>
            <div>
              <img src="/playing.svg" alt="playing now" />
              <strong>Tocando agora</strong>
            </div>
          </header>

          <div className={styles.currentEpisode}>
            <Image
              width={100}
              height={100}
              src={episode.thumbnail}
              objectFit="cover"
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>

          <footer className={styles.empty}>
            <div className={styles.progress}>
              <span>{convertDurationToTimeString(progress)}</span>
              <div className={styles.slider}>
                <Slider
                  max={episode.duration}
                  value={progress}
                  onChange={handleSeek}
                  trackStyle={{ backgroundColor: "#04d361" }}
                  railStyle={{ backgroundColor: "#9f75ff" }}
                  handleStyle={{ backgroundColor: "#04d361", borderWidth: 4 }}
                />
              </div>
              <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
            </div>

            <audio
              src={episode.url}
              autoPlay
              ref={audioRef}
              loop={isLooping}
              onEnded={handleEpisodeEnded}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onLoadedMetadata={setupProgressListener}
            />

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={toggleShuffle}
                className={isShuffling ? styles.isActive : ""}
              >
                <img src="/shuffle.svg" alt="Shuffle" />
              </button>
              <button
                type="button"
                onClick={playPrevious}
                disabled={!hasPrevious}
              >
                <img src="/play-previous.svg" alt="Play previous" />
              </button>
              <button
                type="button"
                className={styles.playButton}
                onClick={togglePlay}
                onPlay={() => setPlayingState(true)}
                onPause={() => setPlayingState(false)}
              >
                {isPlaying ? (
                  <img src="/pause.svg" alt="Play" />
                ) : (
                  <img src="/play.svg" alt="Play" />
                )}
              </button>
              <button type="button" onClick={playNext} disabled={!hasNext}>
                <img src="/play-next.svg" alt="Play next" />
              </button>
              <button
                type="button"
                onClick={toggleLoop}
                className={isLooping ? styles.isActive : ""}
              >
                <img src="/repeat.svg" alt="Repeat" />
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
