import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-8 shadow-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
