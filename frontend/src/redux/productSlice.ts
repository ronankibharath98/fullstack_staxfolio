import { createSlice } from "@reduxjs/toolkit"

interface ProductState {
    allProducts: [];
}

const initialState: ProductState = {
    allProducts: [],
}

export const productSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        //actions
        setAllProducts: (state, action) => {
            state.allProducts = action.payload
        }
    }
})

export const { setAllProducts } = productSlice.actions;
export default productSlice.reducer;