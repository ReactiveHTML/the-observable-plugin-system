// https://chatgpt.com/c/ce71fe71-7d57-46ae-8dd0-7d379ffe91f6


// There are 4 types of streams:

//	source (only emits data)
//	sink (only consumes)
//	pipe (consumes and re-emits)
//	request-response (responds to the caller)

//	responders may also re-emit (side effects?)


export default ({ NEW_ADS, NEW_SLOTS, AUCTIONS_START, START_AUCTION }, config) => {
	NEW_ADS
		|> map(doSomething)
		|> mergeWith( NEW_SLOTS )
		|> waitUntil( AUCTIONS_START )
		|> respond( )
	;
}


export default ({ NEW_ADS, NEW_SLOTS, AUCTIONS_START, START_AUCTION }, config) => {
	NEW_ADS
		|> map(doSomething)
		|> mergeWith( NEW_SLOTS )
		|> waitUntil( AUCTIONS_START )
		|> sink( START_AUCTION )
	;
}

export default ({ NEW_ADS, CONSENT_PA, START_AUCTION, RENDER_AD }, config) => {
	NEW_ADS
		|> map(transform)
		|> waitUntil( CONSENT_PA )
		|> parallel( START_AUCTION )
		|> flat(#)
		|> scan(winningBid)
		|> sink( RENDER_AD )
	;
}

export default ({ NEW_AD_PLACEHOLDERS, CONSENT_PA, START_AUCTION, RENDER_AD }, config) => {
	NEW_AD_PLACEHOLDERS
		|> waitUntil( CONSENT_PA )
		|> map(createSlot)
		|> parallel( START_AUCTION )
		|> chain( MODIFIERS )
		|> flat(#)
		|> scan(winningBid)
		|> sink( RENDER_AD )
	;
}

export default ({ CHANNEL_1, CHANNEL_2, OTHER_TOPIC, TOPIC_4 }, config) => {
	CHANNEL_1
		|> map(doSomething)
		|> mergeWith( CHANNEL_2 )
		|> waitUntil( OTHER_TOPIC )
		|> sink( TOPIC_4 )
	;
}

export default ({ CHANNEL_1, CHANNEL_2, OTHER_TOPIC, TOPIC_4 }, config) => {
	const process1 = CHANNEL_1
		|> map(doSomething)
		|> mergeWith( CHANNEL_2 )
		|> waitUntil( OTHER_TOPIC )
	;

	messagebus.topics['TOPIC_4'].subscribe(process1);
}



/////////// request-response-streams

export default ({ INIT, TOPIC1 }: Protocol, config) => {
	INIT.pipe(
		log('module1 start'),
		map(n => n+1),
	).subscribe(TOPIC1);

	TOPIC1.pipe(
		map(x=>x+1),
	)
	.emit(TOPIC2)
	.pipe(
		map(x=>x+1),
	)
	.subscribe(() => {
	})


	TOPIC1.pipe(
		map(x=>x+1),
		emit(TOPIC2),
		map(x=>x+1),
	)
	.subscribe(TOPIC4);


	TOPIC1.pipe(
		map(x=>x+1),
	)
	.subscribe(TOPIC2)
	.pipe(
		map(x=>x+1),
	)
	.subscribe(() => {
	})

	TOPIC1.pipe(
		map(x=>x+1),
		reply(),
	)

};
