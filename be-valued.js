import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeValued {
    #eventControllers = [];
    async onOn(pp) {
        const { on, proxy } = pp;
        this.disconnect();
        for (const type of on) {
            const ec = new AbortController();
            proxy.addEventListener(type, async (e) => {
                await this.handleChange(pp, e.target);
            }, {
                signal: ec.signal,
            });
            this.#eventControllers.push(ec);
        }
    }
    async handleChange({ self, props, proxy }, target) {
        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
        for (const prop of props) {
            const val = target[prop];
            const attr = camelToLisp(prop);
            switch (typeof val) {
                case 'boolean':
                    if (val) {
                        target.setAttribute(attr, '');
                    }
                    else {
                        target.removeAttribute(attr);
                    }
                    break;
                case 'string':
                    target.setAttribute(attr, val);
                    break;
                default:
                    throw 'NI'; //not implemented
            }
        }
    }
    disconnect() {
        for (const ec of this.#eventControllers) {
            ec.abort();
            this.#eventControllers = [];
        }
    }
    finale(proxy, target, beDecorProps) {
        this.disconnect();
    }
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
            virtualProps: ['on', 'props'],
            proxyPropDefaults: {
                on: ['input'],
                props: ['value']
            },
            finale: 'finale',
        },
        actions: {
            onOn: 'on',
        }
    },
    complexPropDefaults: {
        controller: BeValued,
    }
});
register(ifWantsToBe, upgrade, tagName);
