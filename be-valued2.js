import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeValued extends BE {
    static get beConfig() {
        return {
            parse: true,
        };
    }
    #eventControllers = [];
    async onOn(self) {
        const { enhancedElement, on } = self;
        this.#disconnect();
        for (const type of on) {
            const ec = new AbortController();
            enhancedElement.addEventListener(type, async (e) => {
                await this.handleChange(self, e.target);
            }, {
                signal: ec.signal,
            });
            this.#eventControllers.push(ec);
        }
    }
    async handleChange(self, target) {
        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
        const { enhancedElement, props } = self;
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
    #disconnect() {
        for (const ec of this.#eventControllers) {
            ec.abort();
            this.#eventControllers = [];
        }
    }
    detach(detachedElement) {
        this.#disconnect();
    }
}
const tagName = 'be-valued';
const ifWantsToBe = 'valued';
const upgrade = 'form';
const xe = new XE({
    config: {
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
