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

    console.log(enabledIntegrations);
    
});  
