import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import { def } from '../../trans-render/lib/def';
import {BeValuedActions, BeValuedVirtualProps, BeValuedProps} from './types';

export class BeValued implements BeValuedActions{
    #eventControllers: AbortController[] = [];
    async onOn({on, proxy}: this): Promise<void> {
        this.disconnect();
        for(const type of on){
            const ec = new AbortController();
            proxy.addEventListener(type, this.handleChange, {
                signal: ec.signal,
            });
            this.#eventControllers.push(ec);
        }
    }

    handleChange = async (e: Event) => {
        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
        const {props, proxy} = this;
        const target = e.target as HTMLElement;
        for(const prop of props){
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

    disconnect(){
        for(const ec of this.#eventControllers){
            ec.abort();
            this.#eventControllers = [];
        }
    }

    finale(proxy: Element & BeValuedVirtualProps, target: Element, beDecorProps: BeDecoratedProps<any, any>): void {
        this.disconnect();
    }
}

export interface BeValued extends BeValuedProps{}

const tagName = 'be-valued';
const ifWantsToBe = 'valued';
const upgrade = 'form';

define<BeValuedProps & BeDecoratedProps<BeValuedProps, BeValuedActions>, BeValuedActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            virtualProps: ['on', 'props'],
            proxyPropDefaults:{
                on: ['input'],
                props: ['value']
            },
            finale: 'finale',
            actions: {
                onOn: 'on',
            }
        }
    },
    complexPropDefaults:{
        controller: BeValued,
    }
});

register(ifWantsToBe, upgrade, tagName);