import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useResumes, useDeleteResume } from '@/hooks/useResumes';
import { Button, Card } from '@/components/ui';
import { useState } from 'react';
import { ResumePDFModal } from '@/components/ResumePDFModal';

// 简历预览组件
const ResumePreview = ({ resume }: { resume: any }) => {
  // 安全处理 content：如果是字符串则解析，如果是 undefined 则使用默认值
  const content = resume.content
    ? (typeof resume.content === 'string' ? JSON.parse(resume.content) : resume.content)
    : {
        personalInfo: { name: '', title: '', email: '', phone: '' },
        summary: '',
        workExperience: [],
      };

  const { personalInfo = {}, workExperience = [] } = content;

  return (
    <div className="w-full h-full bg-white p-2 text-[8px] overflow-hidden">
      {/* Header */}
      <div className="rounded-t-lg -mx-2 -mt-2 px-2 pt-1 pb-1 mb-1 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xs font-bold text-gray-900 truncate mb-0.5">
          {personalInfo.name || '您的姓名'}
        </h3>
        <p className="text-gray-600 text-[8px] truncate">
          {personalInfo.title || '职位标题'}
        </p>
      </div>

      {/* Work Experience - 只显示第一条 */}
      {workExperience && workExperience.length > 0 && (
        <div className="mb-1">
          <div className="border-l-2 border-gray-200 pl-1">
            <div className="font-medium text-gray-900 text-[8px]">{workExperience[0].position}</div>
            <div className="text-gray-500 text-[8px]">{workExperience[0].company}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: resumes, isLoading, error } = useResumes();
  const deleteResumeMutation = useDeleteResume();

  // PDF Modal 状态
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-primary rounded-full spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">加载简历中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">加载简历失败: {error.message}</p>
        <Button onClick={() => window.location.reload()}>重新加载</Button>
      </div>
    );
  }

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`确定要删除"${title}"吗？此操作无法撤销。`)) {
      await deleteResumeMutation.mutateAsync(id);
    }
  };

  const handleEdit = (id: number) => navigate(`/editor/${id}`);

  const handlePrint = (resume: any) => {
    // 打开 PDF 预览和下载 Modal
    setSelectedResume(resume);
    setIsPDFModalOpen(true);
  };

  const getTemplateName = (templateId: string) => {
    const names: Record<string, string> = {
      modern: '现代风格',
      classic: '经典风格',
      creative: '创意风格',
    };
    return names[templateId] || '未知模板';
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">我的简历</h1>
        <p className="text-gray-500 text-sm">管理您的所有简历</p>
      </div>

      {/* Empty State */}
      {!resumes || resumes.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-6xl mb-4 opacity-30">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            还没有任何简历
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            创建您的第一个专业简历吧
          </p>
          <Link to="/templates">
            <Button>
              <Plus size={20} />
              创建新简历
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Create New Resume Card */}
          <Card noPadding className="group hover:shadow-lg transition-all">
            <Link
              to="/templates"
              className="aspect-[4/5] flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors"
            >
              <Plus size={24} />
              <span className="mt-1 text-xs">创建新简历</span>
            </Link>
            {/* Empty Action Area to match resume cards height */}
            <div className="px-1 py-0.5 bg-white border-t border-gray-100 invisible">
              <h3 className="font-medium text-gray-900 truncate text-[8px]">
                占位标题占位标题
              </h3>
              <div className="flex gap-0.5 mt-0.5">
                <div className="flex-1 text-[7px] text-center">编辑</div>
                <div className="flex-1 text-[7px] text-center">PDF</div>
                <div className="flex-1 text-[7px] text-center">删除</div>
              </div>
            </div>
          </Card>

          {/* Resume Cards */}
          {resumes.map((resume) => (
            <Card key={resume.id} noPadding className="group hover:shadow-lg transition-all">
              {/* Preview Area */}
              <div
                onClick={handleEdit.bind(null, resume.id)}
                className="aspect-[4/5] relative overflow-hidden cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <ResumePreview resume={resume} />
                <span className="absolute top-2 right-2 bg-white/95 backdrop-blur text-gray-900 px-1 py-0.5 rounded text-[7px] font-medium shadow-sm">
                  {getTemplateName(resume.template_id)}
                </span>
              </div>

              {/* Action Area */}
              <div className="px-1 py-0.5 bg-white border-t border-gray-100">
                <h3 className="font-medium text-gray-900 truncate text-[8px]">
                  {resume.title}
                </h3>
                <div className="flex gap-0.5 mt-0.5">
                  <button
                    onClick={handleEdit.bind(null, resume.id)}
                    className="flex-1 py-0.5 text-[7px] text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handlePrint(resume)}
                    className="flex-1 py-0.5 text-[7px] text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id, resume.title)}
                    disabled={deleteResumeMutation.isPending}
                    className="flex-1 py-0.5 text-[7px] text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* PDF Export Modal */}
      {selectedResume && (
        <ResumePDFModal
          isOpen={isPDFModalOpen}
          onClose={() => {
            setIsPDFModalOpen(false);
            setSelectedResume(null);
          }}
          content={selectedResume.content}
          title={selectedResume.title}
        />
      )}
    </div>
  );
};

export default Dashboard;
