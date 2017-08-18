export function meteorInsert(addNotification) {
	return () => next => action => {
		if (!action.meteor || !action.meteor.insert) {
			return next(action);
		}

		const {collection, entity, noNotify} = action.meteor.insert;

		collection.insert(entity, error => {
			if (noNotify) return;
			if (error) {
				if (addNotification) {
					addNotification({
						level: 'error',
						title: 'Error',
						message: error,
					});
				}
				return;
			}
			if (addNotification) {
				addNotification({
					level: 'success',
					title: 'Saved',
					autoDismiss: 3,
					dismissible: false,
				});
			}
		});
		return null;
	};
}

export function meteorUpdate(addNotification) {
	return () => next => action => {
		if (!action.meteor || !action.meteor.update) {
			return next(action);
		}

		const {collection, modifiers, id, options, noNotify} = action.meteor.update;

		collection.update(id, modifiers, options, error => {
			if (noNotify) return;
			if (error) {
				if (addNotification) {
					addNotification({
						level: 'error',
						title: 'Error',
						message: error.message,
					});
				}
				return;
			}
			if (addNotification) {
				addNotification({
					level: 'success',
					title: 'Saved',
					autoDismiss: 3,
					dismissible: false,
				});
			}
		});
		return null;
	};
}

export function meteorRemove(addNotification) {
	return () => next => action => {
		if (!action.meteor || !action.meteor.remove) {
			return next(action);
		}

		const {collection, id, noNotify} = action.meteor.remove;

		collection.remove(id, error => {
			if (noNotify) return;
			if (error) {
				if (addNotification) {
					addNotification({
						level: 'error',
						title: 'Error',
						message: error,
					});
				}
				return;
			}
			if (addNotification) {
				addNotification({
					level: 'success',
					title: 'Saved',
					autoDismiss: 3,
					dismissible: false,
				});
			}
		});
		return null;
	};
}
