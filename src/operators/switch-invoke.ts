import type { OperatorFunction } from "rxjs";
import type { Duplex } from '../duplex';

import { switchMap } from 'rxjs';

export const switchInvoke = <T, R>(topic: Duplex<T, R>): OperatorFunction<T, R> =>
    switchMap(topic.invoke.bind(topic))
;

