import { createSlice } from "@reduxjs/toolkit"


export const authSlice = createSlice({
    name: "auth",
    initialState:{
        loading: false,
        user: null,
        role: null
    },
    reducers:{
        //actions
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setRole: (state, action) => {
            state.role = action.payload
        }
    }
})

export const { setLoading, setUser, setRole } = authSlice.actions;
export default authSlice.reducer;