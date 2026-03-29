import { Observable, OperatorFunction, ReplaySubject, Subject, Subscription, UnaryFunction, firstValueFrom, of, switchMap } from 'rxjs';

export class DuplexStream<T, R=T> extends ReplaySubject<T> {
	origin: Subject<R>;

	constructor(source?: Subject<R>) {
		super(1);
		this.origin = source ?? new ReplaySubject<R>(1);
	}

	/** Treat as a Promise and resolve on first emission.
	 * Can be used with async/await
	 * @returns Promise
	 */
	then<R>(nextFn: (data: T) => R): Promise<R> {
		return firstValueFrom(this).then(nextFn);
	}

	/**
	 * Reply to an invoke call.
	 * @param handler Function to handle incoming data and send responses.
	 * @returns Subscription to manage the reply handler.
	 */
	reply(): Subscription {
		// TODO: any remote chance of memory leaks here?
		const subscription = this.subscribe(this.origin);

		// TODO: should we return this, instead?
		return subscription;
	}

	/**
	 * Invoke method: Sends a request and returns an Observable of responses.
	 * Supports multiple responses per request.
	 * @param payload The data to send.
	 * @returns Observable emitting the responses.
	 */
	invoke(payload: T): Observable<R> {
		setTimeout(() => this.next(payload), 0); // Emit async
		return this.origin;
	}

	chain(initial: T): DuplexStream<T, R> {
		const that = this;

		const retval = (this.observers as DuplexStream<any, any>[]).reduce((a, b, i) => {
			const s = new DuplexStream();

			const nxt = s.pipe(
				switchMap(x => {
					return s.origin;
				}),
			);

			const oldNext = b.destination._next;
			b.destination._next = data => {
				oldNext(data);
			}
			// s.origin.subscribe(x=>console.log('s.ORIGIN', i, x));

			s.next(initial);
			return nxt;
		}, new DuplexStream(of(initial)));

		retval.subscribe(x=>console.log('RETV', x));

		return retval;
	}

	/**
	 * Override the pipe method to return a new Duplex with piped send.
	 * @param operations RxJS operators to apply.
	 * @returns A new Duplex instance with applied operators.
	 */
	pipe(): DuplexStream<T, R>;
	pipe<A>(op1: OperatorFunction<T, A>): DuplexStream<A, R>;
	pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): DuplexStream<B, R>;
	pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): DuplexStream<C, R>;
	pipe<A, B, C, D>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): DuplexStream<D, R>;
	pipe<A, B, C, D, E>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>): DuplexStream<E, R>;
	pipe<A, B, C, D, E, F>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>): DuplexStream<F, R>;
	pipe<A, B, C, D, E, F, G>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>): DuplexStream<G, R>;
	pipe<A, B, C, D, E, F, G, H>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>): DuplexStream<H, R>;
	pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>): DuplexStream<I, R>;
	pipe(
		op1?: UnaryFunction<any, any>,
		op2?: UnaryFunction<any, any>,
		op3?: UnaryFunction<any, any>,
		op4?: UnaryFunction<any, any>,
		op5?: UnaryFunction<any, any>,
		op6?: UnaryFunction<any, any>,
		op7?: UnaryFunction<any, any>,
		op8?: UnaryFunction<any, any>,
		op9?: UnaryFunction<any, any>,
	): DuplexStream<any, R> {
		const operations = [op1, op2, op3, op4, op5, op6, op7, op8, op9].filter((op): op is UnaryFunction<any, any> => Boolean(op));
		const pipe = ReplaySubject.prototype.pipe as (...ops: UnaryFunction<any, any>[]) => Observable<unknown>;
		const p = pipe.call(this, ...operations) as DuplexStream<any, R>;
		p.reply = this.reply
		p.origin = this.origin
		p.invoke = this.invoke;
		return p;
	}
};
