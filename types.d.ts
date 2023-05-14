import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';

export interface EndUserProps extends IBE{
    on?: string[],
    props?: string[],
}

export interface AllProps extends EndUserProps {}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];


export interface Actions{
    onOn(self: this): Promise<void>;
    //finale(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps): void;
}