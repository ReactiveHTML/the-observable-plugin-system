import type { OperatorFunction } from 'rxjs';
import type { DuplexStream } from '../duplex';

import { mergeMap } from 'rxjs/operators';

export const invoke = <T, R>(topic: DuplexStream<T, R>): OperatorFunction<T, R> =>
    mergeMap(topic.invoke.bind(topic))
;

