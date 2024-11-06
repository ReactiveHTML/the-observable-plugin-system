import type { Protocol } from ".";
import { bufferTime, delay, scan, map, mergeMap, take, tap } from "rxjs";
import { log } from '../../src/operators';

export default ({ TOPIC3, JOINED }: Protocol, config) => {

	TOPIC3.pipe(
		log('plugin4:start'),
		bufferTime(4000),
		take(1),
		scan((a, b)=>a.concat(b), []),
		map(s=>s.join(':')),
		delay(2000),
	).subscribe(JOINED);

};
