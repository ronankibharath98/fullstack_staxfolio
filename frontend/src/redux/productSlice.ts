import { createSlice } from "@reduxjs/toolkit"

interface ProductState {
    allProducts: [];
    allAdminProducts: []
}

const initialState: ProductState = {
    allProducts: [],
    allAdminProducts: []
}

export const productSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        //actions
        setAllProducts: (state, action) => {
            state.allProducts = action.payload
        },
        setAllAdminProducts: (state, action) => {
            state.allAdminProducts = action.payload
        },
    }
})

export const { setAllProducts, setAllAdminProducts } = productSlice.actions;
export default productSlice.reducer;