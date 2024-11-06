import type { Protocol } from ".";
import { delay, scan, map, mergeMap, switchMap, tap } from "rxjs";
import { chain, invoke, log, switchInvoke } from '../../src/operators';

export default ({ TOPIC1, TOPIC2, TOPIC3 }: Protocol, config) => {

	TOPIC1.pipe(
		delay(500),
		log('plugin2:start'),
		log(`config.module2 = ${config.module2}`),
		map(n => n+1),
		// mergeMap(TOPIC2.invoke.bind(TOPIC2)),
		switchInvoke(TOPIC2),
		// chain(TOPIC2),
		log('BACK FROM TOPIC3'),
		//map(([a, b]) =>a+b),
		scan((a, b) =>a+b),
		log('COUNT'),
	).subscribe(TOPIC3);

};
