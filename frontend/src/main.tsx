import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Import the layouts
import RootLayout from './layouts/root-layout'
import PrivateLayout from './layouts/dashboard-layout'

//Import the components
import IndexPage from './routes'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'
import PostsPage from './routes/posts'
import ProfilePage from './routes/profile'
import SupportUsPage from './routes/supportus'
import UserPage from './routes/user'
import PostPage from './components/Posts/PostPage'

import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/user/:userId", element: <UserPage /> },
      { path: "/posts", element: <PostsPage /> },
      { path: "/supportus", element: <SupportUsPage /> },
      { path: "/posts/:postId", element: <PostPage /> }, 

      {
        element: <PrivateLayout />,
        children: [
          { path: "/profile", element: <ProfilePage /> }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)