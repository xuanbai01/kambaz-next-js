import { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({ 
  children 
}: Readonly<{ 
  children: React.ReactNode
}>) {
  return (
    <div id="wd-kambaz">
      <AccountNavigation />
      <div className="wd-main-content-offset p-4">
        {children}
      </div>
    </div>
  );
}