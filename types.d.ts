import {BeDecoratedProps} from 'be-decorated/types';

export interface BeValuedVirtualProps{
    on: string[],
    props: string[],
}

export interface BeValuedProps extends BeValuedVirtualProps{
    proxy: HTMLFormElement & BeValuedVirtualProps,
}

export interface BeValuedActions{
    onOn(self: this): Promise<void>;
    finale(proxy: Element & BeValuedVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
}