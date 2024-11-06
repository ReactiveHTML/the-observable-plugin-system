import { Duplex } from './src/duplex';
import { log } from './src/lib/rx-log';
import { invoke } from './src/lib/invoke';
import { Subject, map, scan, of, delay } from 'rxjs';

// Create a Duplex instance for numerical operations
//const numDuplex = new Duplex<number, string>();

// // Pipeline 1: Increment and reply synchronously
// numDuplex.pipe(
//     //map(x => x+1),
//     scan(x=>x+1)
// ).reply(x => `Incremented: ${x}`);
// 
// // Pipeline 2: Double and reply asynchronously
// numDuplex.pipe(
//     map(x => x * 2)
// ).reply(x => of(`Doubled: ${x}`).pipe(delay(100)));
// 
// // Invoke with a payload of 5
// numDuplex
// .pipe(
// 	map(() => 1)
// )
// .invoke(5)
// .subscribe(
//     x => console.log(">>>", x)
// );

const fn1= () => {
	const src = new Subject<number>();
	src.name = 'src';

	let plugin = new Duplex<number, string>().pipe(
		map(x=>x.concat('plugin')),
	).reply(x=>x.concat('replymap'));

	src.pipe(
		map(x=>x.concat('map1')),
		invoke(plugin),
	).subscribe(
		x => console.log("RESULT1", x)
	);

	src.next(['start']);
};

const fn2 = () => {
	const src = new Subject<number>();
	src.name = 'src';

	let plugin = new Duplex<number, string>()
	plugin.name = 'plugin'

	const piped = plugin.pipe(
		map(x=>x.concat('plugin')),
	);
	piped.name = 'piped';

	piped.reply(x=>x.concat('replymap'));

	src.pipe(
		map(x=>x.concat('map1')),
		invoke(plugin),
	).subscribe(
		x => console.log("RESULT2", x)
	);

	src.next(['start']);
};

const fn3 = () => {
	const src = new Subject<number>();
	src.name = 'src';

	let plugin = new Duplex<number, string>()

	plugin.pipe(
		map(x=>x.concat('plugin')),
	).reply(x=>x.concat('replymap1'));

	plugin.reply(x=>x.concat('replymap2'));

	src.pipe(
		map(x=>x.concat('map1')),
		invoke(plugin),
	).subscribe(
		x => console.log("RESULT3", x)
	);

	src.next(['start']);
};

fn1();
fn2();
fn3();

