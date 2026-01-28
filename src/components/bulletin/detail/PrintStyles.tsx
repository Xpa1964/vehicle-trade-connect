import React from 'react';

const PrintStyles: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        @media print {
          /* Hide all non-printable elements */
          .print\\:hidden {
            display: none !important;
          }
          
          /* Show print-only elements */
          .print\\:block {
            display: block !important;
          }
          
          /* Page setup */
          @page {
            margin: 1.5cm;
            size: A4;
          }
          
          body {
            font-size: 12pt !important;
            line-height: 1.6 !important;
            color: #000 !important;
            background: white !important;
          }
          
          /* Article styling */
          article {
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
          
          /* Typography */
          h1, h2, h3, h4, h5, h6 {
            color: #000 !important;
            page-break-after: avoid;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }
          
          .prose h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            text-align: center;
            margin-bottom: 1em;
          }
          
          .prose h2 {
            font-size: 18pt !important;
            font-weight: bold !important;
          }
          
          .prose h3 {
            font-size: 16pt !important;
            font-weight: bold !important;
          }
          
          /* Content styling */
          .prose {
            font-size: 11pt !important;
            line-height: 1.6 !important;
            color: #000 !important;
          }
          
          /* Images */
          img {
            max-width: 100% !important;
            height: auto !important;
            page-break-inside: avoid;
            margin: 1em 0;
          }
          
          /* Attachments */
          .attachment-list {
            page-break-inside: avoid;
            margin-top: 2em;
            padding: 1em;
            border: 1px solid #ddd;
            border-radius: 0.5em;
          }
          
          /* Headers and footers */
          .print-header {
            text-align: center;
            margin-bottom: 2em;
            padding-bottom: 1em;
            border-bottom: 2px solid #ddd;
          }
          
          .print-footer {
            margin-top: 2em;
            padding-top: 1em;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 10pt;
            color: #666;
          }
          
          /* Badges and status */
          .badge {
            background: #f5f5f5 !important;
            color: #000 !important;
            border: 1px solid #ddd !important;
            padding: 0.2em 0.5em;
            border-radius: 0.25em;
            font-size: 9pt;
          }
          
          /* Meta information */
          .meta-info {
            font-size: 10pt !important;
            color: #666 !important;
            margin: 1em 0;
          }
          
          /* Avoid page breaks */
          .no-break {
            page-break-inside: avoid;
          }
          
          /* File attachments in print */
          .file-attachment {
            border: 1px solid #ddd;
            padding: 0.5em;
            margin: 0.5em 0;
            border-radius: 0.25em;
            background: #f9f9f9;
          }
          
          .file-attachment-name {
            font-weight: bold;
            font-size: 10pt;
          }
          
          .file-attachment-size {
            font-size: 9pt;
            color: #666;
          }
          
          /* Logo styling */
          .print-logo {
            max-height: 5rem !important;
            width: auto !important;
          }
          
          /* Company name styling */
          .company-name {
            font-weight: bold !important;
            font-size: 14pt !important;
          }
          
          .company-tagline {
            font-size: 12pt !important;
            color: #666 !important;
          }
          
          /* Contact info */
          .contact-info {
            font-size: 10pt !important;
            color: #666 !important;
            margin: 0.5em 0;
          }
          
          /* Separators */
          hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 1em 0;
          }
          
          /* Gallery images for print */
          .gallery-image {
            max-width: 50% !important;
            display: inline-block !important;
            margin: 0.5em !important;
            page-break-inside: avoid;
          }
          
          /* Ensure proper spacing */
          .space-y-8 > * + * {
            margin-top: 2em !important;
          }
          
          .space-y-6 > * + * {
            margin-top: 1.5em !important;
          }
          
          .space-y-4 > * + * {
            margin-top: 1em !important;
          }
        }
      `
    }} />
  );
};

export default PrintStyles;