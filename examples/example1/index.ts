import type { Messagebus, PluginManifest } from '../../src/types';

import TOPS from '../../src/index.ts';
import { map, scan, Subject, tap } from 'rxjs';
import { log } from '../../src/operators/log';
import { rml, AppendHTML } from 'rimmel';

import './style.css';

import plugin1 from './plugin1';
import plugin2 from './plugin2';
import plugin3a from './plugin3a';
import plugin3b from './plugin3b';
import plugin4 from './plugin4';


export type Protocol = Messagebus<{
    INIT: number;
    TOPIC1: number;
    TOPIC2: number;
    TOPIC3: string;
    JOINED: string;
    CALLABLE1: (s: string) => string;
    DOUBLE: (n: number) => number;
    SEQ_ADD: (n: number) => number;
    PARALLEL_TRANSFORM: (n: number) => number[];
}>;

const config = {
    module1:  'module1-config',
    module2:  'module2-config',
    module3a: 'module3-config',
    module3b: 'module3-config',
    module4:  'module4-config',
};

const App = () => {
	const manifest = {
		plugin1,
		plugin2,
		plugin3a,
		plugin3b,
		plugin4,
	} as PluginManifest<Protocol>;

	const messagebus = TOPS<Protocol>(manifest, config, 0);
	const topics = [...messagebus].toSorted((a, b) => a[0]==b[0] ? 0 : a[0]<b[0] ? -1 : 1)

	const t0 = Date.now();
	const tLast = Object.fromEntries(topics.map(([name, topic]) => [name, t0]));

	return rml`
		<h1>TOPS - The Observable Plugin System</h1>
		<table border>
		<tr>${topics.map(([name]) => `<th>${name}</th>`)}</tr>
		<tr>
			${topics.map(([name, topic]) => {
				const topicStream = topic.pipe(
					map(str => `<li title="${str}" style="border-top: 1px dotted; padding-block-start: ${(Date.now() -tLast[name])/5}px;">${str}</li>`),
					tap(() => tLast[name] = Date.now()),
				);
				return rml`
					<td>
						<ol>${AppendHTML(topicStream)}</ol>
					</td>
				`
			})}
		</tr>
		</table>
	`;
}

document.body.innerHTML = App();

