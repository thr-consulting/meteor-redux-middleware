const handles = {};
const computations = {};

export function setHandle(actionType, handle) {
	handles[actionType] = handle;
}

export function getHandle(actionType) {
	return handles[actionType];
}

export function removeHandle(actionType) {
	delete handles[actionType];
}

export function setComputation(subscriptionId, computation) {
	computations[subscriptionId] = computation;
}

export function getComputation(subscriptionId) {
	return computations[subscriptionId];
}

export function removeComputation(subscriptionId) {
	delete computations[subscriptionId];
}
