declare module 'html2pdf.js' {
  interface Html2Pdf {
    set(options: any): Html2Pdf;
    from(element: HTMLElement): Html2Pdf;
    save(): Promise<void>;
  }

  interface Html2PdfStatic {
    (options?: any): Html2Pdf;
  }

  const html2pdf: Html2PdfStatic;
  export default html2pdf;
}
