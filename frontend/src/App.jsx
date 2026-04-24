import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import Browse from "./components/Browse"
import Profile from "./components/Profile"
import ColonyHome from "./components/ColonyHome"
import ServiceDetail from "./components/ServiceDetail"
import OfferService from "./components/OfferService"
import MyServices from "./components/MyServices"
import AllServices from "./components/AllServices"
import ManageColonies from "./components/admin/ManageColonies"
import AddColony from "./components/admin/AddColony"
import ApproveServices from "./components/admin/ApproveServices"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./components/Dashboard"


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/browse",
        element: <Browse />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/colony/:id",
        element: <ColonyHome />,
      },
      {
        path: "/service/:id",
        element: <ServiceDetail />,
      },
      {
        path: "/offer-service",
        element: <OfferService />,
      },
      {
        path: "/my-services",
        element: <MyServices />,
      },
      {
        path: "/all-services",
        element: <AllServices />,
      },
      {
        path: "/admin/colonies",
        element: <ManageColonies />,
      },
      {
        path: "/admin/add-colony",
        element: <AddColony />,
      },
      {
        path: "/admin/services",
        element: <ApproveServices />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      }
    ],
  },
])

function App() {
  return <RouterProvider router={appRouter} />
}

export default App