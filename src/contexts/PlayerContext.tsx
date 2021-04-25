import { createContext, ReactNode, useState, useContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  setPlayingState: (state: boolean) => void;
  playList: (episode: Episode[], index: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isLooping: boolean;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  isShuffling: boolean;
  clearPlayerState: () => void;
  closePodcast: () => void;
};

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function closePodcast() {
    setIsPlaying(false);
    setIsLooping(false);
    setIsShuffling(false);
    setCurrentEpisodeIndex(0);
    setEpisodeList([]);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      );
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        toggleShuffle,
        isShuffling,
        clearPlayerState,
        closePodcast,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
};
