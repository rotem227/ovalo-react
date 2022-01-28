import Store from 'ovalo';

export default function useDispatch( key, group ) {
    const { dispatch, actions } = Store.use( key, group );

    return {
        dispatch,
        actions,
    };
}