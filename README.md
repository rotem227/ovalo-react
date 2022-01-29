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

## Initial State

The basic concept of the library is to define 'segments' data, which is basically an object that holds the app state.

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

## Dispatch Async

The dispatch function supports async state updates by passing a function that returns a Promise.
Once the Promise is resolved, the state will be updated.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from "ovalo-react";

export default function Counter() {
  const { state, dispatch } = useSegment( 'counter' );

  return (
    <div>
      <button
        onClick={ () => dispatch( ( prevState ) => {
            return new Promise( ( res ) => {
                setTimeout( () => res( --prevState ), 2000 );
            } );
        } ) }
      >-</button>

      <span> { state } </span>

      <button
        onClick={ () => dispatch( ( prevState ) => {
            return new Promise( ( res ) => {
                setTimeout( () => res( ++prevState ), 2000 );
            } );
        } ) }
      >+</button>
    </div>
  );
}
```
Each `<button>` click dispatches an async state update, which makes the state value to be increased/decreased by 1 after 2 seconds.

## Dispatch Sequence

The dispatch function supports an array of multiple state updates that run in a sequence.
It can be useful when a certain state update depends on a prior one to be fulfilled.
For example: waiting for an API request and updating a different state only once the API request is fulfilled.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from "ovalo-react";

export default function Counter() {
  const { state, dispatch } = useSegment( 'counter' );

  const action1 = ( prevState ) => new Promise( ( res ) => {
      setTimeout( () => res( prevState - 10 ), 2000 );
  } );

  const action2 = ( prevState ) => new Promise( ( res ) => {
      setTimeout( () => res( prevState - 20 ), 3000 );
  } );

  const sequence = [ action1, action2 ];

  return (
    <div>
      <button
        onClick={ () => dispatch( sequence ) }
      >-</button>

      <span> { state } </span>

      <button
        onClick={ () => dispatch( ( prevState ) => {
            return new Promise( ( res ) => {
                setTimeout( () => res( ++prevState ), 2000 );
            } );
        } ) }
      >+</button>
    </div>
  );
}
```
When clicking the `-` button, the state will be decreased by 10 within 2 seconds, and afterward will be reduced by 20 after 3 seconds (from the moment that the previous action was fulfilled).

## Actions

In addition to the state, the 'counter' segment can also hold pre-defined actions that can manipulate the state data (the actions has the same capabilities as to whatever is passed to the dispatch function).

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

In order to dispatch the actions, they should be destructured from the `useSegment` hook, and should be passed as the dispatch function argument.

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
        onClick={ () => dispatch( reduce( 2 ) ) }
      >-</button>

      <span> {state} </span>

      <button
        onClick={ () => dispatch( add( 3 ) ) }
      >+</button>
    </div>
  );
}
```
Each click on the `+` button will increase the state value by 3, while each click on the `-` button will decrease the value by 2.

## Dispatch Async Actions

In some cases, actions might need to perform an async state updates.
The actions functions can return a Promise, that will update the state value once it's resolved.

Example of `App.jsx` file:

```javascript
import React from 'react';

import { useInitSegments } from 'ovalo-react';

import Counter from './Counter';

const segments = {
  counter: {
    state: 0,
    actions: {
        add: ( number ) => ( prevState ) => {
            return new Promise( ( res ) => {
                setTimeout( () => res( prevState + number ), 2000 );
            } );
        },
        reduce: ( number ) => ( prevState ) => {
            return new Promise( ( res ) => {
                setTimeout( () => res( prevState - number ), 1000 );
            } );
        },
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
By disptaching the `add` action, the state will be changes after 2 seconds, while when dispatching the `reduce`
action the state will be changed after 1 second.

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
        onClick={ () => dispatch( reduce( 2 ) ) }
      >-</button>

      <span> {state} </span>

      <button
        onClick={ () => dispatch( add( 3 ) ) }
      >+</button>
    </div>
  );
}
```
There is no change in terms of the async actions dispatch, the state will be increased after 2 seconds and will be decreased after 1 second.

## Dispatch Without Re-render The Existing Component

In some cases, a certain component should just update the state without consuming it.
When implementing the `useSegment` hook, each dispatch will re-render the existing component because it's bound to the segment state.
Therefore, in order to prevent the existing component re-renders when a state update should be dispatch without consuming the state, use the `useDispatch` hook instead of the `useSegment` hook.
The `useDispatch` hook, holds the dispatch function and the actions object, but does not hold the state, and therefore will not trigger a re-render on each dispatch.

Example of an external `Footer.jsx` component file:

```javascript
import React from 'react';

import { useDispatch } from "ovalo-react";

export default function Footer() {
  const { dispatch, actions } = useDispatch( 'counter' );
  
  const { add, reduce } = actions;

  return (
    <div>
      <h3>Footer Component That Will Not Be Re-rendered:</h3>

      <button onClick={ () => dispatch( add( 5 ) ) }>ADD FROM FOOTER</button>
      <button onClick={ () => dispatch( reduce( 5 ) ) }>REDUCE FROM FOOTER</button>
    </div>
  );
}
```
The footer component can affect the 'counter' state without being re-render on each dispatch, due to not consuming the state and using the `useDispatch` hook, instead of the `useSegment` hook.




