import {fromJS} from 'immutable';
import {changed, ready as ducksReady} from '@thx/ducks';
import {getMeteorMiddlwareConfig} from './config';

export default store => next => action => {
	if (!action.meteor || !(action.meteor.subscribe && action.meteor.findOne)) {
		return next(action);
	}

	const {subscribe, findOne, immutable} = action.meteor;

	const handle = subscribe({
		onStop(/* err */) {
			// if (err) {
			// 	store.dispatch(newErrorBannerMessage(err.message));
			// }
		},
	});

	const {Tracker} = getMeteorMiddlwareConfig();

	Tracker.autorun(computation => {
		const ready = handle.ready();
		if (ready) {
			const data = (immutable) ? fromJS(findOne()) : findOne();
			computation.stop();
			handle.stop();
			store.dispatch({
				type: changed(action.type),
				data,
			});
		}
		store.dispatch({
			type: ducksReady(action.type),
			ready,
		});
	});

	return null;
};
