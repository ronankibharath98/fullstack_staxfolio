import { createSlice } from "@reduxjs/toolkit"

type Role = null | "Provider" | "Admin" | "User" 

interface AuthState {
    loading: boolean;
    user: any;
    role: Role;
}

const initialState: AuthState = {
    loading: false,
    user: null,
    role: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
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