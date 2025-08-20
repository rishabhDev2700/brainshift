
import React from "react";

interface FriendsLayoutProps {
  children: React.ReactNode;
}

export const FriendsLayout: React.FC<FriendsLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto md:p-4">
      <h1 className="text-2xl font-bold mb-4 text-emerald-600">Friends</h1>
      {children}
    </div>
  );
};
