import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeValued {
}
const tagName = 'be-valued';
const ifWantsToBe = 'valued';
const upgrade = 'form';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe
        }
    },
    complexPropDefaults: {
        controller: BeValued,
    }
});
register(ifWantsToBe, upgrade, tagName);
