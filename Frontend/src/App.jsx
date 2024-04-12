import { useState } from 'react'
import { Home, Layout, AboutUs, ContactUs, NotFound, LoginForm, SignUp, ProfileDetails, EditProfile, Blog, Post, AllPosts, Feed, StartupProfile, EditStartUpProfile, SearchResult, ChatWindow, SubscriptionCard , MentorPage} from './components/Index.js'

import { ProtectedRoute } from './utils/ProtectedRoute.jsx';
import { PublicRoute } from './utils/PublicRoute.jsx';

import { LoginContext } from './context/LoginContext.js';
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import './App.css'
import { ChakraProvider } from '@chakra-ui/react'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "*",
        element: <NotFound /> 
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
      {
        path: "/profile-details",
        element: <ProfileDetails />,
      },
      {
        path: "/edit-profile",
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/blog",
        element: <Blog />
      },
        {
          path: "/post/:postID",
          element: <Post />
        },
      {
        path: "/all-posts",
        element: <AllPosts />
      },
      {
        path: "/feed",
        element: <Feed />
      },
      {
        path: "/chat",
        element: <ChatWindow />
      },
      {
        path: "/search-result/",
        element: <SearchResult />
      },
      {
        path: "/startup-profile",
        element: (
          <ProtectedRoute allowedRoles={['startup']}>
           <StartupProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-startup-profile",
        element: (
          <ProtectedRoute allowedRoles={['startup']}>
           <EditStartUpProfile />
          </ProtectedRoute>
        ),
      },
      {
        path:"/subcriptioncard",
        element: <SubscriptionCard/>
      }, 
      {
        path: "/mentorpage",
        element: <MentorPage/>
      }, 
    ],
  },
]);
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("token") ? true : false);

  return (
    <ChakraProvider>

      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <RouterProvider router={router} />
      </LoginContext.Provider>

    </ChakraProvider>
  )
}

export default App