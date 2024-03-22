import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db"
import type { Guitar, CartItem } from "../types/types";

export const useCart=()=>{

    const initialCart= () : CartItem[]=>{
    const localStorageCart = localStorage.getItem('cart')
     return localStorageCart ? JSON.parse(localStorageCart):[]}
    

    const [data]= useState(db);
    const [cart, setCart]= useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    const addToCart=(item: Guitar)=>{
        const itemExists = cart.findIndex((guitar)=>guitar.id===item.id)
        if(itemExists===-1){

            const newItem : CartItem = {...item, quantity: 1} 
            setCart([...cart, newItem])

        }else if (cart[itemExists].quantity <MAX_ITEMS) {
            const updatedCart =[...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        }
    
    }

    const removeFromCart=(id: Guitar['id'])=>{
        setCart(prevCart=>prevCart.filter(e=>e.id !== id))
    }

    const increaseQuantity=(id: Guitar['id'])=>{
        const newCart = cart.map(item=>{
            if(item.id===id && item.quantity < MAX_ITEMS){
            return{
                ...item,
                quantity: item.quantity + 1 
            }
            }
            return item
        })
        setCart(newCart);
    }

    const reduceQuantity=(id: Guitar['id'])=>{
    const newCart = cart.map(item=>{
        if(item.id===id && item.quantity > MIN_ITEMS){
        return{
            ...item,
            quantity: item.quantity - 1 
        }
        }
        return item
    })
    setCart(newCart);
    }


    const emptyCart=()=>{
    setCart([])
    }

    useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const isEmpty = useMemo(()=>cart.length === 0,[cart])
    const cartTotal =useMemo(()=> cart.reduce((total, guitar)=>total+(guitar.quantity * guitar.price),0 ),[cart])
    
    return{
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        reduceQuantity,
        emptyCart,
        isEmpty,
        cartTotal
    }
}