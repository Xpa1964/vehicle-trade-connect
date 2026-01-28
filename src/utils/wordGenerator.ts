import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, HeadingLevel, AlignmentType, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import type { AuditData } from './auditDataGenerator';

export const generateWord = async (data: AuditData) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'AUDITORÍA DE SEGURIDAD, QA Y UI/UX',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: 'KONTACT VO',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Fecha: ${new Date(data.metadata.generatedAt).toLocaleDateString('es-ES')}`,
                bold: true
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Executive Summary
          new Paragraph({
            text: 'RESUMEN EJECUTIVO',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Puntuación General: ', bold: true }),
              new TextRun({ text: `${data.scores.total}/100` })
            ],
            spacing: { after: 200 }
          }),

          // Scores Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Categoría', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Puntuación', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Objetivo', bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Seguridad')] }),
                  new TableCell({ children: [new Paragraph(`${data.scores.security}/100`)] }),
                  new TableCell({ children: [new Paragraph('90/100')] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('UI/UX')] }),
                  new TableCell({ children: [new Paragraph(`${data.scores.uiux}/100`)] }),
                  new TableCell({ children: [new Paragraph('85/100')] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('QA/Testing')] }),
                  new TableCell({ children: [new Paragraph(`${data.scores.qa}/100`)] }),
                  new TableCell({ children: [new Paragraph('80/100')] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Accesibilidad')] }),
                  new TableCell({ children: [new Paragraph(`${data.scores.accessibility}/100`)] }),
                  new TableCell({ children: [new Paragraph('90/100')] })
                ]
              })
            ]
          }),

          // Security Section
          new Paragraph({
            text: 'ANÁLISIS DE SEGURIDAD',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: 'Fortalezas Identificadas',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          ...data.security.strengths.map(strength => 
            new Paragraph({
              text: `• ${strength.area}: ${strength.description} (Impacto: ${strength.impact})`,
              spacing: { after: 100 }
            })
          ),

          new Paragraph({
            text: 'Vulnerabilidades Detectadas',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
          }),
          ...data.security.vulnerabilities.map(vuln => 
            new Paragraph({
              text: `• [${vuln.priority}] ${vuln.finding} - ${vuln.location}`,
              spacing: { after: 100 }
            })
          ),

          // UI/UX Section
          new Paragraph({
            text: 'ANÁLISIS UI/UX',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          ...data.uiux.strengths.map(strength => 
            new Paragraph({
              text: `• ${strength.area}: ${strength.description} (${strength.rating}/5 ⭐)`,
              spacing: { after: 100 }
            })
          ),

          // QA Section
          new Paragraph({
            text: 'ANÁLISIS QA',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          ...data.qa.weaknesses.map(weakness => 
            new Paragraph({
              text: `• [${weakness.priority}] ${weakness.problem} - Impacto: ${weakness.impact}`,
              spacing: { after: 100 }
            })
          ),

          // Recommendations
          new Paragraph({
            text: 'RECOMENDACIONES GENERALES',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          ...data.security.recommendations.map(rec => 
            new Paragraph({
              text: `• ${rec}`,
              spacing: { after: 100 }
            })
          )
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `KONTACT-VO-Auditoria-${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
};
