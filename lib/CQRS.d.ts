/// <reference path="node.d.ts" />
/// <reference path="node_redis.d.ts" />
/// <reference path="async.d.ts" />
import Redis = require('redis');
export interface IEnvelope<T> {
    body: T;
    correlationId: string;
    messageId: string;
    TTL?: number;
}
export interface ICommand {
    id: string;
    name: string;
}
export interface ICommandHandler {
    handleCommand(commandToHandle: IEnvelope<ICommand>, callback: (error: any) => void): void;
}
export interface IEvent {
    sourceId: string;
    name: string;
}
export interface IEventHandler {
    handleEvent(eventToHandle: IEnvelope<IEvent>, callback: (error: any) => void): void;
}
export declare class HandlerRegistry implements ICommandHandler, IEventHandler {
    constructor();
    public commandsRegistry: any;
    public eventsRegistry: any;
    public registerCommandHandler(commandName: string, commandHandler: ICommandHandler): void;
    public registerEventHandler(eventName: string, eventHandler: IEventHandler): void;
    public handleCommand(commandToHandle: IEnvelope<ICommand>, callback: (error: any) => void): void;
    public handleEvent(eventToHandle: IEnvelope<IEvent>, callback: (error: any) => void): void;
}
export interface IVersionedEvent extends IEvent {
    version: number;
}
export interface IEventSourced {
    getId(): string;
    getVersion(): number;
    getEvents(): IVersionedEvent[];
}
export declare class EventSourced implements IEventSourced {
    private id;
    private version;
    private events;
    constructor(id: string);
    public getId(): string;
    public getVersion(): number;
    public getEvents(): IVersionedEvent[];
    public loadFromEvents(events: IVersionedEvent[]): void;
    public update(versionedEvent: IVersionedEvent): void;
}
export interface IEventSourcedRepository {
    getEventsByAggregateId(id: string, callback: (error: any, events: IVersionedEvent[]) => void): any;
    saveEventsByAggregateId(id: string, events: IVersionedEvent[], callback: (error: any) => void): any;
}
export declare class InMemoryEventSourcedRepository implements IEventSourcedRepository {
    private db;
    constructor();
    public getEventsByAggregateId(id: string, callback: (error: any, events: IVersionedEvent[]) => void): void;
    public saveEventsByAggregateId(id: string, events: IVersionedEvent[], callback: (error: any) => void): void;
}
export interface IRedisConnectionOptions {
    host: string;
    port: number;
}
export declare class RedisEventSourcedRepository implements IEventSourcedRepository {
    private client;
    constructor(options: any);
    public options: IRedisConnectionOptions;
    public getClient(): Redis.RedisClient;
    public connect(callback: (error: any) => void): void;
    public getEventsByAggregateId(id: string, callback: (error: any, events: IVersionedEvent[]) => void): void;
    public saveEventsByAggregateId(id: string, events: IVersionedEvent[], callback: (error: any) => void): void;
    private constructResultsResponse(error, results, callback);
}
