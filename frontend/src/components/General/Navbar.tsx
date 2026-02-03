import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { logoutUser } from "@/api/auth.api";
import { removeFromLocalStorage } from "@/utils/helpers";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User2 } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err);
    } finally {
      removeFromLocalStorage("accessToken");
      removeFromLocalStorage("refreshToken");
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <nav className="w-full border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Toooder
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                  <User2 /> {user?.username}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex flex-col gap-6 pt-12 px-6">
              <Link to="/" className="text-xl font-bold text-primary">
                Toooder
              </Link>

              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Logged in as {user?.username}
                  </span>

                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
