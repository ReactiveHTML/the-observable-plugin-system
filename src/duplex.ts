import { Observable, OperatorFunction, ReplaySubject, Subject, Subscription, firstValueFrom, from, map, of, switchMap, tap } from 'rxjs';

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
	reply(handler: (data: T) => R | Observable<R>): Subscription {
		const stream = handler ? this.pipe(map(handler)) : this

		// TODO: any remote chance of memory leaks here?
		const subscription = stream.subscribe(this.origin);

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

		this.id=Math.random();

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
			s.origin.subscribe(x=>console.log('s.ORIGIN', i, x));

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
	pipe(...operations: OperatorFunction<any, any>[]): DuplexStream<T, R> {
		const p = super.pipe(...operations) as DuplexStream<T, R>;
		p.reply = this.reply
		p.origin = this.origin
		p.invoke = this.invoke;
		return p;
	}
};
