import {List} from 'immutable';

const initialState = new List();

export default (state = initialState, action) => {
	const {type, id, actionType} = action;
	const typeId = `${id}-${actionType}`;

	switch (type) {
		case 'SUBSCRIPTION_ADDED':
			return state.push(typeId);

		case 'SUBSCRIPTION_REMOVED':
			return state.takeWhile(v => v !== typeId);

		default:
			return state;
	}
};
