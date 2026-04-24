import Companies from "@/components/admin/Companies";
import { createSlice } from "@reduxjs/toolkit";
const comapnySlice=createSlice({
    name:"company",
    initialState:{
        singleCompany:null,
        companies:[],
        searchCompanyByText:"",
    },
    reducers:{
        setSingleCompany:(state,action)=>{
            state.singleCompany=action.payload;
        },
        setCompanies:(state,action)=>{
            state.companies=action.payload
        },
        setSearchCompanyByText:(state,action)=>{
            state.searchCompanyByText=action.payload;
        }
    }
})
export const {setSingleCompany,setCompanies,setSearchCompanyByText} = comapnySlice.actions;
export default comapnySlice.reducer;