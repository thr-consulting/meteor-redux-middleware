import {unsubscribed, ready} from '@thx/ducks';
import {setHandle, getHandle, setComputation, getComputation} from './subscriptionStore';

export default store => next => action => {
	if (!action.meteor || !action.meteor.unsubscribe) {
		return next(action);
	}

	if (getHandle(action.type)) {
		const subscriptionId = getHandle(action.type).subscriptionId;
		getComputation(subscriptionId).stop();
		getHandle(action.type).stop();
		setHandle(action.type, null);
		setComputation(subscriptionId, null);

		store.dispatch({
			type: ready(action.type),
			ready: false,
		});
		store.dispatch({
			type: unsubscribed(action.type),
		});

		// Keep track of subscriptions during debug
		if (process.env.NODE_ENV !== 'production') {
			store.dispatch({
				type: 'SUBSCRIPTION_REMOVED',
				id: subscriptionId,
				actionType: action.type,
			});
		}
	}

	return null;
};
