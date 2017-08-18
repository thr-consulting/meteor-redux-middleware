let config = null;

function setMeteorMiddlewareConfig({Tracker, Meteor}) {
	config = {
		Tracker,
		Meteor,
	};
}

function getMeteorMiddlwareConfig() {
	return config;
}

export {
	setMeteorMiddlewareConfig,
	getMeteorMiddlwareConfig,
};
