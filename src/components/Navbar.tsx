import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { signIn, signOut } from "next-auth/react";

interface NavbarProps {
  userAuthenticated: boolean;
  userIsAdmin: boolean;
}

export default function Navbar({ userAuthenticated, userIsAdmin }: NavbarProps) {
  return <div className="fixed flex top-3 left-0 right-0 px-10 justify-between w-full">
    <div>
      {userAuthenticated && (
        <NavigationMenu>
          <NavigationMenuList>
            {userIsAdmin ? (<NavigationMenuItem>
              <Link href="/admin" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Admin Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>) : (<NavigationMenuItem>
              <Link href="/advertiser" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Advertiser Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>)}
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
    <div>
      <Button variant="link" onClick={() => signIn()}>Login</Button>
      {userAuthenticated && <Button variant="link" onClick={() => signOut()}>Sign out</Button>}
    </div>
  </div>;
}