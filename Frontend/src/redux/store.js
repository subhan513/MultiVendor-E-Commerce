import {configureStore} from "@reduxjs/toolkit";
import {userReducer} from "./reducers/user.js";
import {sellerReducer} from "./reducers/seller.js"
import { productReducer } from "./reducers/product.js";
import { eventsReducer } from "./reducers/event.js";
import { cartReducer } from "./reducers/cart.js";
import { wishlistReducer } from "./reducers/wishlist.js";
import { orderReducer } from "./reducers/order.js";
const store  = configureStore({
  reducer : {
    user :   userReducer,
    seller : sellerReducer,
    product : productReducer,
    events : eventsReducer,
    cart : cartReducer,
    wishlist : wishlistReducer,
    order : orderReducer
    }
})

export default store;