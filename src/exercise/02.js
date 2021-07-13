// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  // PROBLEM: It will fetch the getItem everything this component re-render and it is a performance bottleneck!!!
  // const [name, setName] = React.useState(
  //   window.localStorage.getItem('name') || initialName,
  //   console.log('called'),
  // )

  // SOLUTION: useState allows you to pass a function instead of actual value.
  const [state, setState] = React.useState(() => {
    const valInLocalStorate = window.localStorage.getItem(key)
    if (valInLocalStorate) {
      return deserialize(valInLocalStorate)
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  // If key is changed
  const prevKeyRef = React.useRef(key)

  // This will get called whenever this component rerender
  // Only run this whenever the name state change!!
  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    // remove the old key and its data
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }

    //update the prevKeyRef with the new key
    prevKeyRef.current = key

    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
