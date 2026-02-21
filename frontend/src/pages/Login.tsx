import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks';

const Login = () => {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login.mutateAsync({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '登录失败，请重试');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-12 shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">欢迎回来</h1>
          <p className="text-sm text-gray-500">登录以继续创建您的专业简历</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            <p className="mt-1 text-xs text-gray-400">测试账号: test@example.com</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="•••••••••"
            />
            <p className="mt-1 text-xs text-gray-400">测试密码: password123</p>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {login.isPending ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 text-sm text-gray-400">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span>或</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="text-center text-sm text-gray-600">
          还没有账号？{' '}
          <Link to="/register" className="text-primary hover:underline">
            立即注册
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
