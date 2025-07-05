import { Observable, OperatorFunction, Subject, Subscription,from, map, of, switchMap, tap } from 'rxjs';

export class DuplexStream<T, R=T> extends Subject<T> {
	origin: Subject<R>;

	constructor(source?: Subject<R>) {
		super();
		this.origin = source ?? new Subject<R>();
	}

	/**
	 * Reply to an invoke call.
	 * @param handler Function to handle incoming data and send responses.
	 * @returns Subscription to manage the reply handler.
	 */
	reply(handler: (data: T) => R | Observable<R>): Subscription {
		const stream = handler ? this.pipe(map(handler)) : this
		const subscription = stream.subscribe(this.origin);
		return subscription;
	}

	/**
	 * Invoke method: Sends a request and returns an Observable for the responses.
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
