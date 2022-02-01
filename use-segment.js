import { useState, useMemo } from 'react';

import Store from 'ovalo';

export default function useSegment( key, group ) {
    const { initialState, dispatch, actions, register } = Store.use( key, group );
    const [ state, setState ] = useState( () => initialState );
    const { unregister, restore } = useMemo( () => register( setState ), [] );

    return {
        state,
        dispatch,
        actions,
        restore,
        unregister,
    };
}