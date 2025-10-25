interface WatchOptions {
    waitUntilFirstUpdate?: boolean;
}
export declare function on(propName: string, options?: WatchOptions): (protoOrDescriptor: any, name: string) => any;
export {};
