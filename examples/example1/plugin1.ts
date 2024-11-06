import type { Protocol } from '.';
import { invoke, log } from '../../src/operators';

export default ({ INIT, TOPIC1 }: Protocol, config) => {

	INIT.pipe(
		log('plugin1:start'),
		invoke(TOPIC1),
	).reply();

};