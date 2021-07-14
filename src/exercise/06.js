// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js
import {ErrorBoundary} from 'react-error-boundary'

import * as React from 'react'
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

// class ErrorBoundary extends React.Component {
//   state = {error: null}
//   static getDerivedStateFromError(error) {
//     return {error}
//   }
//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }
//     return this.props.children
//   }
// }

function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return

    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({pokemon: pokemonData, status: 'resolve'})
      },
      error => {
        setState({error: error, status: 'rejected'})
      },
    )
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    // This will be handled by error Boundary
    throw error
  } else {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
