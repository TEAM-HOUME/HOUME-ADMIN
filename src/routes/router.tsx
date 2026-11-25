import { createBrowserRouter } from 'react-router-dom';

import BannerPage from '@pages/banner/BannerPage';
import CreditPage from '@pages/credit/CreditPage';
import FloorPlanPage from '@pages/floorPlan/FloorPlanPage';
import FurniturePage from '@pages/furniture/FurniturePage';
import FurnitureTypePage from '@pages/furnitureType/FurnitureTypePage';
import HomePage from '@pages/home/HomePage';
import LandingPage from '@pages/landing/LandingPage';
import LoginPage from '@pages/login/LoginPage';
import MoodboardPage from '@pages/moodboard/MoodboardPage';
import NotFoundPage from '@pages/notFound/NotFoundPage';
import RawProductPage from '@pages/rawProduct/RawProductPage';
import StylePage from '@pages/style/StylePage';
import TagPage from '@pages/tag/TagPage';

import AdminLayout from '@routes/AdminLayout';
import { ROUTES } from '@routes/paths';
import ProtectedRoute from '@routes/ProtectedRoute';
import RouteErrorFallback from '@routes/RouteErrorFallback';

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            // 각 화면에서 난 에러를 사이드바는 유지한 채 본문 자리에 보여준다
            errorElement: <RouteErrorFallback />,
            children: [
              { index: true, element: <HomePage /> },
              { path: ROUTES.BANNER, element: <BannerPage /> },
              { path: ROUTES.LANDING, element: <LandingPage /> },
              { path: ROUTES.FLOOR_PLAN, element: <FloorPlanPage /> },
              { path: ROUTES.STYLE, element: <StylePage /> },
              { path: ROUTES.CREDIT, element: <CreditPage /> },
              { path: ROUTES.TAG, element: <TagPage /> },
              { path: ROUTES.MOODBOARD, element: <MoodboardPage /> },
              { path: ROUTES.FURNITURE_TYPE, element: <FurnitureTypePage /> },
              { path: ROUTES.FURNITURE, element: <FurniturePage /> },
              { path: ROUTES.RAW_PRODUCT, element: <RawProductPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
