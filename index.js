import { default as useInitSegmentsHook } from './use-init-segments';
import { default as useSegmentHook } from './use-segment';
import { default as useDispatchHook } from './use-dispatch';

import Segments from 'ovalo';

export const useInitSegments = useInitSegmentsHook;
export const useSegment = useSegmentHook;
export const useDispatch = useDispatchHook;

export default Segments;