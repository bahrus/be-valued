// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-valued/types' */;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-valued',
    map: {
        '0.0': {
            instanceOf: 'String',
            mapsTo: 'on',
            valIfFalsy: ['input'],
        }
    },
    enhPropKey: 'beValued',
    importEnh: async () => {
        const { BeValued } = await import('./be-valued.js');
        return BeValued;
    },
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
