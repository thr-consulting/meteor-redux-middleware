import {setMeteorMiddlewareConfig} from './config';
import {meteorInsert, meteorRemove, meteorUpdate} from './meteorCrud';
import meteorDatasource from './meteorDatasource';
import meteorFindOne from './meteorFindOne';
import meteorMethod from './meteorMethod';
import meteorSubscription from './meteorSubscription';
import meteorUnsubscribe from './meteorUnsubscribe';

function meteorReduxMiddlewares(addNotification) {
	return [
		meteorInsert(addNotification),
		meteorRemove(addNotification),
		meteorUpdate(addNotification),
		meteorMethod(addNotification),
		meteorDatasource,
		meteorFindOne,
		meteorSubscription,
		meteorUnsubscribe,
	];
}

export {
	setMeteorMiddlewareConfig,
	meteorReduxMiddlewares,
	meteorInsert,
	meteorRemove,
	meteorUpdate,
	meteorMethod,
	meteorDatasource,
	meteorFindOne,
	meteorSubscription,
	meteorUnsubscribe,
};
