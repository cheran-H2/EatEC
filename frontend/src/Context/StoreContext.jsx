import { createContext, useEffect, useState } from "react";
import { food_list as default_food_list, menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const [food_list, setFoodList] = useState(default_food_list);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            } catch (error) {
                console.log("Error adding to cart on server:", error);
            }
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            } catch (error) {
                console.log("Error removing from cart on server:", error);
            }
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data && response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
                setFoodList(response.data.data);
            } else {
                setFoodList(default_food_list);
            }
        } catch (error) {
            console.log("Backend offline or error fetching food list, using static menu list:", error);
            setFoodList(default_food_list);
        }
    }

    const loadCartData = async (userToken) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: userToken } });
            if (response.data && response.data.cartData) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log("Error loading cart data:", error);
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;