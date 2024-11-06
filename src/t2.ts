import type { Observable, Subject } from 'rxjs';

export type ModuleConfig = unknown;
export type PluginConfig = (Record<PluginName, ModuleConfig> | Record<string, unknown> | string | number | boolean);

export type Topic = string & { _Topic: never; };
export type Channel<T> = Subject<T> & { Topic: never; };
export type ReturnChannel<T> = Observable<T> & { Topic: never; };
/**
 * A record of messagebus channels used or exported by a plugin
 */
export type MessagebusChannelRecord = Record<string, any>;

/**
 * A proxy to the messagebus, where each key is a Channel
 */
// export type Messagebus<T extends MessagebusChannelRecord> = {
//     [P in keyof T]: Channel<T[P]>;
// };
// export interface Messagebus<T extends MessagebusChannelRecord> {
//     [P: string]: Channel<MessagebusChannelRecord[keyof T]>;
// }

export interface Messagebus<T extends MessagebusChannelRecord> {
    [key: string]: Channel<T[keyof T]>;
}

export type PluginName = string;

export type PluginBody<I extends MessagebusChannelRecord, O extends MessagebusChannelRecord> = (messagebus: Messagebus<I>, config?: PluginConfig) => Partial<Messagebus<O>> | void;
// export type AbstractPluginModule = Record<string, PluginBody<any, any>;
export type PluginModule<Protocol> = (plugins: Protocol, config?: PluginConfig) => Protocol | void;
// export type PluginModule<T> = (channels: Record<string, Channel<T>>, config?: PluginConfig) => void;

export type PluginManifest<Protocol> = Record<string, PluginModule<Protocol>>;
