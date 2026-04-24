"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { LogOut, User2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/utils/constant"
import { setUser } from "@/redux/authSlice"
import { toast } from "sonner"
import { motion } from "framer-motion"
import ThemeSwitcher from "../ThemeSwitcher"

const Navbar = () => {
  const { user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
      dispatch(setUser(null))
      navigate("/")
      toast.success(res.data?.message || "Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      dispatch(setUser(null))
      navigate("/")
      toast.success("Logged out successfully")
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-6">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-bold">
            My<span className="text-primary">Colony</span>
          </h1>
        </Link>

        <div className="flex items-center gap-8">
          <ul className="hidden md:flex font-medium items-center gap-6">

            {user && user.role === "admin" ? (
              <>
                <li>
                  <Link to="/admin/colonies" className="text-muted-foreground hover:text-foreground transition-colors">
                    Manage Colonies
                  </Link>
                </li>
                <li>
                  <Link to="/admin/services" className="text-muted-foreground hover:text-foreground transition-colors">
                    Approve Services
                  </Link>
                </li>
                <li>
                  <Link to="/my-services" className="text-muted-foreground hover:text-foreground transition-colors">
                    My Services
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-semibold text-primary">
                    📊 Dashboard
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/all-services" className="text-muted-foreground hover:text-foreground transition-colors">
                    Browse Services
                  </Link>
                </li>
                <li>
                  <Link to="/my-services" className="text-muted-foreground hover:text-foreground transition-colors">
                    My Services
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-semibold text-primary">
                    📊 Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />

            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="btn-ghost">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-primary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-border hover:border-primary transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname || "User"}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {user?.fullname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-professional overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary-foreground/20">
                          <AvatarImage
                            src={user?.profile?.profilePhoto}
                            alt={user?.fullname || "User"}
                          />
                          <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xl font-bold">
                            {user?.fullname?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-lg">{user?.fullname}</h4>
                          <p className="text-sm opacity-90">{user?.profile?.bio || "Welcome to MyColony"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                        <User2 className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">View Profile</span>
                      </Link>
                      <button
                        onClick={logoutHandler}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
