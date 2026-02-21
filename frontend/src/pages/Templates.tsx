import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui';
import { useTemplates } from '@/hooks';

const Templates = () => {
  const { data: templates, isLoading } = useTemplates();

  const getTemplateGradient = (id: string) => {
    const gradients = {
      modern: 'from-blue-500 to-purple-500',
      classic: 'from-gray-700 to-gray-900',
      creative: 'from-pink-500 to-orange-500'
    };
    return gradients[id as keyof typeof gradients] || 'from-blue-500 to-purple-500';
  };

  const getTemplateIcon = (id: string) => {
    const icons = {
      modern: '💼',
      classic: '📄',
      creative: '✨'
    };
    return icons[id as keyof typeof icons] || '📄';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="text-6xl">🎨</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              选择您的简历模板
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              精心设计的专业模板，帮助您在求职中脱颖而出。点击任意模板即可开始创建。
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full spin mx-auto mb-4"></div>
              <p className="text-gray-500">加载模板中...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates?.map((template) => {
              const content = template.defaultContent || {
                personalInfo: { name: '姓名', title: '职位', email: '', phone: '' },
                summary: '',
                workExperience: [],
                skills: []
              };

              return (
                <Link
                  key={template.id}
                  to={`/editor/new?template=${template.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border border-gray-100 hover:border-gray-200">
                    {/* Preview Area */}
                    <div className="aspect-a4 relative overflow-hidden bg-gray-50 group-hover:bg-gray-100 transition-colors">
                      {/* Overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${getTemplateGradient(template.id)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                      <div className="w-full h-full p-6 overflow-hidden">
                        {/* Template Icon & Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl">{getTemplateIcon(template.id)}</span>
                          <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">
                            预览
                          </span>
                        </div>

                        {/* 简历预览 */}
                        <div className="text-xs">
                          {/* 姓名 */}
                          <div className="text-xl font-bold text-gray-900 mb-2">
                            {content.personalInfo?.name || '姓名'}
                          </div>
                          {/* 职位 */}
                          <div className="text-sm text-primary font-medium mb-3">
                            {content.personalInfo?.title || '职位'}
                          </div>
                          {/* 联系方式 */}
                          <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
                            {content.personalInfo?.email && (
                              <span className="flex items-center gap-1">
                                📧 {content.personalInfo.email}
                              </span>
                            )}
                            {content.personalInfo?.phone && (
                              <span className="flex items-center gap-1">
                                📱 {content.personalInfo.phone}
                              </span>
                            )}
                          </div>

                          {/* 简介 */}
                          {content.summary && (
                            <div className="mb-3">
                              <div className="font-semibold text-gray-900 text-xs uppercase mb-1.5 tracking-wide">个人简介</div>
                              <div className="text-gray-600 line-clamp-2 leading-relaxed">
                                {content.summary}
                              </div>
                            </div>
                          )}

                          {/* 工作经历 */}
                          {content.workExperience && content.workExperience.length > 0 && (
                            <div className="mb-3">
                              <div className="font-semibold text-gray-900 text-xs uppercase mb-2 tracking-wide">工作经历</div>
                              {content.workExperience.slice(0, 2).map((exp: any) => (
                                <div key={exp.id} className="mb-2 pl-3 border-l-2 border-gray-200">
                                  <div className="font-medium text-gray-900 text-xs">{exp.position}</div>
                                  <div className="text-gray-500 text-xs">{exp.company}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 技能 */}
                          {content.skills && content.skills.length > 0 && (
                            <div>
                              <div className="font-semibold text-gray-900 text-xs uppercase mb-2 tracking-wide">技能</div>
                              <div className="flex flex-wrap gap-1.5">
                                {content.skills.slice(0, 6).map((skill: string, i: number) => (
                                  <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hover overlay text */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/95 backdrop-blur px-6 py-3 rounded-xl shadow-lg">
                          <span className="text-primary font-semibold">点击使用此模板 →</span>
                        </div>
                      </div>
                    </div>

                    {/* Info Area */}
                    <div className="p-6 bg-white border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {template.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {template.features.map((feature) => (
                          <Badge key={feature} variant="secondary">{feature}</Badge>
                        ))}
                      </div>

                      {/* Click hint */}
                      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <span className="text-sm text-gray-500 group-hover:text-primary transition-colors">
                          点击开始创建 ✨
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom Help Text */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            💡 提示：选择模板后可以随时更改内容和样式
          </p>
        </div>
      </div>
    </div>
  );
};

export default Templates;
