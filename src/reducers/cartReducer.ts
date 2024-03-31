import { db } from "../data/db"
import { CartItem, Guitar } from "../types/types"


export type CartActions=
    {type:'add-to-cart', payload: {item: Guitar}}|
    {type:'remove-from-cart',payload:{id: Guitar['id']}}|
    {type:'increase-quantity',payload:{id: Guitar['id']}}|
    {type:'decrease-quantity', payload:{id:Guitar['id']}}|
    {type:'empty-cart'}



export type CartState={
    data: Guitar[]
    cart: CartItem[]
}

const MAX_ITEMS = 5
const MIN_ITEMS = 1
const initialCart= () : CartItem[]=>{
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart):[]}
    

export const initialState : CartState={
    data: db,
    cart:initialCart(),
}
export const cartReducer=(
    state: CartState = initialState,
    action: CartActions
)=>{
     switch (action.type) {
         
        case 'add-to-cart':
            const itemExists = state.cart.find((guitar)=>guitar.id===action.payload.item.id)

            let updatedCart : CartItem[]=[]
            

             if(itemExists){
                updatedCart= state.cart.map(item=>{
                    if(item.id === action.payload.item.id && item.quantity< MAX_ITEMS){
                        return{...item, quantity: item.quantity + 1}
                    }else{
                        return item
                    }
                })
            }else  {
                const newItem : CartItem = {...action.payload.item, quantity: 1}
                updatedCart=[...state.cart, newItem] 
            }
             return{
                ...state,
                cart: updatedCart
                }
        case 'remove-from-cart':
            
            return{
                ...state,
                cart: state.cart.filter(guitar=>guitar.id !== action.payload.id)
            }
        case 'increase-quantity':

        const increaseCart = state.cart.map(item=>{
            if(item.id===action.payload.id && item.quantity < MAX_ITEMS){
                return{
                    ...item,
                    quantity: item.quantity + 1 
                }
            }
            return item
        })

            return {
                ...state,
                cart: increaseCart
            }
        case 'decrease-quantity':
            const decreaseCart = state.cart.map(item=>{
                if(item.id===action.payload.id && item.quantity > MIN_ITEMS){
                return{
                    ...item,
                    quantity: item.quantity - 1 
                }
                }
                return item
            })
            return{
                ...state,
                cart: decreaseCart
            }
        case 'empty-cart':
            return{
                ...state,
                cart:[]
            }
     }
    return state
}