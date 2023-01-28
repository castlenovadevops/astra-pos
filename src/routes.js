import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout'; 
// 
import SyncCodeComponent from './pages/syncCode'; 

// import DevicesComponent from './pages/Devices';

import NotFound from './pages/Page404';
import { isDeviceRegistered, isLogin, checkPageAccess } from './utils/protector';
import NotAuthorized from './pages/notauthorized';

import Dashboard from './pages/Dashboard'; 
import SimpleLayout from './layouts/SimpleLayout';


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

import Login from './pages/Login';
import TicketLayout from './layouts/TicketLayout';
import CreateTicket from './pages/ticket/create';

import Transactions from './pages/Transactions';
import PayoutComponent from './pages/Payout';
import ReportComponent from './pages/reports';
import AppointmentComponent from './pages/Appointments';
import WaitingList from './pages/WaitingList';

import LoyaltyPoints from './pages/Merchant/Settings/LoyaltyPoints';

// import LPSettings from './pages/Merchant/Settings/LPSettings';
import LPActivationSettings from './pages/Merchant/Settings/LPActivationSettings';
import GiftCards from './pages/Merchant/GiftCards';
import LoyaltyRedeemSettings from './pages/Merchant/Settings/LPRedeemSettings';

import Printers from './pages/PrintSettings';
import BatchReports from './pages/BatchReports';
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
        { path: 'customer', element: !checkPageAccess('Customer') ? <NotAuthorized /> :<Customer /> }, 
        { path: 'employee', element: !checkPageAccess('Employee') ? <NotAuthorized /> :<Employee /> }, 
        { path: 'discount', element: !checkPageAccess('Discount') ?<NotAuthorized /> :<Discount /> }, 
        { path: 'category', element: !checkPageAccess('Inventory') ?<NotAuthorized /> :<Category />}, 
        { path: 'product', element: !checkPageAccess('Inventory') ?<NotAuthorized /> :<ProductService />}, 
        { path: 'tax', element: !checkPageAccess('Tax') ?<NotAuthorized /> :<Tax />},
        { path: 'commissionpayment', element: !checkPageAccess('DefaultCommission') ?<NotAuthorized /> :<CommissionPayment />},
        { path: 'defaultdiscount', element: !checkPageAccess('DefaultDiscount') ?<NotAuthorized /> :<DefaultDiscountDivision />},
        { path: 'employeesetting', element: !checkPageAccess('EmpSettings') ?<NotAuthorized /> :<EmployeeSetting />},
        { path: 'profile', element: <UserProfile/>},
        { path: 'transactions', element:!checkPageAccess('Transactions') ?<NotAuthorized /> : <Transactions/>},
        { path: 'payout', element: !checkPageAccess('Payout') ?<NotAuthorized /> :<PayoutComponent/>},
        { path: 'report', element: !checkPageAccess('Report') ?<NotAuthorized /> :<ReportComponent/>},
        { path: 'appointments', element: <AppointmentComponent/>},
        { path: 'printers', element: <Printers/>},
        { path: 'batchreports', element: <BatchReports />},
        { path: 'loyaltypointsettings', element: !checkPageAccess('LoyaltyPoints') ?<NotAuthorized /> :<LoyaltyPoints/>},
        { path: 'loyaltyactivatesettings', element: !checkPageAccess('LoyaltyPoints') ?<NotAuthorized /> :<LPActivationSettings/>},
        { path: 'giftcards', element: !checkPageAccess('GiftCard') ?<NotAuthorized /> :<GiftCards/>},
        { path: 'loyaltyredeemsettings', element: !checkPageAccess('LoyaltyPoints') ?<NotAuthorized /> :<LoyaltyRedeemSettings/>},
        { path: 'waitinglist', element: <WaitingList/>},
        
      ],
    }, {
      path: '/ticket/create', 
      element: isLogin() ? <TicketLayout /> : <Navigate to="/syncBusiness"/>,
      children: [
        { path: '', element: <CreateTicket /> },   
      ],
    }, 
    {
      path: 'syncBusiness',
      element: isDeviceRegistered() ?<Navigate to="/login"/>:  <SyncCodeComponent /> 
      // element:<DevicesComponent/>
    }, 
    {
      path: 'syncData',
      element: isDeviceRegistered() ? <LogoOnlyLayout /> : <Navigate to="/syncBusiness"/>,
      children: [
        { path: '/syncData/progress', element: <SyncDataComponent /> }, 
      ],
    }, 
    {
      path: 'login',
      element: isDeviceRegistered() ? (!isLogin() ? <SimpleLayout /> : <Navigate to="/app"/>) : <Navigate to="/syncBusiness"/>,
      children: [
        { path: '/login', element: <Login /> }, 
      ],
    }, 
    {
      path: '/',
      element: !isDeviceRegistered() ? <LogoOnlyLayout /> : <Navigate to="/login"/>,
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
