import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks';

const Register = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register.mutateAsync({
        full_name: fullName,
        email,
        password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '注册失败，请重试');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-12 shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">创建账号</h1>
          <p className="text-sm text-gray-500">开始创建您的专业简历</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="张三"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="至少 8 个字符"
            />
            <p className="mt-1 text-xs text-gray-400">密码强度：需要至少 8 个字符</p>
          </div>

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {register.isPending ? '注册中...' : '创建账号'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          已有账号？{' '}
          <Link to="/login" className="text-primary hover:underline">
            立即登录
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
