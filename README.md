Ovalo React
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

Basic Concept
-------------

The basic concept of the library is to define 'segments' data, which is basically an object that holds the app state and actions.

**Creating a 'counter' segment state:**

```javascript
const segments = {
  counter: {
    state: 0,
  },
};
```

In addition to the state, the 'counter' segment can also hold pre-defined actions that can manipulate the state data:

```javascript
const segments = {
  counter: {
    state: 0,
    actions: {
        add: ( prevState ) => ++prevState,
        reduce: ( prevState ) => ---prevState,
    },
  },
};
```
By dispatching the 'counter' segment actions, the state value will be increased/reduced by 1.

Usage
-------------

### Creating segments data:

The segments data is the initial state of the app.

Example of the `App.jsx` file:

```javascript
import React from 'react';

import { useInitSegments } from 'ovalo-react';

import Counter from './Counter';

const segments = {
  counter: {
    state: 0,
    actions: {
        add: ( prevState ) => ++prevState,
        reduce: ( prevState ) => --prevState,
    },
  },
};

export default function App() {
  useInitSegments( segments );

  return (
    <div className="App">
      <Counter />
    </div>
  )
}
```

Example of the `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from "ovalo-react";

export default function Counter() {
  const { state, dispatch, actions } = useSegment( 'counter' );
  
  const { add, reduce } = actions;

  return (
    <div>
      <button
        onClick={ () => dispatch( add ) }
      >-</button>

      <span> { state } </span>

      <button
        onClick={ () => dispatch( reduce ) }
      >+</button>
    </div>
  );
}
```
TEach <button> click, dispatches one of the segment actions, which makes the state value to be increased/decreased by 1.



