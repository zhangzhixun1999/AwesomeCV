import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export const useExportPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async (element: HTMLElement, filename: string) => {
    setIsExporting(true);
    const opt = {
      margin: 0,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait' as const,
      },
    };

    try {
      await html2pdf().set(opt).from(element).save();
      return true;
    } catch (error) {
      console.error('PDF 导出失败:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportPDF, isExporting };
};
