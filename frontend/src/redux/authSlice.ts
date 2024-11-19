import { createSlice } from "@reduxjs/toolkit"

type Role = null | "admin" | "manager" | "user" 

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
        },
        logout: (state) => {
            state.loading = false,
            state.user = null,
            state.role = null
        }
    }
})

export const { setLoading, setUser, setRole, logout } = authSlice.actions;
export default authSlice.reducer;