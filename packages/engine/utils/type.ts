import type { Endpoint } from '@walless/core';

export interface NetworkContext<T> {
	endpoint: Endpoint;
	connection: T;
}

export type RunnerContext<T> = NetworkContext<T> & {
	endpoint: Endpoint;
	connection: T;
};

export type EngineRunner<T> = {
	stop: (context: RunnerContext<T>) => Promise<void>;
	start: (context: RunnerContext<T>) => Promise<void>;
};

export type EngineCrawler<T> = {
	pool: ConnectionPool<T>;
	connection: T;
	getEndpoint: () => Endpoint;
	setEndpoint: (id: Endpoint) => void;
	start: () => void;
	stop: () => void;
};

export type ConnectionCreator<T> = (id: string) => T;

export type ConnectionPool<T> = {
	create: ConnectionCreator<T>;
	get: (id: string) => T;
};
