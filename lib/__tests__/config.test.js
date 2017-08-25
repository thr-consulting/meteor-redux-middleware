import {setMeteorMiddlewareConfig, getMeteorMiddlwareConfig} from '../config';

it('should set the config', () => {
	setMeteorMiddlewareConfig({
		Tracker: {},
		Meteor: {},
	});
	expect(getMeteorMiddlwareConfig().Tracker).not.toBeNull();
	expect(getMeteorMiddlwareConfig().Meteor).not.toBeNull();
});
