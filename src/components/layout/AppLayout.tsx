import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AppLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
