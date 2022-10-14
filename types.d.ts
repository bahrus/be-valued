import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps {
    on?: string[],
    props?: string[],
}
export interface VirtualProps extends EndUserProps, MinimalProxy{
}

export type Proxy = HTMLFormElement & VirtualProps;



export interface ProxyProps extends VirtualProps{
    proxy: Proxy,
}

export type PP = ProxyProps;

export interface BeValuedActions{
    onOn(self: PP): Promise<void>;
    finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;
}