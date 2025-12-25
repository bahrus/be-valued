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
    #initialValues = new WeakMap();

    #disconnect(){
        this.#ac.abort();
        this.#ac = new AbortController();
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async hydrate(self){
        this.#disconnect();
        const {enhancedElement, on, props} = self;
        const {camelToKebab} = await import('mount-observer/refid/camelToKebab.js');
        
        // Store initial values of all form controls
        if(enhancedElement instanceof HTMLFormElement){
            const controls = enhancedElement.elements;
            for(const control of controls){
                if(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement){
                    const initialValue = control.value;
                    this.#initialValues.set(control, {
                        value: initialValue,
                        props: new Map(props.map(prop => [prop, control.getAttribute(camelToKebab(prop))]))
                    });
                }
            }
        }
        
        for(const e of on){
            enhancedElement.addEventListener(e, this, {signal: this.#ac.signal});
        }
        
        // Listen for reset events to restore initial values
        if(enhancedElement instanceof HTMLFormElement){
            enhancedElement.addEventListener('reset', this, {signal: this.#ac.signal});
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
        
        // Handle reset event
        if(e.type === 'reset'){
            const {camelToKebab} = await import('mount-observer/refid/camelToKebab.js');
            const controls = enhancedElement.elements;
            for(const control of controls){
                const initialData = this.#initialValues.get(control);
                if(initialData){
                    control.value = initialData.value;
                    // Restore initial attributes
                    initialData.props.forEach((attrValue, prop) => {
                        const attr = camelToKebab(prop);
                        if(attrValue === null){
                            control.removeAttribute(attr);
                        }else{
                            control.setAttribute(attr, attrValue);
                        }
                    });
                }
            }
            return;
        }
        
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