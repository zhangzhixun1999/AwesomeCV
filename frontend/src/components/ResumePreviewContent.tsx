import { ResumeContent } from '@/types';

export const ResumePreviewContent = ({ content }: { content: ResumeContent }) => {
  const hasContent = content.personalInfo.name ||
                     content.personalInfo.email ||
                     content.personalInfo.phone ||
                     content.summary ||
                     content.workExperience.length > 0 ||
                     content.education.length > 0 ||
                     content.skills.length > 0 ||
                     content.projects.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-lg font-medium mb-2">开始填写您的简历</p>
          <p className="text-sm">在左侧面板添加您的信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.personalInfo.name || '您的姓名'}</h1>
        <div className="text-xl text-blue-600 font-medium mb-3">{content.personalInfo.title || '职位标题'}</div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {content.personalInfo.email && <span>📧 {content.personalInfo.email}</span>}
          {content.personalInfo.phone && <span>📱 {content.personalInfo.phone}</span>}
          {content.personalInfo.location && <span>📍 {content.personalInfo.location}</span>}
        </div>
      </div>

      {content.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-600">
            个人简介
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{content.summary}</p>
        </div>
      )}

      {content.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-600">
            工作经历
          </h2>
          {content.workExperience.map((item) => (
            <div key={item.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <div className="font-semibold text-gray-900">{item.position}</div>
                <div className="text-sm text-gray-500">
                  {item.startDate} - {item.current ? '至今' : item.endDate}
                </div>
              </div>
              <div className="text-sm text-blue-600 mb-1">{item.company}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </div>
          ))}
        </div>
      )}

      {content.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-600">
            教育背景
          </h2>
          {content.education.map((item) => (
            <div key={item.id} className="mb-3">
              <div className="flex justify-between">
                <div className="font-semibold text-gray-900">{item.school}</div>
                <div className="text-sm text-gray-500">
                  {item.startDate} - {item.endDate}
                </div>
              </div>
              <div className="text-sm text-blue-600">
                {item.major} · {item.degree}
              </div>
            </div>
          ))}
        </div>
      )}

      {content.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-600">
            专业技能
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {content.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-600">
            项目经验
          </h2>
          {content.projects.map((item: any) => (
            <div key={item.id} className="mb-4">
              <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
              <div className="text-sm text-gray-600 mb-2">{item.description}</div>
              <div className="flex flex-wrap gap-1">
                {item.technologies?.map((tech: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
