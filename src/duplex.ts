import { Observable, OperatorFunction, Subject, Subscription,from, map, of, switchMap, tap } from 'rxjs';

export class DuplexStream<T, R=T> extends Subject<T> {
	origin: Subject<R>;

	constructor(source?: Subject<R>) {
		super();
		this.origin = source ?? new Subject<R>();
		// this.origin.name='internalSubject'
	}

	/**
	 * Sets up the reply mechanism.
	 * @param handler Function to handle incoming data and send responses.
	 * @returns Subscription to manage the reply handler.
	 */
	reply(handler: (data: T) => R | Observable<R>): Subscription {
		const stream = handler ? this.pipe(map(handler)) : this
		const subscription = stream.subscribe(this.origin);
		//return this;
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
			// console.log('REDX', b, i);
			const s = new DuplexStream();

			const nxt = s.pipe(
				// switchMap(x => new Duplex(of(b)).invoke(x)),
				switchMap(x => {
					return s.origin;
				}),
				// tap(x=>console.log('>>>>>XXXX', x)),
			);

			//nxt.origin = s.origin;
			//nxt.subscribe(x=>console.log('NXT', i, x));
			//nxt.subscribe();

			const oldNext = b.destination._next;
			b.destination._next = data => {
				// console.log('._next', i, data);
				oldNext(data);
			}
			// setTimeout(()=>b.next(x), 100);
			s.origin.subscribe(x=>console.log('s.ORIGIN', i, x));

			s.next(initial);
			return nxt;
		//});
		}, new DuplexStream(of(initial)));

		retval.subscribe(x=>console.log('RETV', x));
		//this.origin.subscribe(x=>console.log('ORG', x));
		//this.observers[0].next(initial);

		return retval;
		// return this;
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
