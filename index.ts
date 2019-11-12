import { useEffectOnce, useUpdate } from 'react-use';
import { useCallback } from 'react';

function createUpdater() {
    const listeners = new Set<VoidFunction>();
    const updateComponents = () => listeners.forEach(fn => fn());
    const updateEffect = (update) => {
        listeners.add(update);
        return () => {
            listeners.delete(update);
        };
    };
    return {updateComponents, updateEffect};
}
const updateSymbol = Symbol('update');
interface Observable {
    [updateSymbol]: ReturnType<typeof createUpdater>;
}

//#region function mode
export function createObservable<T extends object>(fn: (update: VoidFunction) => T) {
    const updater = createUpdater();
    const store = fn(updater.updateComponents);
    store[updateSymbol] = updater;
    return store as T;
}
//#endregion

//#region class mode
export const observable: ClassDecorator = (constructor) => {
    return class extends (constructor as any) {
        [updateSymbol] = createUpdater();
    } as any;
};

export const action: MethodDecorator = (target, propertyKey, descriptor) => {
    const func = target[propertyKey];
    descriptor.value = function(...args) {
        func.call(this, ...args);
        (this as Observable)[updateSymbol].updateComponents();
    } as any
};

export function useObserver<T extends object>(object: T) {
    const update = useUpdate();
    useEffectOnce(() => (object as Observable)[updateSymbol].updateEffect(update));
    return object;
}
//#endregion
