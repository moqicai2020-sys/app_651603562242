import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ProtectedRoute } from '../components/ProtectedRoute';

import P_home from '../pages/p-home';
import P_public_home from '../pages/p-public_home';
import P_knowledge_graph from '../pages/p-knowledge_graph';
import P_tag_cloud from '../pages/p-tag_cloud';
import P_search_result from '../pages/p-search_result';
import P_user_settings from '../pages/p-user_settings';
import P_admin from '../pages/p-admin';
import P_admin_login_config from '../pages/p-admin-login-config';
import P_admin_user_management from '../pages/p-admin-user-management';
import P_admin_comment_management from '../pages/p-admin-comment-management';
import P_admin_image_management from '../pages/p-admin-image-management';
import P_admin_short_note_management from '../pages/p-admin-short-note-management';
import P_admin_short_video_management from '../pages/p-admin-short-video-management';
import P_admin_short_note_edit from '../pages/p-admin-short-note-edit';
import P_admin_short_video_edit from '../pages/p-admin-short-video-edit';
import P_admin_system_settings from '../pages/p-admin-system-settings';
import P_admin_user_settings from '../pages/p-admin-user-settings';
import P_system_announcements from '../pages/p-system-announcements';
import P_photo_blog from '../pages/p-photo_blog';
import P_image_detail from '../pages/p-image-detail';
import P_login from '../pages/p-login';
import P_register from '../pages/p-register';
import P_forgot_password from '../pages/p-forgot_password';
import P_change_password from '../pages/p-change_password';
import P_test from '../pages/p-test';
import P_profile from '../pages/p-profile';
import P_short_notes from '../pages/p-short_notes';
import P_short_note_detail from '../pages/p-short_note_detail';
import P_short_videos from '../pages/p-short_videos';
import P_short_video_detail from '../pages/p-short-video-detail';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';

function Listener() {
  const location = useLocation();
  useEffect(() => {
    const timer = setTimeout(() => {
      const pageId = 'P-' + location.pathname.replace('/', '').toUpperCase();
      console.log('当前pageId:', pageId, ', pathname:', location.pathname, ', search:', location.search);
      if (typeof window === 'object' && window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'chux-path-change',
          pageId: pageId,
          pathname: location.pathname,
          search: location.search,
        }, '*');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Listener />,
    children: [
      {
        path: '/',
        element: <Navigate to='/public-home' replace={true} />,
      },
      {
        path: '/public-home',
        element: (
          <ErrorBoundary>
            <P_public_home />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/home',
        element: (
          <ErrorBoundary>
            <P_home />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/knowledge-graph',
        element: (
          <ErrorBoundary>
            <P_knowledge_graph />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/tag-cloud',
        element: (
          <ErrorBoundary>
            <P_tag_cloud />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/photo-blog',
        element: (
          <ErrorBoundary>
            <P_photo_blog />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/image-detail',
        element: (
          <ErrorBoundary>
            <P_image_detail />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/short-notes',
        element: (
          <ErrorBoundary>
            <P_short_notes />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/short-note-detail',
        element: (
          <ErrorBoundary>
            <P_short_note_detail />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/short-videos',
        element: (
          <ErrorBoundary>
            <P_short_videos />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/short-video-detail',
        element: (
          <ErrorBoundary>
            <P_short_video_detail />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/login',
        element: (
          <ErrorBoundary>
            <P_login />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/register',
        element: (
          <ErrorBoundary>
            <P_register />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/forgot-password',
        element: (
          <ErrorBoundary>
            <P_forgot_password />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/change-password',
        element: (
          <ErrorBoundary>
            <P_change_password />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/system-announcements',
        element: (
          <ErrorBoundary>
            <P_system_announcements />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/test',
        element: (
          <ErrorBoundary>
            <P_test />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/search-result',
        element: (
          <ErrorBoundary>
            <P_search_result />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/profile',
        element: <ProtectedRoute requiredRole="user" />,
        children: [
          {
            path: '/profile',
            element: (
              <ErrorBoundary>
                <P_profile />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: '/user-settings',
        element: (
          <ErrorBoundary>
            <P_user_settings />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/admin',
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          {
            path: '/admin',
            element: (
              <ErrorBoundary>
                <P_admin />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/user-management',
            element: (
              <ErrorBoundary>
                <P_admin_user_management />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/comment-management',
            element: (
              <ErrorBoundary>
                <P_admin_comment_management />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/image-management',
            element: (
              <ErrorBoundary>
                <P_admin_image_management />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/short-note-management',
            element: (
              <ErrorBoundary>
                <P_admin_short_note_management />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/short-video-management',
            element: (
              <ErrorBoundary>
                <P_admin_short_video_management />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/create-short-note',
            element: (
              <ErrorBoundary>
                <P_admin_short_note_edit />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/edit-short-note',
            element: (
              <ErrorBoundary>
                <P_admin_short_note_edit />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/create-short-video',
            element: (
              <ErrorBoundary>
                <P_admin_short_video_edit />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/edit-short-video',
            element: (
              <ErrorBoundary>
                <P_admin_short_video_edit />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/system-settings',
            element: (
              <ErrorBoundary>
                <P_admin_system_settings />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: '/admin/user-settings',
            element: (
              <ErrorBoundary>
                <P_admin_user_settings />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: '/admin-login-config',
        element: <ProtectedRoute requiredRole="superadmin" />,
        children: [
          {
            path: '/admin-login-config',
            element: (
              <ErrorBoundary>
                <P_admin_login_config />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ]
  }
]);

export default router;