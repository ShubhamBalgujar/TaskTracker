import { configureStore } from '@reduxjs/toolkit';
import taskSlice from './taskSlice';


const store = configureStore({
    reducer: {
        task: taskSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;