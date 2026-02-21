import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Copy, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button, Input, TextArea, Card } from '@/components/ui';
import { useResume, useUpdateResume, useCreateResume, useTemplates, useDuplicateResume } from '@/hooks';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import { ResumeContent, PersonalInfo, WorkExperience, Education } from '@/types';

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template') || 'modern';

  const isNew = id === 'new';
  const { data: templates } = useTemplates();
  const template = templates?.find(t => t.id === templateId);

  // 只在编辑现有简历时加载数据
  const { data: resume, isLoading } = useResume(
    !isNew ? parseInt(id || '0') : 0
  );
  const updateResume = useUpdateResume();
  const createResume = useCreateResume();

  // 初始化内容：使用模板默认内容或空内容
  const getInitialContent = (): ResumeContent => {
    if (isNew && template) {
      return template.defaultContent;
    }
    return {
      personalInfo: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
      },
      summary: '',
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
    };
  };

  const [title, setTitle] = useState('我的简历');
  const [content, setContent] = useState<ResumeContent>(getInitialContent());
  const [activeTab, setActiveTab] = useState('personal');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  useEffect(() => {
    if (resume && !isNew && resume.content) {
      setTitle(resume.title);
      setContent(resume.content);
    }
  }, [resume, isNew]);

  // 新简历时使用模板内容
  useEffect(() => {
    if (isNew && template) {
      setContent(template.defaultContent);
      setTitle(`我的${template.name}简历`);
    }
  }, [isNew, template]);


  // 手动保存函数 - 保存后跳转到Dashboard
  const handleManualSave = async () => {
    setSaveStatus('saving');
    try {
      if (isNew) {
        // 新简历：先创建，然后跳转到Dashboard
        await createResume.mutateAsync({
          title,
          template_id: templateId,
          content,
        });
        // 创建成功后跳转到Dashboard
        window.location.href = '/dashboard';
      } else {
        // 已存在的简历：更新后跳转到Dashboard
        await updateResume.mutateAsync({
          id: parseInt(id!),
          title,
          template_id: templateId,
          content,
        });
        setSaveStatus('saved');
        // 保存成功后跳转到Dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 300);
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
      setSaveStatus('unsaved');
    }
  };

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setContent({
      ...content,
      personalInfo: { ...content.personalInfo, [field]: value },
    });
    setSaveStatus('unsaved');
  };

  const handleSummaryChange = (value: string) => {
    setContent({ ...content, summary: value });
    setSaveStatus('unsaved');
  };

  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsTitle, setSaveAsTitle] = useState('');
  const duplicateResume = useDuplicateResume();

  const handleSaveAs = async () => {
    if (!saveAsTitle.trim()) {
      alert('请输入简历标题');
      return;
    }

    // 新建简历时直接创建，不是另存为
    if (isNew) {
      alert('新建简历请使用"保存"按钮');
      return;
    }

    try {
      await duplicateResume.mutateAsync({
        id: parseInt(id || '0'),
        title: saveAsTitle,
      });

      // 跳转到我的简历页面
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('另存为失败:', error);
      alert('另存为失败，请重试');
    }
  };

  if (isLoading && !isNew) {
    return <Loading text="加载简历中..." className="min-h-screen" />;
  }

  const handleClose = () => {
    if (saveStatus === 'unsaved') {
      if (confirm('您有未保存的修改，确定要关闭吗？')) {
        window.location.href = '/dashboard';
      }
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Left Editor Panel */}
      <div className="w-full md:w-[400px] lg:w-[500px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base font-medium border-0 px-0 focus:ring-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <SaveStatus status={saveStatus} />
            <button
              onClick={handleManualSave}
              disabled={saveStatus === 'saving'}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1.5 font-medium transition-colors"
            >
              <Save size={14} />
              保存
            </button>
            {!isNew && (
              <button
                onClick={() => {
                  setSaveAsTitle(`${title} - 副本`);
                  setShowSaveAsModal(true);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 whitespace-nowrap flex items-center gap-1.5 font-medium transition-colors"
              >
                <Copy size={14} />
                另存为
              </button>
            )}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1.5"
              title="关闭"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Save As Modal */}
        {showSaveAsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">另存为</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    简历标题
                  </label>
                  <Input
                    value={saveAsTitle}
                    onChange={(e) => setSaveAsTitle(e.target.value)}
                    placeholder="输入新简历标题"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => setShowSaveAsModal(false)}
                  >
                    取消
                  </Button>
                  <Button onClick={handleSaveAs} disabled={duplicateResume.isPending}>
                    {duplicateResume.isPending ? '保存中...' : '保存'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'personal', label: '个人信息' },
            { id: 'work', label: '工作经历' },
            { id: 'education', label: '教育背景' },
            { id: 'skills', label: '技能' },
            { id: 'projects', label: '项目' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'personal' && (
            <PersonalInfoSection
              personalInfo={content.personalInfo}
              summary={content.summary}
              onPersonalInfoChange={handlePersonalInfoChange}
              onSummaryChange={handleSummaryChange}
            />
          )}

          {activeTab === 'work' && (
            <WorkExperienceSection
              data={content.workExperience}
              onChange={(workExperience) => {
                setContent({ ...content, workExperience });
                setSaveStatus('unsaved');
              }}
            />
          )}

          {activeTab === 'education' && (
            <EducationSection
              data={content.education}
              onChange={(education) => {
                setContent({ ...content, education });
                setSaveStatus('unsaved');
              }}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsSection
              data={content.skills}
              onChange={(skills) => {
                setContent({ ...content, skills });
                setSaveStatus('unsaved');
              }}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsSection
              data={content.projects}
              onChange={(projects) => {
                setContent({ ...content, projects });
                setSaveStatus('unsaved');
              }}
            />
          )}
        </div>
      </div>

      {/* Right Preview Panel */}
      <PreviewPanel content={content} />
    </div>
  );
};

