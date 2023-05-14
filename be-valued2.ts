import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';

export class BeValued extends BE<AP, Actions> implements Actions{
    static  override get beConfig(){
        return {
            parse: true,
        } as BEConfig
    }

    #eventControllers: AbortController[] = [];
    async onOn(self: this) {
        const {enhancedElement, on} = self;
        this.#disconnect();
        for(const type of on!){
            const ec = new AbortController();
            enhancedElement.addEventListener(type, async e => {
                await this.handleChange(self, e.target as HTMLInputElement);
            }, {
                signal: ec.signal,
            });
            this.#eventControllers.push(ec);
        }
    }

    async handleChange(self: this, target: HTMLInputElement){
        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
        const {enhancedElement, props} = self;
        for(const prop of props!){
            const val = (<any>target)[prop];
            const attr = camelToLisp(prop);
            switch(typeof val){
                case 'boolean':
                    if(val) {
                        target.setAttribute(attr, '');
                    }else{
                        target.removeAttribute(attr);
                    }
                    break;
                case 'string':
                    target.setAttribute(attr, val);
                    break;
                default:
                    throw 'NI';//not implemented
            }
        }
    }

    #disconnect(){
        for(const ec of this.#eventControllers){
            ec.abort();
            this.#eventControllers = [];
        }
    }

    override detach(detachedElement: Element): void {
        this.#disconnect();
    }
}

export interface BeValued extends AllProps{}

const tagName = 'be-valued';
const ifWantsToBe = 'valued';
const upgrade = 'form';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        propDefaults: {
            ...propDefaults,
            on: ['input'],
            props: ['value']
        },
        propInfo: {
            ...propInfo
        },
        actions: {
            onOn: 'on',
        }
    },
    superclass: BeValued
});

register(ifWantsToBe, upgrade, tagName);

