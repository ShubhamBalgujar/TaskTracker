import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks, updateTaskDB, insertTask, deleteTaskDB } from "../db/taskdb";


export const loadTasks = createAsyncThunk("tasks/load", async () => {
    const tasks = await getTasks();
    return tasks;
});

export const addTask = createAsyncThunk("tasks/add", async (title) => {
    const newTask = await insertTask(title);
    return newTask;
})

export const updateTask = createAsyncThunk("tasks/update", async ({ id, title }) => {
    const updatedTask = await updateTaskDB(id, title);
    return updatedTask;
})

export const removeTask = createAsyncThunk("tasks/remove", async (id) => {
    await deleteTaskDB(id);
    return id;
})  

const taskSlice = createSlice({
    name: "task",
    initialState: {
        tasks: [],
        loading: false,
        error: null,
    },
    reducers: {
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        removeTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload.id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled,(state,action)=>{
                const idx=state.tasks.findIndex(t=>t.id===action.payload.id);
                if (idx!==-1){ state.tasks[idx]=action.payload; }
            })
            .addCase(removeTask.fulfilled,(state,action)=>{
                state.tasks=state.tasks.filter(t=>t.id!==action.payload);
            })

            .addMatcher(
                action => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                action => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                action => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                }
            );
    }
});

export default taskSlice.reducer;
