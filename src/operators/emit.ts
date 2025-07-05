import type { Observable, Subject, MonoTypeOperatorFunction } from "rxjs";

import { tap } from "rxjs";
import { Channel } from "../types";

export const emit = <T>(topic: Channel<string, T>): MonoTypeOperatorFunction<T> =>
    tap<T>((data: T) => topic.next(data))
;
