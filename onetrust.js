async function fetchDestinationForWriteKey(writeKey) {

    var res = await window.fetch(
      `https://cdn.segment.com/v1/projects/${writeKey}/integrations`
    );

    const destinations = await res.json();

    for (const destination of destinations) {
      destination.id = destination.creationName;
      delete destination.creationName;
    }

    return destinations;
}

fetchDestinationForWriteKey('ReFiwPrbWdGBhNpcBOHMN5F42SxoIXT5').then((enabledIntegrations)=>{ 

    const oneTrustGroupIds = oneTrustUtil.getConsentGroupIds();
    
    const consentedIntegrations = await getConsentedIntegrations(
      enabledIntegrations,
      oneTrustGroupIds
    );    

    console.log(enabledIntegrations);
    console.log(consentedIntegrations);
});  


const oneTrustUtil = {
  getConsentGroupIds() {
    const groupIds = (window.OnetrustActiveGroups
      ? window.OnetrustActiveGroups.split(',')
      : []
    ).filter(a => a);
    return groupIds;
  },
};

const ONE_TRUST_SEGMENT_MAPPING = {
  /* Strictly Necessary Cookies */
  C0001: null, // These do not map to any categories in segment.
  /* Performance Cookies */
  C0002: 'Analytics',
  /* Functional Cookies*/
  C0003: 'A/B Testing',
  /* Targeting Cookies */
  C0004: null, // Not mapped currently.
  /* Social Media Cookies */
  C0005: null, // Not mapped currently.
  /* Custom Cookie Category */
  C006: null, // Not mapped currently.
};

async function getConsentedIntegrations(enabledIntegrations, oneTrustGroupIds) {
  // Get consented segment categories.
  const segmentCategories = oneTrustGroupIds
    .map(oneTrustGroupId => ONE_TRUST_SEGMENT_MAPPING[oneTrustGroupId])
    .filter(segmentCategory => segmentCategory); // Filter out `null` mappings.

  // Filter enabled integrations by consented segment categories.
  const consentedIntegrations = enabledIntegrations.filter(
    enabledIntegration => {
      const isConsented = segmentCategories.includes(
        enabledIntegration.category
      );
      return isConsented;
    }
  );
  return consentedIntegrations;
}
