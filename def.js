import 'assign-gingerly/object-extension.js';

/**
 * Registers be-valued's config with the element registry, so the enhancement
 * can be attached programmatically (via `el.enh.set.beValued` or
 * `el.enh.get(emc)`), without any attribute.
 * @param {Element | undefined} ref - document.body, or a shadow root's host, for a scoped registry
 */
export async function defBeValued(ref){
    const {default: emc} = await import('./emc.json', {with: {type: 'json'}});
    return await push(ref, emc);
}

async function push(ref, emc){
    const {BeValued} = await import('./be-valued.js');
    const {enhConfig} = emc;
    enhConfig.spawn = BeValued;
    enhConfig.customData = emc.customData; // the registry only stores enhConfig, not the full emc
    const registry = ref?.customElementRegistry ?? customElements;
    const {enhancementRegistry} = registry;
    enhancementRegistry.push(enhConfig);
    return enhConfig;
}
