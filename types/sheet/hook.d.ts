interface WatchOptions {
    waitUntilFirstUpdate?: boolean;
}
export declare function hook(propName: string, options?: WatchOptions): (protoOrDescriptor: any, name: string) => any;
export {};
