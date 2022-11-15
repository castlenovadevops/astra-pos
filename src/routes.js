import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout'; 
// 
import SyncCodeComponent from './pages/syncCode';  

import NotFound from './pages/Page404';
import { isLogin } from './utils/protector';
 
import Dashboard from './pages/Dashboard'; 


import Customer from './pages/Merchant/Customer';
import Employee from './pages/Merchant/Employee';
import Discount from './pages/Merchant/Discounts';
import Category from './pages/Merchant/Inventory/Category';
import ProductService from './pages/Merchant/Inventory/Products';
import Tax from './pages/Merchant/Settings/Tax';
import CommissionPayment from './pages/Merchant/Settings/DefaultCommission';
import DefaultDiscountDivision from './pages/Merchant/Settings/DefaultDiscountDivision';
import EmployeeSetting from './pages/Merchant/Settings/EmployeeSpecificSetting';
import UserProfile from './pages/Profile';
import SyncDataComponent from './pages/syncData';


// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // {
    //   path: '/dashboard', 
    //   element: isLogin() ? <DashboardLayout /> : <Navigate to="/login"/>,
    //   children: [
    //     // { element: <Navigate to="/dashboard/app" replace /> },
    //     { path: 'app', element: <Dashboard /> },
    //     { path: '', element: <Dashboard /> }, 
    //     { path: 'users', element: <Users /> }, 
    //     // { path: 'user', element: <User /> },
    //     // { path: 'products', element: <Products /> },
    //     // { path: 'blog', element: <Blog /> },
    //   ],
    // },
    {
      path: '/app', 
      element: isLogin() ? <DashboardLayout /> : <Navigate to="/syncBusiness"/>,
      children: [
        { path: '', element: <Dashboard /> },  

        /** MERCHANT PANEL ROUTES */
        { path: 'customer', element: <Customer /> }, 
        { path: 'employee', element: <Employee /> }, 
        { path: 'discount', element: <Discount /> }, 
        { path: 'category', element: <Category />}, 
        { path: 'product', element: <ProductService />}, 
        { path: 'tax', element: <Tax />},
        { path: 'commissionpayment', element: <CommissionPayment />},
        { path: 'defaultdiscount', element: <DefaultDiscountDivision />},
        { path: 'employeesetting', element: <EmployeeSetting />},
        { path:'profile', element: <UserProfile/>}
      ],
    }, 
    {
      path: 'syncBusiness',
      element: <SyncCodeComponent />,
    }, 
    {
      path: 'syncData',
      element: <SyncDataComponent />,
    }, 
    {
      path: '/',
      element: !isLogin() ? <LogoOnlyLayout /> : <Navigate to="/app"/>,
      children: [
        { path: '/', element: <Navigate to="/syncBusiness" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
