// @ts-check
/** @import {Actions, PAP, ProPAP, AllProps, AP} from './types/be-valued/types' */;
/** @import {RoundaboutOptions} from './types/roundabout/types' */;
/** @import {ElementEnhancementGateway, SpawnContext} from './types/assign-gingerly/types' */;
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {RAConfig} from './types/roundabout/types' */;

/**
 * @param {string} s
 * @returns {string}
 */
function camelToKebab(s){
    return s.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

/**
 * Programmatic callers may pass a single event / prop name rather than an array.
 * @param {string | string[]} s
 * @returns {string[]}
 */
function toArray(s){
    return typeof s === 'string' ? [s] : s;
}

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 */
class BeValued {

    #ac = new AbortController();
    #initialValues = new WeakMap();

    /**
     * @this {AllProps & Actions}
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {SpawnContext} ctx 
     * @param {PAP} initVals 
     */
    constructor(enhancedElement, ctx, initVals){
        this.init(this, enhancedElement, ctx, initVals);
    }

    /**
     * @param {AllProps} self 
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {SpawnContext} ctx 
     * @param {PAP} initVals 
     */
    async init(self, enhancedElement, ctx, initVals){
        // ctx.emc is only populated when spawned via an attribute (be-hive / mount-observer).
        // Programmatic attachment (enh.get / enh.set) only passes ctx.config -- see def.js.
        const {customData} = /** @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>} */ (ctx.emc || ctx.config);
        /**
         * @type {RoundaboutOptions}
         */
        const raOptions = {
            ...customData,
            vm: self,
            initialPropVals: {
                enhancedElement,
                ...customData?.defaultPropVals,
                ...initVals
            }
        };
        await (await import('roundabout-lib/roundabout.js')).roundabout(raOptions);
        self.initialized = true;
    }

    #disconnect(){
        this.#ac.abort();
        this.#ac = new AbortController();
    }

    /**
     * @param {AP} self 
     * @returns {ProPAP}
     */
    async hydrate(self){
        this.#disconnect();
        const {enhancedElement} = self;
        const on = toArray(self.on);
        const props = toArray(self.props);

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
     * @param {Event} e 
     */
    async handleEvent(e){
        const self = /** @type {AP} */(/** @type {any} */ (this));
        const {enhancedElement} = self;
        const props = toArray(self.props);
        const {target} = e;

        // Handle reset event
        if(e.type === 'reset'){
            const controls = /** @type {HTMLFormElement} */ (enhancedElement).elements;
            for(const control of controls){
                const initialData = this.#initialValues.get(control);
                if(initialData){
                    /** @type {any} */ (control).value = initialData.value;
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

export { BeValued };
