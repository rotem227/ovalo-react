import { useMemo } from 'react';

import Segments from 'ovalo';

export default function useInitSegments( config, group ) {
    const segments = useMemo( () => Segments.init( config, group ), [] );

    return {
        segments,
    };
}