// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-valued/types' */;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-valued',
    branches: ['', 'on', 'props'],
    map: {
        '0.0': {
            instanceOf: 'Object',
            mapsTo: '.',
        },
        '1.0': {
            instanceOf: 'StringOrStrings',
            mapsTo: 'on',
            valIfFalsy: ['input'],
        },
        '2.0': {
            instanceOf: 'StringOrStrings',
            mapsTo: 'props',
            valIfFalsy: ['value'],
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
