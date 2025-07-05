import type { MonoTypeOperatorFunction } from "rxjs";

import { switchMap } from 'rxjs/operators';
import { Duplex } from './duplex';

export const chain = <T, R>(topic: Duplex<T, R>): OperatorFunction<T, R> =>
    switchMap((data: T) => topic.chain(data))
;

