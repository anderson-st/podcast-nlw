// SPA - Client side
// SSR - Server side (fetch de dados sempre que acessamos essa pagina)
// SSG - Geracao de pagina estatica (gera a mesma pagina pra tds os acessos)

const Home = (props) => {
  return (
    <>
      <div>index</div>
      {JSON.stringify(props.episodes)}
    </>
  )
}

export const getStaticProps = async () => {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json();
  
  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8 // chamada a cada 8 horas
  }
}

export default Home;
