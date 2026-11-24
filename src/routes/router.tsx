import { createBrowserRouter } from 'react-router-dom';

import BannerPage from '@pages/banner/BannerPage';
import CreditPage from '@pages/credit/CreditPage';
import FloorPlanPage from '@pages/floorPlan/FloorPlanPage';
import HomePage from '@pages/home/HomePage';
import LandingPage from '@pages/landing/LandingPage';
import LoginPage from '@pages/login/LoginPage';
import NotFoundPage from '@pages/notFound/NotFoundPage';
import StylePage from '@pages/style/StylePage';
import TagPage from '@pages/tag/TagPage';

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
        children: [
          { index: true, element: <HomePage /> },
          { path: ROUTES.BANNER, element: <BannerPage /> },
          { path: ROUTES.LANDING, element: <LandingPage /> },
          { path: ROUTES.FLOOR_PLAN, element: <FloorPlanPage /> },
          { path: ROUTES.STYLE, element: <StylePage /> },
          { path: ROUTES.CREDIT, element: <CreditPage /> },
          { path: ROUTES.TAG, element: <TagPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
