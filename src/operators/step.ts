import type { MonoTypeOperatorFunction } from "rxjs";

import { tap } from 'rxjs';

export const step = <T>(): MonoTypeOperatorFunction<T> =>
	tap((data: T) => {
		console.log(data);
		debugger;
	})
;
