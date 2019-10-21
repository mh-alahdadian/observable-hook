#observable-hook

this library will let you to make a simple object as store 
makeObservable function is the only function of this component which exports as default this function can be called by a function which will receive updateComponents function and will return the store object
in this function you can set eventListeners and many other things but any function which changes properties of store must call updateComponents function manually to call every observer components to make them selves update

##motivation

### using store as global without needing context
after new ContextAPI of react many users decided to not use redux any more because it was do nothing for them and useReducer have everyThings users need but having a global store have some advantages over context which are
1. when you you have your store object you can use it in callbacks function out of react-components or inside them but without need to add it as callback dependency (because it will never changes) 
2. and when you don't want to listen on store changes (don't want to rerender your component) you can simply use global store   

```typescript jsx

// MyComponent.jsx 

export default function MyComponent(props) {
    useEffect(() => {
        console.log(store);
    }, []);
    const foo = useCallback(() => {
        console.log(store);
    }, []);
    return (
        // ...
    );
}


// somewhere out of react components 
// tasks.js

function myTask(data) {
    // do some logic here
    store.setData(data);
}

```   
as you can see in these two examples we didn't need store data for MyComponent rendered value so when it's data changed we don't want our component to rerender and also we had use store data in useEffect and useCallback functions without needs to use useReducer (which will cause rerendering after store data updated) 

3. one other advantage of this library is you don't need context provider or consumer any more so when you want to use a data inside of an external non-react library which it will handle dom with itself you would have a problem using consumer because these libraries are not inside of your react hierarchy and tey can not use data you had provide in root of your tree (examples of these libraries which may handle dom by them selves are modals confirms toasts charts and ...) in these cases steel can use a global store becouse they don't need a provider at root of tree
4. with using this library you don't need to write <Provider> in root of your app (I think that writing that is wasting time)

##API 
```typescript
declare function createObservable<T extends object>(storeFactor: (updateComponents: VoidFunction) => T): readonly [T, () => T];
```
as you can see of declaration of our function it will get only one function named storeFactor
storeFactor it self is a function that will receive componentsUpdater and will return our store 
componentsUpdater can be used in storeFactor body itself or can be used in store action methods which changes store properties

##Example
in the following we can see a ViewPortStore which tells us about screen size
```typescript

// view-store.js
const [viewPort, useViewPort] = createObservable(update => {
    const viewPort = {
        width: window.innerWidth,
        height: window.innerHeight,
        get isMobile() {
            return this.width <= MOBILE_SCREEN_WIDTH;
        }
    };

    window.addEventListener('resize', () => {
        viewPort.width = window.innerWidth;
        viewPort.height = window.innerHeight;
        update()
    });

    return viewPort;
});
export {viewPort, useViewPort};
//

// MyComponent.jsx 
import {viewPort, useViewPort} from 'view-store'
export default function ComponentWithOutObserve(props) {
    const foo = useCallback(() => {
        console.log(store);
    }, []);
    return (
        // ...
    );
}

export default function ComponentWithObserve(props) {
    const viewPort = useViewPort();
    useEffect({
        console.log('width changed');
    }, [viewPort.width]);

    return (
        // ...
    );
}

```
