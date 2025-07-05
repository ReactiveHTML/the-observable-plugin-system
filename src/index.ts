import type { PluginManifest, Messagebus, Channel, PluginConfig, Topic, MessagebusChannelRecord } from './types';
export type { PluginManifest, Messagebus, Channel, PluginConfig, Topic, MessagebusChannelRecord } from './types';

import { DuplexStream } from './duplex';
export { DuplexStream } from './duplex';

export type { PluginName } from './types';
export type { PluginBody } from './types';

export { mockPlug } from './mock';
export { chain } from './operators/chain';
export { emit } from './operators/emit';
export { invoke } from './operators/invoke';
export { log } from './operators/log';
// export { parallel } from './operators/parallel';
export { series } from './operators/series';
export { step } from './operators/step';
export { switchInvoke } from './operators/switch-invoke';

const Messagebus = <Protocol extends MessagebusChannelRecord>() => {
	const state = new Map<string | symbol, DuplexStream<unknown>>();
	return <Messagebus<Protocol>>new Proxy({}, {
		get: (_target, prop: string | symbol) => {
			if(prop == Symbol.iterator) {
				return state.entries.bind(state)
			} else {
				let r = state.get(prop);
				if (!r) {
					r = <Channel<unknown>>new DuplexStream();
					state.set(prop, r);
				}
				return r;
			}
		}
	});
};

/**
 * TOPS: The Observable Plugin System
 * @param modules A manifest of plugins to load
 * @param config
 * @returns 
 */
export default function TOPS<Protocol extends MessagebusChannelRecord>(modules: PluginManifest<Protocol>, config?: PluginConfig, initial: any = ''): Messagebus<Protocol> {
	const messagebus = Messagebus<Protocol>();
	(Object.entries(modules))
		.forEach(([pluginName, pluginManifest]) => {
			const r = pluginManifest(<Protocol>messagebus, config?.[pluginName] ?? config);
			r && Object.entries(r).forEach(([k, v]) => v.subscribe(messagebus[k]));
		});

	messagebus['INIT']
		.invoke(initial)
		//.subscribe(x=>console.log('data returned:', x));
	;

	return messagebus;
}
