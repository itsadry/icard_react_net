import {ClientLayout, BasicLayout} from '../layouts'
import {SelectTable, Categories, Products, Cart, OrdersHistory } from '../pages/Client'
import {Chatbot} from '../pages/Client/ChatbotClient'
//import {Chatbot} from '../pages/Admin'

const routesClient = [
    {
        path: '/',
        layout: BasicLayout,
        component: SelectTable,
        exact: true,
    },
    {
        path: '/client/:tableNumber',
        layout: ClientLayout,
        component: Categories,
        exact: true,
    },
    {
        path: '/client/:tableNumber/cart',
        layout: ClientLayout,
        component: Cart,
        exact: true,
    },
    {
        path: '/client/:tableNumber/orders',
        layout: ClientLayout,
        component: OrdersHistory,
        exact: true,
    },
    {
        path: '/client/:tableNumber/:idCategory',
        layout: ClientLayout,
        component: Products,
        exact: true,
    },
    {
        path: '/client/:tableNumber/chatbot',
        layout: ClientLayout,
        component: Chatbot,
        exact: true,
    },
    
];



export default routesClient;