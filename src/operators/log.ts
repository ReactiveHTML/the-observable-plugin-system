import type { MonoTypeOperatorFunction } from "rxjs";

import { tap } from "rxjs";

export const log = <T>(prefix: string): MonoTypeOperatorFunction<T> =>
	tap<T>((x: T) => console.log(prefix, x))
;
