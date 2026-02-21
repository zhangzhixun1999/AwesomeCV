import { useRef, useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { ResumeContent } from '@/types';
import { useExportPDF } from '@/hooks/useExportPDF';
import { ResumePreviewContent } from './ResumePreviewContent';

interface ResumePDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ResumeContent;
  title: string;
}

export const ResumePDFModal = ({
  isOpen,
  onClose,
  content,
  title,
}: ResumePDFModalProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { exportPDF, isExporting } = useExportPDF();
  const [zoom, setZoom] = useState(100);

  const handleDownload = async () => {
    if (previewRef.current) {
      try {
        await exportPDF(previewRef.current, title);
        // 下载成功后关闭Modal
        onClose();
      } catch (error) {
        alert('PDF 生成失败，请重试');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden">
        {/* Left: Preview Area */}
        <div className="flex-1 bg-gray-100 overflow-auto flex flex-col">
          {/* Preview Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                disabled={isExporting}
              >
                −
              </button>
              <span className="min-w-[50px] text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                disabled={isExporting}
              >
                +
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              disabled={isExporting}
            >
              <X size={20} />
            </button>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-8 flex justify-center">
            <div
              ref={previewRef}
              className="bg-white shadow-lg w-[210mm] min-h-[297mm] origin-top transition-transform"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              <ResumePreviewContent content={content} />
            </div>
          </div>
        </div>

        {/* Right: Action Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-6 flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">导出简历</h3>
            <p className="text-sm text-gray-600 mb-6">
              预览简历内容并下载为 PDF 文件
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">文件信息</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>文件名: <span className="font-medium">{title}</span></p>
                  <p>格式: PDF</p>
                  <p>尺寸: A4 (210 × 297 mm)</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">提示</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 点击下载按钮生成 PDF</li>
                  <li>• 生成时间取决于内容大小</li>
                  <li>• 请保持网络连接稳定</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 space-y-3">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
            >
              {isExporting ? (
                <>
                  <Loader2 size={18} className="spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download size={18} />
                  下载 PDF
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isExporting}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
