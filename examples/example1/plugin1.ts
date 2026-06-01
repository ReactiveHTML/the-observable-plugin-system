import { map } from 'rxjs';
import type { Protocol } from '.';
import { PluginBody } from '../../src';
import { invoke, log } from '../../src/operators';

export default (({ INIT, TOPIC1 }, config) => {

	INIT.pipe(
		map(x=>x+1),
		log('plugin1:start'),
		invoke(TOPIC1),
	).reply();

}) as PluginBody<Protocol>;