// Sub-components
const SaveStatus = ({ status }: { status: 'saved' | 'saving' | 'unsaved' }) => {
  const statusMap = {
    saved: { text: '已保存', color: 'text-green-600' },
    saving: { text: '保存中...', color: 'text-gray-400' },
    unsaved: { text: '未保存', color: 'text-gray-400' },
  };

  return (
    <span className={`text-[10px] font-medium ${statusMap[status].color} whitespace-nowrap`}>
      {statusMap[status].text}
    </span>
  );
};

const PersonalInfoSection = ({
  personalInfo,
  summary,
  onPersonalInfoChange,
  onSummaryChange,
}: {
  personalInfo: PersonalInfo;
  summary: string;
  onPersonalInfoChange: (field: keyof PersonalInfo, value: string) => void;
  onSummaryChange: (value: string) => void;
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
        基本信息
      </h3>
      <div className="space-y-4">
        <Input
          label="姓名"
          value={personalInfo.name}
          onChange={(e) => onPersonalInfoChange('name', e.target.value)}
          placeholder="张三"
        />
        <Input
          label="职位标题"
          value={personalInfo.title}
          onChange={(e) => onPersonalInfoChange('title', e.target.value)}
          placeholder="例如：高级软件工程师"
        />
        <Input
          label="邮箱"
          type="email"
          value={personalInfo.email}
          onChange={(e) => onPersonalInfoChange('email', e.target.value)}
          placeholder="your@email.com"
        />
        <Input
          label="电话"
          value={personalInfo.phone}
          onChange={(e) => onPersonalInfoChange('phone', e.target.value)}
          placeholder="+86 138-0000-0000"
        />
        <Input
          label="地址"
          value={personalInfo.location}
          onChange={(e) => onPersonalInfoChange('location', e.target.value)}
          placeholder="城市，省份"
        />
      </div>
    </div>

    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
        自我介绍
      </h3>
      <TextArea
        value={summary}
        onChange={(e) => onSummaryChange(e.target.value)}
        placeholder="简要介绍您的专业背景和职业目标..."
        rows={4}
      />
    </div>
  </div>
);

const WorkExperienceSection = ({
  data,
  onChange,
}: {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
        工作经历
      </h3>

      <div className="space-y-4">
        {data.map((item, index) => (
          <Card key={item.id} className="p-4">
            {editingIndex === index ? (
              <WorkExperienceEditForm
                item={item}
                onSave={(updatedItem) => {
                  const newData = [...data];
                  newData[index] = updatedItem;
                  onChange(newData);
                  setEditingIndex(null);
                }}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-gray-900">{item.position}</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        const newData = [...data];
                        newData.splice(index, 1);
                        onChange(newData);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {item.company} · {item.startDate} - {item.current ? '至今' : item.endDate}
                </div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </>
            )}
          </Card>
        ))}
      </div>

      <button
        onClick={() => {
          onChange([
            ...data,
            {
              id: Date.now().toString(),
              company: '',
              position: '',
              startDate: '',
              endDate: '',
              current: false,
              description: '',
            },
          ]);
          setEditingIndex(data.length);
        }}
        className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-primary hover:text-primary hover:bg-gray-50 transition-colors text-sm"
      >
        <Plus size={20} className="inline mr-2" />
        添加工作经历
      </button>
    </div>
  );
};

const WorkExperienceEditForm = ({
  item,
  onSave,
  onCancel,
}: {
  item: WorkExperience;
  onSave: (item: WorkExperience) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-3">
      <Input
        label="公司"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        placeholder="公司名称"
      />
      <Input
        label="职位"
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        placeholder="职位标题"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="开始日期"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          placeholder="2020-01"
        />
        <Input
          label="结束日期"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          placeholder="2022-12"
          disabled={formData.current}
        />
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.current}
          onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-gray-600">目前在职</span>
      </label>
      <TextArea
        label="工作描述"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="描述您的工作职责和成就..."
        rows={3}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(formData)}>
          保存
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          取消
        </Button>
      </div>
    </div>
  );
};

