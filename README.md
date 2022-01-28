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

Usage
-------------

## Basic State

The basic concept of the library is to define 'segments' data, which is basically an object that holds the app state and actions.

### Creating segments data:

The segments data is the initial state of the app.

Example of `App.jsx` file:

```javascript
import React from 'react';

import { useInitSegments } from 'ovalo-react';

import Counter from './Counter';

const segments = {
  counter: {
    state: 0,
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

## Dispatch

The dispatch function can be destructured from the `useSegment` hook, and can manipulate the state value.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from "ovalo-react";

export default function Counter() {
  const { state, dispatch } = useSegment( 'counter' );

  return (
    <div>
      <button
        onClick={ () => dispatch( ( prevState ) => --prevState ) }
      >-</button>

      <span> { state } </span>

      <button
        onClick={ () => dispatch( ( prevState ) => ++prevState ) }
      >+</button>
    </div>
  );
}
```
Each `<button>` click dispatches a state update, which makes the state value to be increased/decreased by 1.

## Actions

In addition to the state, the 'counter' segment can also hold pre-defined actions that can manipulate the state data:

Example of `App.jsx` file:

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

## Dispatch Actions

In addition to the state, the 'counter' segment can also hold pre-defined actions that can manipulate the state data.

The actions can also be destructured from the `useSegment` hook.

Example of a `Counter.jsx` component file:

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

      <span> {state} </span>

      <button
        onClick={ () => dispatch( reduce ) }
      >+</button>
    </div>
  );
}
```
By dispatching the 'counter' segment actions, the state value will be increased/decreased by 1.

## Actions With Dynamic Values

In some cases you might need the ability to control the actions values from outside.
In this case, each action should return a function that returns an inner function.
The outer function will hold the dynamic value while the inner function will hold the prevState.

Example of `App.jsx` file:

```javascript
import React from 'react';

import { useInitSegments } from 'ovalo-react';

import Counter from './Counter';

const segments = {
  counter: {
    state: 0,
    actions: {
        add: ( number ) => ( prevState ) => prevState + number,
        reduce: ( number ) => ( prevState ) => prevState - number,
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

## Dispatch Actions With Dynamic Values

In this case, each action can affect the state with a different value.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from "ovalo-react";

export default function Counter() {
  const { state, dispatch, actions } = useSegment( 'counter' );
  
  const { add, reduce } = actions;

  return (
    <div>
      <button
        onClick={ () => dispatch( add( 3 ) ) }
      >-</button>

      <span> {state} </span>

      <button
        onClick={ () => dispatch( reduce( 2 ) ) }
      >+</button>
    </div>
  );
}
```

Each click on the `+` button will increase the state value by 3, while each click on the `-` button will decrease the value by 2.






