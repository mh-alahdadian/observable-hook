import { useEffectOnce, useUpdate } from 'react-use';
import { useCallback } from 'react';

export default function createObservable<T extends object>(fn: (update: VoidFunction) => T) {
    const listeners = new Set<VoidFunction>();
    const updateComponents = () => listeners.forEach(fn => fn());

    const store = fn(updateComponents);

    function useStore() {
        const update = useUpdate();
        useEffectOnce(() => {
            listeners.add(update);

            return () => {
                listeners.delete(update);
            };
        });
        return store;
    }

    return [store, useStore] as const;
}
