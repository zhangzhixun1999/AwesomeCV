import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AwesomeCV</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="secondary">登录</Button>
            </Link>
            <Link to="/register">
              <Button>免费注册</Button>
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} />
            专业简历生成工具
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            打造完美简历
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
              赢得面试机会
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            使用我们的 AI 驱动简历生成器，几分钟内创建专业的 ATS 友好型简历。
            精美模板、实时预览、一键导出。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-block">
              <Button size="lg" className="text-lg px-8 py-4 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40">
                免费开始使用
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link to="/templates" className="inline-block">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                浏览模板
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            无需信用卡 · 永久免费 · 快速创建
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-blue-600" />}
            title="快速创建"
            description="选择模板，填写信息，几分钟内即可完成专业简历"
            color="blue"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-purple-600" />}
            title="精美模板"
            description="多种专业模板设计，适合各行各业，ATS 友好格式"
            color="purple"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-green-600" />}
            title="安全可靠"
            description="数据加密存储，隐私保护，随时导出 PDF 文件"
            color="green"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">专业模板</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10万+</div>
              <div className="text-gray-600">用户信赖</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">面试成功率</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 md:p-16 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            准备好创建您的完美简历了吗？
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            加入数万用户的行列，使用我们的简历生成器，快速打造专业简历
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 shadow-xl">
              立即免费开始
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2024 简历生成器. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'green';
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const colorClasses = {
    blue: 'hover:border-blue-300 hover:bg-blue-50',
    purple: 'hover:border-purple-300 hover:bg-purple-50',
    green: 'hover:border-green-300 hover:bg-green-50',
  };

  return (
    <div className={`bg-white rounded-xl p-8 border-2 border-transparent transition-all ${colorClasses[color]}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default Home;
