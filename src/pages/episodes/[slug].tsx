import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss'

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  description: string,
  url: string
}

type EpisodeProps = {
  episode: Episode
}

const Episode = ({ episode }: EpisodeProps) => {
  /** Caso fallback: true, então: */
  // const router = useRouter();

  // if (router.isFallback) // está em carregamento (pois fallback foi setado como true no getStaticPaths)
  // {
  //   return <h1>Carregando...</h1>
  // }

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href='/'>
          <button type='button'>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image 
          width={700} 
          height={160}
          src={episode.thumbnail}
          objectFit='cover'  
        />
        
        <button type='button'>
          <img 
            src="/play.svg" 
            alt="Tocar episódio" 
          />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div 
        className={styles.description} 
        dangerouslySetInnerHTML={{ __html: episode.description }}  
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    // ?_limit=12&_sort=published_at
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
    /**
     * fallback: false -> Se a pagina for acessada e e ela nao foi gerada no 
     * momento da build, então será retornado 404.
     * -------------------------------------------------------------------------------
     * fallback: true -> Se a pagina for acessada e ela não foi gerada no 
     * momento da build, então o Next tentará buscar os dados daquela página, 
     * pra depois salvar ela em disco. Mas essa chamada ocorre do lado do 
     * client, portanto precisamos mostrar um loading por exemplo.
     * -------------------------------------------------------------------------------
     * fallback: 'blocking' -> Roda a requisicao pra buscar os dados no lado 
     * do server do Nextjs Ou seja, o usuário so vai navegar pra determinada 
     * tela quando os dados tiverem sido carregados. (melhor pra questão de 
     * SEO). As paginas que nao foram geradas na build, serao geradas 
     * conforme as paginar vao sendo acessadas.
     */
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', 
      { locale: ptBR }
    ),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url
  }

  const ONE_DAY = 60 * 60 * 24
  
  return {
    props: {
      episode
    },
    revalidate: ONE_DAY
  }
}

export default Episode;