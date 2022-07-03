import {BeDecoratedProps} from 'be-decorated/types';

export interface BeValuedVirtualProps{

}

export interface BeValuedProps extends BeValuedVirtualProps{
    proxy: HTMLFormElement & BeValuedVirtualProps,
}

export interface BeValuedActions{

}