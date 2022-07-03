import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {register} from 'be-hive/register.js';
import {BeValuedActions, BeValuedVirtualProps, BeValuedProps} from './types';

export class BeValued implements BeValuedActions{

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
            ifWantsToBe
        }
    },
    complexPropDefaults:{
        controller: BeValued,
    }
});

register(ifWantsToBe, upgrade, tagName);