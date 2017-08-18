import debug from 'debug';
import {getMeteorMiddlwareConfig} from './config';

const d = debug('meteor-redux-middleware:method');

export default addNotification => () => next => action => {
	if (!action.meteor || !action.meteor.call) {
		return next(action);
	}

	const {method, parameters, onSuccess, onError, notify} = action.meteor.call;
	const params = parameters || [];

	d(`Calling ${method}...`);

	const {Meteor} = getMeteorMiddlwareConfig();

	Meteor.call(method, ...params, (error, result) => {
		d(`Method returned ${method}`);

		if (error) {
			if (notify && addNotification) {
				addNotification({
					level: 'error',
					title: 'Error',
					message: error.message,
				});
			}
			if (onError) {
				return onError(error);
			}
			return null;
		}

		if (notify && addNotification) {
			addNotification({
				autoDismiss: 3,
				dismissible: false,
				level: 'success',
				title: 'Saved',
			});
		}
		if (onSuccess) {
			return onSuccess(result);
		}

		return null;
	});
	return null;
};
