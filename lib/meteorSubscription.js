import {changed, ready as ducksReady} from '@thx/ducks';
import debug from 'debug';
import {getMeteorMiddlwareConfig} from './config';
import {setHandle, getHandle, setComputation, getComputation, removeComputation, removeHandle} from './subscriptionStore';

const d = debug('app:redux:middleware:subscription');

// import {newErrorBannerMessage} from 'addons/bannerMessage';

/* This middleware is used for Meteor subscriptions. It'll handle actions
 * containing a meteor object such as:
 *
 * const MY_SUBSCRIPTION = 'MY_SUBSCRIPTION';
 *
 * export function myAction (param1, param2) {
 *    return dispatch => {
 *      dispatch(myOnLoadingAction());
 *
 *      return {
 *        type: MY_SUBSCRIPTION,
 *        meteor: {
 *          subscribe: () => Meteor.subscribe('mysubscription', param1, param2),
 *          get: () => MyCollection.find(),
 *        }
 *      }
 *    }
 * }
 *
 * If you dispatch the same action more than one time with the same type, it will
 * stop and reload the subscription.
 *
 * It will dispatch a 'MY_SUBSCRIPTION_READY' action whenever the subscription.ready recompute.
 * The action will have a 'ready' property.
 *
 * It will dispatch a 'MY_SUBSCRIPTION_CHANGED' action when the subscription data change.
 * The action will have a 'data' property containing whatever your 'get' function returns.
 */

export default store => next => action => {
	if (!action.meteor || !(action.meteor.subscribe && action.meteor.get)) {
		return next(action);
	}

	const {subscribe, get, onChange} = action.meteor;
	const {Tracker} = getMeteorMiddlwareConfig();

	// If we already have a handle for this action
	if (getHandle(action.type)) {
		d(`Already have handle for action: ${action.type}. Stopping computations and handles.`);
		const subscriptionId = getHandle(action.type).subscriptionId;
		getComputation(subscriptionId).stop();
		getHandle(action.type).stop();
		removeComputation(subscriptionId);
		removeHandle(action.type);
		if (process.env.NODE_ENV !== 'production') {
			store.dispatch({
				type: 'SUBSCRIPTION_REMOVED',
				id: subscriptionId,
				actionType: action.type,
			});
		}
	}

	const handle = subscribe({
		onStop(/* err */) {
			// if (err) {
			// 	store.dispatch(newErrorBannerMessage(err.message));
			// }
		},
	});
	const subscriptionId = handle.subscriptionId;
	setHandle(action.type, handle);

	d(`Subscribed. Handle: ${action.type}`);

	setComputation(subscriptionId, Tracker.autorun(() => {
		const ready = handle.ready();
		d(`Autorun running for: ${action.type} ${handle.subscriptionId}. Ready: ${ready}`);

		// Keep track of subscriptions during debug
		if (process.env.NODE_ENV !== 'production' && Tracker.currentComputation.firstRun) {
			store.dispatch({
				type: 'SUBSCRIPTION_ADDED',
				id: subscriptionId,
				actionType: action.type,
			});
		}

		if (ready) {
			d(`Subscription ${action.type} ${handle.subscriptionId} is ready, getting data...`);
			const data = get();

			if (onChange) {
				onChange(data);
			}

			store.dispatch({
				type: changed(action.type),
				data,
			});
		}

		store.dispatch({
			type: ducksReady(action.type),
			ready,
		});
	}));

	return null;
};
