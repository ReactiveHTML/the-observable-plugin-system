import type { Protocol } from ".";

import { delay, map } from "rxjs";
import { emit, log } from '../../src/operators';

export default async ({ TOPIC2, LOG }: Protocol, config) => {

	TOPIC2.pipe(
		delay(1000),
		map(x => 10+x),
		emit(LOG),
	).reply()

};
