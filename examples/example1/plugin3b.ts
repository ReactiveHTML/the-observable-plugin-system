import type { Protocol } from ".";

import { delay, interval, map, switchMap, tap, take } from "rxjs";
import { emit, log } from '../../src/operators';

export default async ({ TOPIC2, LOG }: Protocol, config) => {

	const ten = interval(500).pipe(
		map(x => Math.round(Math.random() *5)),
		//map(x => config.module1),
		take(10)
	);

	TOPIC2.pipe(
		log('plugin3b:start'),
		switchMap(x => ten),
		log('plugin3b reply'),
	).reply()

};