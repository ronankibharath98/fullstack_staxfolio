import { createSlice } from "@reduxjs/toolkit"

type Role = null | "admin" | "manager" | "user"

interface User {
    name?: string
    firstName?: string
    lastName?: string
    email?: string
    role: Role
}

interface AuthState {
    loading: boolean;
    user: User | null;
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
    reducers: {
        //actions
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setUser: (state, action) => {
            if (action.payload){
                const { role, ...rest } = action.payload; 
                state.user = { ...rest, role };          
                state.role = role;                  
            }else{
                state.user = null;
                state.role = null;
            }
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        logout: (state) => {
            state.loading = false;
            state.user = null;
            state.role = null;
        }
    }
})

export const { setLoading, setUser, setRole, logout } = authSlice.actions;
export default authSlice.reducer;