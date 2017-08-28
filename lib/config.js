import set from 'lodash/set';
import get from 'lodash/get';

function setMeteorMiddlewareConfig({Tracker, Meteor}) {
	set(global, 'thx.meteorReduxMiddleware.config', {
		Tracker,
		Meteor,
	});
}

function getMeteorMiddlwareConfig() {
	return get(global, 'thx.meteorReduxMiddleware.config');
}

export {
	setMeteorMiddlewareConfig,
	getMeteorMiddlwareConfig,
};
