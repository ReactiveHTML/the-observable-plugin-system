import { IPlugMessageBus, ParallelHandler, SerialHandler } from "./types";

/**
 * A framework-agnostic spy implementation to be used in tests
**/
export type SpyFn = SerialHandler<unknown, unknown> | ParallelHandler<unknown, unknown>;

export const mockPlug = (spyFn?: SpyFn) => {

	const series = spyFn?.();
	const parallel = spyFn?.();

	const mock: IPlugMessageBus = series;
	mock.serial = series;
	mock.parallel = parallel;
	mock.map = parallel;
	mock.reduce = mock.series;
	mock.chain = mock.series;

	const p = Promise.resolve(mock)

	p.serial = series;
	p.parallel = parallel;
	p.map = parallel;
	p.reduce = mock.series;
	p.chain = mock.series;

	//p.then(xx =>
	//	Object.entries(xx)
	//		.forEach(([k, v]) => p[k] = x[k])
	//);

	// Object.entries(mock)
	// 	.forEach(([k, v]) => {
	// 		if(p.hasOwnProperty(k)) {
	// 			p[k] = mock[k]
	// 		}
	// 	});

	return p
}

