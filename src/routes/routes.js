import routesAdmin from "./routes.admin";
import routesClient from "./routes.client";
import {Error404} from "../pages";
import {BasicLayout}  from "../layouts";


import {ForgotPasswordForm } from '../components/Admin'
import {ResetPasswordForm} from '../components/Admin/ResetPasswordForm/ResetPasswordForm'

const routes = [
    ...routesAdmin, 
    ...routesClient, 
    
    {
        path: '/admin/forgot-password',
        layout: BasicLayout,
        component: ForgotPasswordForm,
    },

    {
        path: '/reset-password/:uid/:token',
        layout: BasicLayout,
        component: ResetPasswordForm,
    },

    {
        path: '*',
        layout: BasicLayout,
        component: Error404,
    },
];
export default routes;