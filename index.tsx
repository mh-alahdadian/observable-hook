import { useEffectOnce, useUpdate } from 'react-use';
import { useCallback } from 'react';

function createObservable(fn: (update: VoidFunction) => object) {
    const listeners = new Set<VoidFunction>();

    const updateComponents = useCallback(() => {
        listeners.forEach(fn => fn());
    }, []);

    const store = fn(updateComponents);
    const useStore = useCallback(() => {
        const update = useUpdate();
        useEffectOnce(() => {
            listeners.add(update);

            return () => {
                listeners.delete(update);
            };
        });
        return store;
    }, []);

    return [store, useStore] as const;
}
