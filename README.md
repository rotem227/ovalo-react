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

Sneak Peek
-------------

- Segments holds the app global state data.
- Segments data structure:
```javascript
const segments = {
  counter: {
    state: 0,
  },
};
```
- Initializing the segments data:
```javascript
useInitSegments( segments );
```
- Consume a segment state data:
```javascript
const { state, dispatch } = useSegment( 'counter' );
```
- Dispatch a state change:
```javascript
dispatch( ( prevState ) => prevState + 1 );
```
- Dispatch an async state change:
```javascript
dispatch( ( prevState ) => new Promise( ( res ) => {
    setTimeout( () => res( prevState + 5 ), 2000 );
} ) );
```
- Dispatch a sequence (gradually executed):
```javascript
const action1 = ( prevState ) => new Promise( ( resolve ) => {
    setTimeout( () => resolve( prevState - 10 ), 2000 );
} );

const action2 = ( prevState ) => new Promise( ( resolve ) => {
    setTimeout( () => resolve( prevState - 20 ), 3000 );
} );

dispatch( [ action1, action2 ] );
```
- Actions that can be executed by the dispatch function:
```javascript
const segments = {
  counter: {
    state: 0,
    actions: {
        add: ( prevState ) => ++prevState,
        reduce: ( prevState ) => --prevState,
    },
  },
};
```
- Consume actions in the component:
```javascript
const { state, dispatch, actions } = useSegment( 'counter' );
```
- Dispatch actions:
```javascript
dispatch( actions.add );
```
- Define actions with dynamic values: 
```javascript
const segments = {
  counter: {
    state: 0,
    actions: {
        add: ( number ) => ( prevState ) => prevState + number,
        reduce: ( number ) => ( prevState ) => prevState - number,
    },
  },
};
```
- Dispatch actions with dynamic values:
```javascript
dispatch( actions.add( 3 ) );
```
- Dispatch without re-rendering the existing component by using `useDispatch` hook instead of the `useSegment` hook:
```javascript
const { dispatch, actions } = useDispatch( 'counter' );
```
- The state structure can be either a primitive, array or an object.
- Initializing segments groups:
```javascript
useInitSegments( mainSegments, 'main' );
useInitSegments( footerSegments, 'footer' );
```
- Consuming a segment from group:
```javascript
const { state, dispatch, actions } = useSegment( 'counter', 'main' );
```
- The segments state can be exposed in the 'window' level.
- Initializing the semgnets data can be done even before the app is loaded.

Usage With Examples
-------------

### Initialize The Segments State

The basic concept of the library is to define 'segments' data, which is basically an object that holds the app state.

**Creating segments data:**

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

### Dispatch

The dispatch function can be deconstructured from the `useSegment` hook, and can manipulate the state value.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from 'ovalo-react';

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

### Dispatch Async

The dispatch function supports async state updates by passing a function that returns a Promise.
Once the Promise is resolved, the state will be updated.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from 'ovalo-react';

export default function Counter() {
  const { state, dispatch } = useSegment( 'counter' );

  return (
    <div>
      <button
        onClick={ () => dispatch( ( prevState ) => {
            return new Promise( ( resolve ) => {
                setTimeout( () => resolve( --prevState ), 2000 );
            } );
        } ) }
      >-</button>

      <span> { state } </span>

      <button
        onClick={ () => dispatch( ( prevState ) => {
            return new Promise( ( resolve ) => {
                setTimeout( () => resolve( ++prevState ), 2000 );
            } );
        } ) }
      >+</button>
    </div>
  );
}
```
Each `<button>` click dispatches an async state update, which makes the state value to be increased/decreased by 1 after 2 seconds.

### Dispatch Sequence

The dispatch function supports an array of multiple state updates that run in a sequence.

It can be useful when a certain state update depends on a prior one to be fulfilled.

For example: waiting for an API request and updating a different state only once the API request is fulfilled.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from 'ovalo-react';

export default function Counter() {
  const { state, dispatch } = useSegment( 'counter' );

  const action1 = ( prevState ) => new Promise( ( resolve ) => {
      setTimeout( () => resolve( prevState - 10 ), 2000 );
  } );

  const action2 = ( prevState ) => new Promise( ( resolve ) => {
      setTimeout( () => resolve( prevState - 20 ), 3000 );
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
            return new Promise( ( resolve ) => {
                setTimeout( () => resolve( ++prevState ), 2000 );
            } );
        } ) }
      >+</button>
    </div>
  );
}
```
When clicking the `-` button, the state will be decreased by 10 within 2 seconds, and afterward will be reduced by 20 after 3 seconds (from the moment that the previous action was fulfilled).

