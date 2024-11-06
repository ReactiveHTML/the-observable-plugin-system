import { DuplexStream } from './duplex';

export type ModuleConfig = unknown;
export type PluginConfig = (Record<PluginName, ModuleConfig> | Record<string, unknown> | string | number | boolean);

export type Topic = string & { _Topic: never; };
export type Channel<I,O=I> = DuplexStream<I, O>;
// export type Channel<T> = Observable<T> | Observer<T>;
/**
 * A record of messagebus channels used or exported by a plugin
 */
export type MessagebusChannelRecord = Record<string, any>;

/**
 * A proxy to the messagebus, where each key is a Channel
 */
export type Messagebus<T extends MessagebusChannelRecord> = {
    [P in keyof T]: Channel<T[P]>;
};

export type PluginName = string;
export type PluginBody<I extends MessagebusChannelRecord, O extends MessagebusChannelRecord> = (messagebus: Messagebus<I>, config?: PluginConfig) => Partial<Messagebus<O>> | void;
export type AbstractPluginModule = Record<string, PluginBody<any, any>>;
export type PluginModule<T extends AbstractPluginModule> = (plugins: Messagebus<T>, config?: PluginConfig) => Partial<Messagebus<T>> | void;
// export type PluginModule<T> = (channels: Record<string, Channel<T>>, config?: PluginConfig) => void;

// export type PluginManifest<T extends AbstractPluginModule> = Record<string, PluginModule<T>>;
export type PluginManifest<T> = Record<string, PluginModule<any>>;
