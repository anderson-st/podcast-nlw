import '../styles/global.scss';

import { useEffect } from 'react';
import { useRouter } from "next/router";
import NProgress from "nprogress";

import Header from '../components/Header';
import Player from '../components/Player';

import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

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
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>

      <Player />
    </div>
  )
}

export default MyApp
