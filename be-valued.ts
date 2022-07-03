import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {BeValuedActions, BeValuedVirtualProps, BeValuedProps} from './types';

export class BeValued implements BeValuedActions{
    #eventControllers: AbortController[] = [];
    async onOn({on, proxy}: this): Promise<void> {
        for(const ec of this.#eventControllers){
            ec.abort();
            this.#eventControllers = [];
        }
        for(const type of on){
            const ec = new AbortController();
            proxy.addEventListener(type, this.handleChange, {
                signal: ec.signal,
            });
            this.#eventControllers.push(ec);
        }
    }

    handleChange = (e: Event) => {

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
            proxyPropDefaults:{
                on: ['input'],
                props: ['value']
            }
        }
    },
    complexPropDefaults:{
        controller: BeValued,
    }
});

register(ifWantsToBe, upgrade, tagName);