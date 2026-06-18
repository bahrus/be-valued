//@ts-check

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps, Actions} from './types/be-valued/types' */
/** @import {RAConfig} from './types/roundabout/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions> >}
 */
export const emc = {
    enhConfig: {
        enhKey: 'BeValued',
        spawn: 'be-valued/be-valued.js',
        withAttrs: {
            base: 'be-valued',
            on: '${base}-on',
            _on: {
                instanceOf: 'Array',
                valIfNull: ['input']
            },
            props: '${base}-props',
            _props: {
                instanceOf: 'Array',
                valIfNull: ['value']
            }
        }
    },
    customData: {
        weakRef: {
            properties: ['enhancedElement']
        },
        actions: {
            hydrate: {
                ifAllOf: ['on', 'enhancedElement', 'props']
            }
        },
        defaultPropVals: {
            on: ['input'],
            props: ['value']
        }
    }
}

export function render(){
    return JSON.stringify(emc, null, 4);
}

console.log(render());