### Actions

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

### Dispatch Actions

In order to dispatch the actions, they should be deconstructured from the `useSegment` hook, and should be passed as the dispatch function argument.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from 'ovalo-react';

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

### Actions With Dynamic Values

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

### Dispatch Actions With Dynamic Values

In this case, each action can affect the state with a different value.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from 'ovalo-react';

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

### Dispatch Async Actions

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
            return new Promise( ( resolve ) => {
                setTimeout( () => resolve( prevState + number ), 2000 );
            } );
        },
        reduce: ( number ) => ( prevState ) => {
            return new Promise( ( resolve ) => {
                setTimeout( () => resolve( prevState - number ), 1000 );
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

import { useSegment } from 'ovalo-react';

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

### Dispatch Without Re-render The Existing Component

In some cases, a certain component should just update the state without consuming it.

When implementing the `useSegment` hook, each dispatch will re-render the existing component because it's bound to the segment state.

Therefore, in order to prevent the existing component re-renders when a state update should be dispatch without consuming the state, use the `useDispatch` hook instead of the `useSegment` hook.

The `useDispatch` hook, holds the dispatch function and the actions object, but does not hold the state, and therefore will not trigger a re-render on each dispatch.

Example of an external `Footer.jsx` component file:

```javascript
import React from 'react';

import { useDispatch } from 'ovalo-react';

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

### State Structure

The state structure can be either a primitive, array or an object.

For example:

```javascript
const segments = {
  counter: {
    state: 0,
    actions: {
        add: ( prevState ) => ++prevState,
        reduce: ( prevState ) => --prevState,
    },
  },
  todos: {
    state: [],
    actions: {
        addTodo: ( todo ) => ( prevState ) => [ ...prevState, todo ],
    },
  },
  menu: {
    state: {
        isOpened: false,
        items: [],
    },
    actions: {
        toggle: ( prevState ) => ( { ...prevState, isOpened: ! prevState.isOpened } ),
        addItem: ( newItem ) => ( prevState ) => ( { ...prevState, items: [ ...prevState.items, newItem ] } ),
    },
  },
};
```

### Groups

The segments data can be configured as multiple groups that manage their state separately.

This can be useful when working with multiple apps that needs to share the same global state, but still manage their own state in a separated scope.

The `useInitSegments` hook can get a second argument that defines each group name.

Example of `App.jsx` file:

```javascript
import React from 'react';

import { useInitSegments } from 'ovalo-react';

import Counter from './Counter';
import Footer from './Footer';

const mainSegments = {
  counter: {
    state: 0,
  },
};

const footerSegments = {
  counter: {
    state: 0,
  },
};

export default function App() {
  useInitSegments( mainSegments, 'main' );

  useInitSegments( footerSegments, 'footer' );

  return (
    <div className="App">
      <Counter />

      <Footer />
    </div>
  )
}
```

### Working With Segments Groups

By defining multiple segments groups ('main' and 'footer') each segment state will be managed separately.
Meaning, each state update of the 'main' group counter, will not affect the 'footer' group counter.

**Notice:** additional argument `'main'` was added to the `useSegment` hook: `useSegment( 'counter', 'main' )`.

Example of a `Counter.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from 'ovalo-react';

export default function Counter() {
  const { state, dispatch } = useSegment( 'counter', 'main' );

  return (
    <div>
      <h3>Counter Component:</h3>
      
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
The state will be updated only in the `Counter` component, without affect the `Footer` component (see below).

**Notice:** additional argument `'footer'` was added to the `useSegment` hook: `useSegment( 'counter', 'footer' )`.

Example of a `Footer.jsx` component file:

```javascript
import React from 'react';

import { useSegment } from 'ovalo-react';

export default function Footer() {
  const { state, dispatch } = useSegment( 'counter', 'footer' );

  return (
    <div>
      <h3>Footer Component:</h3>
      
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
The state will be updated only in the `Footer` component, without affect the `Counter` component.

### Exposing The Segments State In The 'Window' Level

The segments state can be exposed in the 'window' level, so that external an external source can affect the app state.

By deconstructuring `segments` from the `useInitSegments` hook, will allow to expose the state in the 'window' level.

Example of `App.jsx` file:

```javascript
import React, { useEffect } from 'react';

import { useInitSegments } from 'ovalo-react';

import Counter from './Counter';

const initialSegments = {
  counter: {
    state: 0,
    actions: {
        add: ( prevState ) => ++prevState,
        reduce: ( prevState ) => --prevState,
    },
  },
};

export default function App() {
  const { segments } = useInitSegments( initialSegments );

  useEffect( () => {
    window.segments = segments;
  }, [] );

  return (
    <div className="App">
      <Counter />
    </div>
  )
}
```

### Working With The Global Segments State In The 'Window' Level

Using the segments in the 'window' level is almost the same as using the `useSegment` hook with a few minor differences:

Instead of working with the `useSegment` hook, in the window ou should be using: `segments.use`.

**Note:** Dispatching actions will be done in the exact same way as in the react environment.

```javascript
const { dispatch, actions } = segments.use( 'counter' );

const { add, reduce } = actions;

// Actions can be dispatched in the exact same way as in the react environment.
dispatch( add );

// After 2 seconds.
setTimeout( () => {
    // The state can also be changed by passing a function in the exact same way as in the react environment.
    dispatch( ( prevState ) => prevState - 5 );
}, 2000 );
```

Instead of the `state` value, the `segment.use` expose only the initial state value.

Due to not being in a react environment (when working in the 'window' level), the state is not being updated automatically, and therefore there is no meaning for getting the `state` from the semgnet.

The only data that is available and related to the state is the initial value, that can also be deconstructed:

```javascript
const { initial, dispatch, actions } = segments.use( 'counter' );

console.log( 'Initial state value that will not be updated on state changes: ', initial );
```

In order to get the updated state value will be consumed differently from the react environement:

Deconstruct `register' and declare a function that will be triggered on each state change, and will get the current state value as its argument:

```javascript
const { dispatch, actions, register } = segments.use( 'counter' );

const onStateChange = ( currentState ) => {
    console.log( 'The current state value is: ', currentState );  
};

register( onStateChange ); // Registering the onStateChange function to be triggered on each state changes.

dispatch( add ); // Changing the state will trigger the registered onStateChange function.
```

**For more information on how to work with the ovalo global state, outsite of the react environment, see the following documentation:**

### Initializing Segments Data Before The App Is Loaded

The segments data can also be initialized before the app is loaded by importing `Segments` from the library.

The segments data can be initialized before the app is injected to the DOM, or even by any other source that is external to the app.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import Segments from 'ovalo-react';

const initialSegments = {
  counter: {
    state: 0,
    actions: {
        add: ( prevState ) => ++prevState,
        reduce: ( prevState ) => --prevState,
    },
  },
};

Segments.init( initialSegments );

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```
**Note:** There is no differnce in terms of using the state inside the components.





