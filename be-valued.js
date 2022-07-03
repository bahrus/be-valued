import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeValued {
    #eventControllers = [];
    async onOn({ on, proxy }) {
        for (const ec of this.#eventControllers) {
            ec.abort();
            this.#eventControllers = [];
        }
        for (const type of on) {
            const ec = new AbortController();
            proxy.addEventListener(type, this.handleChange, {
                signal: ec.signal,
            });
            this.#eventControllers.push(ec);
        }
    }
    handleChange = (e) => {
    };
}
const tagName = 'be-valued';
const ifWantsToBe = 'valued';
const upgrade = 'form';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            proxyPropDefaults: {
                on: ['input'],
                props: ['value']
            }
        }
    },
    complexPropDefaults: {
        controller: BeValued,
    }
});
register(ifWantsToBe, upgrade, tagName);
