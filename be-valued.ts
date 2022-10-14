import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from 'be-hive/register.js';
import {BeValuedActions, VirtualProps, ProxyProps, PP} from './types';

export class BeValued implements BeValuedActions{
    #eventControllers: AbortController[] = [];
    async onOn(pp: PP): Promise<void> {
        const {on, proxy} = pp;
        this.disconnect();
        for(const type of on!){
            const ec = new AbortController();
            proxy.addEventListener(type, async e => {
                await this.handleChange(pp, e.target as HTMLInputElement);
            }, {
                signal: ec.signal,
            });
            this.#eventControllers.push(ec);
        }
    }

    async handleChange({self, props, proxy} : PP, target: HTMLInputElement){
        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
        
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

    disconnect(){
        for(const ec of this.#eventControllers){
            ec.abort();
            this.#eventControllers = [];
        }
    }

    finale(proxy: Element & VirtualProps, target: Element, beDecorProps: BeDecoratedProps<any, any>): void {
        this.disconnect();
    }
}

export interface BeValued extends ProxyProps{}

const tagName = 'be-valued';
const ifWantsToBe = 'valued';
const upgrade = 'form';

define<ProxyProps & BeDecoratedProps<ProxyProps, BeValuedActions>, BeValuedActions>({
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
            
        },
        actions: {
            onOn: 'on',
        }
    },
    complexPropDefaults:{
        controller: BeValued,
    }
});

register(ifWantsToBe, upgrade, tagName);