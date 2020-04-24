async function onRequest(request, settings) {
	// This is the entire payload from Zendesk
	let eventBody = request.json();

	// Grab the event name from the Zendesk ticket
	let event_name = eventBody.event_name;

	// Create and map every Zendesk field we want to keep
	let ticket_title = eventBody.ticket_title;
	let ticket_requester_email = eventBody.ticket_requester_email;
	let ticket_type = eventBody.ticket_type;
	let ticket_status = eventBody.ticket_status;
	let ticket_id = eventBody.ticket_id;
	let ticket_url = eventBody.ticket_url;
	let ticket_channel = eventBody.ticket_channel;
	let ticket_priority = eventBody.ticket_priority;
	let ticket_group_name = eventBody.ticket_group_name;
	let ticket_assignee_name = eventBody.ticket_assignee_name;
	let ticket_requester_external_id = eventBody.ticket_requester_external_id;
	let ticket_tags = eventBody.ticket_tags.split(' ');

	// Create an anonymousIs from the Zendesk email address
	let buff = new Buffer(ticket_requester_email);
	let anonymousId = buff.toString('base64');

	// Fire a Segment track call to indicate record the Zendesk event
	Segment.track({
		event: event_name,
		anonymousId: anonymousId,
		properties: {
			// Append all the Zendesk fields to the properties object in the Segment track call
			ticket_title: ticket_title,
			ticket_requester_email: ticket_requester_email,
			ticket_type: ticket_type,
			ticket_status: ticket_status,
			ticket_id: ticket_id,
			ticket_url: ticket_url,
			ticket_priority: ticket_priority,
			ticket_requester_external_id: ticket_requester_external_id,
			ticket_tags: ticket_tags,
			ticket_channel: ticket_channel,
			ticket_group_name: ticket_group_name,
			ticket_assignee_name: ticket_assignee_name
		}
	});

	// Fire a Segment identify call to indicate record the email address in the user's profile in Segment
	Segment.identify({
		anonymousId: anonymousId,
		traits: {
			email: ticket_requester_email
		}
	});
}
