import {changed} from '@thx/ducks';
import {getMeteorMiddlwareConfig} from './config';

const changeComputations = [];

/* This middleware is used for Meteor reactive source without subscriptions. It'll handle actions
 * containing a meteor object such as:
 * {
 *    type: MY_ACTION_TYPE,
 *    meteor: {
 *      get: () => Session.get('myKey'),
 *    }
 * }
 *
 * If you dispatch the same action more than one time with the same type, it will
 * stop and reload the computation.
 *
 * It will dispatch an 'MY_ACTION_TYPE_CHANGED' action when the computation data change.
 * The action will have a 'data' property containing whatever your 'get' function returns.
 */
export default store => next => action => {
	if (!action.meteor || action.meteor.subscribe || !action.meteor.get) {
		return next(action);
	}

	const {get, onChange} = action.meteor;

	// If we already have an handle for this action
	if (changeComputations[action.type]) {
		changeComputations[action.type].stop();
	}

	const {Tracker} = getMeteorMiddlwareConfig();

	changeComputations[action.type] = Tracker.autorun(() => {
		const data = get();

		if (onChange) {
			onChange(data);
		}

		store.dispatch({
			type: changed(action.type), data,
		});
	});

	return null;
};
