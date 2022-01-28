#Ovalo React
=============

Simple and powerful state management library for React projects.

Superpowers
-------------

- Simple and straightforward structure.
- Async state updates.
- Multiple state updates in sequence (including async updates).
- No redundant re-renders.
- No providers.

Installation
-------------

`npm i ovalo-react`

Usage
-------------

### Creating the segments:

The segments data is the initial state of your app.

`
import { useInitSegments } from 'ovalo-react';

const segments = {
  counter: {
    state: 0,
  },
};

export default function App() {
  useInitSegments( segments );

  return (
    <div className="App">

    </div>
  )
}
`




