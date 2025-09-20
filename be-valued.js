// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE, propDefaults } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/be-valued/types' */;

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 */
class BeValued extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement>}
     */
    static config = {
        positractions: [resolved, rejected],
        propInfo: {
            ...propInfo,
            on: {
                def: ['input'],
            },
            props: {
                def: ['value'], 
            }
        },
        compacts:{
            when_on_changes_call_hydrate: 0,
        }
    }

    de = de;

    #ac = new AbortController();

    #disconnect(){
        this.#ac.abort();
        this.#ac = new AbortController();
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    hydrate(self){
        this.#disconnect();
        const {enhancedElement, on} = self;
        for(const e of on){
            enhancedElement.addEventListener(e, this, {signal: this.#ac.signal});
        }
        return /** @type {PAP} */ ({
            resolved: true,
        });
    }

    /**
     * 
     * @param {Event} e 
     */
    async handleEvent(e){
        const self = /** @type {BAP} */(/** @type {any} */ (this));
        const {enhancedElement, props} = self;
        const {target} = e;
        if(!(target instanceof Element)) return;
        const {camelToKebab} = await import('mount-observer/refid/camelToKebab.js');
        for(const prop of props){
            const val = /** @type {any} */(target)[prop];
            const attr = camelToKebab(prop);
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
}

await BeValued.bootUp();
export { BeValued };