const EducationSection = ({
  data,
  onChange,
}: {
  data: Education[];
  onChange: (data: Education[]) => void;
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
        教育背景
      </h3>

      <div className="space-y-4">
        {data.map((item, index) => (
          <Card key={item.id} className="p-4">
            {editingIndex === index ? (
              <EducationEditForm
                item={item}
                onSave={(updatedItem) => {
                  const newData = [...data];
                  newData[index] = updatedItem;
                  onChange(newData);
                  setEditingIndex(null);
                }}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-gray-900">{item.school}</div>
                  <button
                    onClick={() => {
                      const newData = [...data];
                      newData.splice(index, 1);
                      onChange(newData);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {item.major} · {item.degree} · {item.startDate} - {item.endDate}
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      <button
        onClick={() => {
          onChange([
            ...data,
            {
              id: Date.now().toString(),
              school: '',
              degree: '',
              major: '',
              startDate: '',
              endDate: '',
            },
          ]);
          setEditingIndex(data.length);
        }}
        className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-primary hover:text-primary hover:bg-gray-50 transition-colors text-sm"
      >
        <Plus size={20} className="inline mr-2" />
        添加教育经历
      </button>
    </div>
  );
};

const EducationEditForm = ({
  item,
  onSave,
  onCancel,
}: {
  item: Education;
  onSave: (item: Education) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(item);

  return (
    <div className="space-y-3">
      <Input
        label="学校"
        value={formData.school}
        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
        placeholder="学校名称"
      />
      <Input
        label="学位"
        value={formData.degree}
        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
        placeholder="学士/硕士/博士"
      />
      <Input
        label="专业"
        value={formData.major}
        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
        placeholder="专业名称"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="开始日期"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          placeholder="2016-09"
        />
        <Input
          label="结束日期"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          placeholder="2020-06"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(formData)}>
          保存
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          取消
        </Button>
      </div>
    </div>
  );
};

const SkillsSection = ({
  data,
  onChange,
}: {
  data: string[];
  onChange: (data: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = () => {
    if (inputValue.trim()) {
      onChange([...data, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
        专业技能
      </h3>

      <div className="mb-4">
        <Input
          label="技能标签（按回车添加）"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入技能后按回车添加"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {data.map((skill, index) => (
          <Badge key={index} variant="default" onRemove={() => {
            const newData = [...data];
            newData.splice(index, 1);
            onChange(newData);
          }}>
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const ProjectsSection = ({
  data,
  onChange,
}: {
  data: any[];
  onChange: (data: any[]) => void;
}) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 pb-2 border-b border-gray-200">
      项目经验
    </h3>

    <div className="space-y-4">
      {data.map((item, index) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="font-medium text-gray-900">{item.name}</div>
            <button
              onClick={() => {
                const newData = [...data];
                newData.splice(index, 1);
                onChange(newData);
              }}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-2">{item.description}</div>
          <div className="flex flex-wrap gap-1">
            {item.technologies?.map((tech: string, i: number) => (
              <Badge key={i} variant="secondary">{tech}</Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>

    <button
      onClick={() => {
        onChange([
          ...data,
          {
            id: Date.now().toString(),
            name: '',
            description: '',
            technologies: [],
            startDate: '',
            endDate: '',
          },
        ]);
      }}
      className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-primary hover:text-primary hover:bg-gray-50 transition-colors text-sm"
    >
      <Plus size={20} className="inline mr-2" />
      添加项目
    </button>
  </div>
);

const PreviewPanel = ({ content }: { content: ResumeContent }) => {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="hidden md:flex flex-1 flex-col overflow-hidden bg-gray-50">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            −
          </button>
          <span>{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(150, zoom + 10))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div
          className="bg-white shadow-lg w-[210mm] min-h-[297mm] p-10 origin-top transition-transform"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          <ResumePreview content={content} />
        </div>
      </div>
    </div>
  );
};

const ResumePreview = ({ content }: { content: ResumeContent }) => {
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
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.personalInfo.name || '您的姓名'}</h1>
        <div className="text-xl text-primary font-medium mb-3">{content.personalInfo.title || '职位标题'}</div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {content.personalInfo.email && <span>📧 {content.personalInfo.email}</span>}
          {content.personalInfo.phone && <span>📱 {content.personalInfo.phone}</span>}
          {content.personalInfo.location && <span>📍 {content.personalInfo.location}</span>}
        </div>
      </div>

      {content.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-primary">
            个人简介
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{content.summary}</p>
        </div>
      )}

      {content.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-primary">
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
              <div className="text-sm text-primary mb-1">{item.company}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </div>
          ))}
        </div>
      )}

      {content.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-primary">
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
              <div className="text-sm text-primary">
                {item.major} · {item.degree}
              </div>
            </div>
          ))}
        </div>
      )}

      {content.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-primary">
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
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b-2 border-primary">
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
    </>
  );
};

export default Editor;
