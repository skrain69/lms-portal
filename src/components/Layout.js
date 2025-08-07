import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
