import React, { useState, useEffect } from 'react';
import '../styles/global.scss';
import { useRouter } from "next/router";
import NProgress from "nprogress";

import Header from '../components/Header';
import Player from '../components/Player';
import { PlayerContext } from '../context/PlayerContext';

import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(prevState => !prevState);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  useEffect(() => { 
    let routeChangeStart = () => NProgress.start();
    let routeChangeComplete = () => NProgress.done();

    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", routeChangeComplete);
    router.events.on("routeChangeError", routeChangeComplete);

    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      router.events.off("routeChangeComplete", routeChangeComplete);
      router.events.off("routeChangeError", routeChangeComplete);
    };
  }, [])

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      isPlaying,
      togglePlay,
      setPlayingState
    }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
