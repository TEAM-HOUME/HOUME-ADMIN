import { createBrowserRouter } from 'react-router-dom';

import HomePage from '@pages/home/HomePage';
import LoginPage from '@pages/login/LoginPage';
import NotFoundPage from '@pages/notFound/NotFoundPage';

import AdminLayout from '@routes/AdminLayout';
import { ROUTES } from '@routes/paths';
import ProtectedRoute from '@routes/ProtectedRoute';

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [{ index: true, element: <HomePage /> }],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
