<img src="tops-gh.png" alt="The Observable Plugin System" style="text-align: start; max-width: 100%;">

[![npm](https://img.shields.io/npm/v/the-observable-plugin-system.svg)](https://www.npmjs.com/package/the-observable-plugin-system)

# The Observable Plugin System
The first plugin/module manager for stream-oriented web applications

## Motivation
If you have a growing webapp based on RxJS and/or Observables and you want to extend it with plugins, you may have noticed the Observable pattern is not directly compatible with the Request/Response nature of plugin systems.

We are bringing the best of both here, by creating the `Duplex` Observable: a new kind of Observable Subject that supports two-way communication, new methods such as `.invoke()` and `.reply()`, in addition to new operators such as `switchInvoke()` and `emit()`.

Using the above you can define your plugins as pure observable streams.

## Installation
```sh
npm install -S 'the-observable-plugin-system';
```

## Usage
You can create a messabus and initialise your plugins in your main entry point:

**`main.js`**
``` js
import TOPS from 'the-observable-plugin-system';

import module1 from './plugins/module1.js';
import module2 from './plugins/module2.js';

function main() {
	TOPS({
		module1,
		module2,
	});
};

main()
```

Each plugin typically sits in its own file and exports a default function with this signature:
```js
export default async ({ TOPIC1, TOPIC2, TOPIC3 }, config) => {

	TOPIC1.pipe(
		delay(1000),
		map(x => x+1),
		switchInvoke(TOPIC2),
		emit(TOPIC3),
	).reply()

};
```

Plugins can communicate with each-other via a common message bus through a number of topics. Each topic takes the form of an Observable Subject that's available to plugins via their default-exported function.

The example above listens to messages coming from TOPIC1, delays processing by 1s, adds one, emits the result to TOPIC2, all replies to which will be emitted to TOPIC3 and then returned to the original caller who emitted to TOPIC1.

## Duplex Streams and their new operators
The Duplex Stream is a particular type of RxJS Subject that enables two-way communication, essential for the request-response communication pattern used by a message bus and that's not available in regular Observables.

Duplex streams bring two new instance methods: `invoke` and `reply`:

### Duplex::invoke
This emits data into a duplex stream and returns an observable of the responses.
This is a lower-level functionality, mostly used internally by the plugin system. You would most likely use the `invoke` operator instead.
```js
const stream = new Duplex();

stream.invoke(value);
```

### Duplex::reply
This makes it possible for a Duplex stream to return a value to the original emitter by
simply taking values coming from the pipeline and re-emitting them into the caller stream.
```js
const stream = new Duplex().pipe(
    ...operators,
    map(data => asReturnValue(data)),
).reply();
```

## Duplex operators
These are special operators for Duplex streams to help implement various calling patterns

### switchInvoke
Similar to RxJS `switchMap`. It emits the current value from the source stream and returns a new stream of the responses until a new value is received from the source

### mergeInvoke
Similar to RxJS `mergeMap`. It emits the current value from the source stream into the specified topic and re-emits all returned values as they arrive

### emit
A fire-and-forget operator that simply emits the current value into the specified stream and moves on

### chain
WIP

### parallel
WIP

## Unit testing plugins
WIP

## Examples

[A Stream-Oriented Webapp](https://stackblitz.com/edit/tops-demo) where everything is a module, everything is a stream
