import type { OperatorFunction } from "rxjs";
import type { DuplexStream } from '../duplex';

import { mergeMap } from 'rxjs';

export const series = <T, R>(topic: DuplexStream<T, R>): OperatorFunction<T, R> =>
	mergeMap((data: T) =>
		topic.invoke(data))
;
