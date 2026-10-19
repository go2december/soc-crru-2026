import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import * as fs from 'fs';

interface EducationItem {
  level: string;
  detail: string;
}

interface ResearchProjectItem {
  id?: string | null;
  titleTh?: string | null;
  titleEn?: string | null;
  year?: number | null;
  role?: string | null;
}

interface StaffData {
  id: string;
  prefixTh?: string | null;
  firstNameTh: string;
  lastNameTh: string;
  prefixEn?: string | null;
  firstNameEn?: string | null;
  lastNameEn?: string | null;
  staffType?: string | null;
  academicPosition?: string | null;
  adminPosition?: string | null;
  departmentName?: string | null;
  contactEmail?: string | null;
  education?: EducationItem[] | null;
  expertise?: string[] | null;
  bio?: string | null;
  orcidId?: string | null;
  scopusAuthorId?: string | null;
  googleScholarUrl?: string | null;
  researchProjects?: any[] | null;
  [key: string]: any;
}

@Injectable()
export class PdfResumeService {
  private readonly logger = new Logger(PdfResumeService.name);

  async generateStaffResumePdf(staff: StaffData | any, requestId: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 40,
          info: {
            Title: `CV_${staff.firstNameTh}_${staff.lastNameTh}`,
            Author: 'Faculty of Social Sciences, CRRU',
            Subject: 'Official Speaker Bio & Academic CV',
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Register Thai Fonts
        const fontRegular = path.join(process.cwd(), 'assets', 'fonts', 'tahoma.ttf');
        const fontBold = path.join(process.cwd(), 'assets', 'fonts', 'tahomabd.ttf');

        const hasFontRegular = fs.existsSync(fontRegular);
        const hasFontBold = fs.existsSync(fontBold);

        if (hasFontRegular) {
          doc.registerFont('ThaiRegular', fontRegular);
        }
        if (hasFontBold) {
          doc.registerFont('ThaiBold', fontBold);
        }

        const fontToUseRegular = hasFontRegular ? 'ThaiRegular' : 'Helvetica';
        const fontToUseBold = hasFontBold ? 'ThaiBold' : 'Helvetica-Bold';

        // ------------------ Header Bar with Logos ------------------
        const crruLogoPath = path.join(process.cwd(), 'assets', 'images', 'crru-logo.png');
        const facultyLogoPath = path.join(process.cwd(), 'assets', 'images', 'faculty-logo.png');

        // Header Background Banner
        doc.rect(0, 0, 595.28, 95).fill('#7A102E'); // CRRU Crimson theme
        doc.rect(0, 93, 595.28, 4).fill('#E07A5F'); // Accent border

        let headerTextX = 40;

        // Render CRRU Logo if available
        if (fs.existsSync(crruLogoPath)) {
          try {
            doc.image(crruLogoPath, 40, 12, { width: 50, height: 70 });
            headerTextX = 100;
          } catch (e) {
            this.logger.warn('Could not render CRRU logo in PDF', e);
          }
        }

        // Render Faculty Logo on top right if available
        if (fs.existsSync(facultyLogoPath)) {
          try {
            doc.image(facultyLogoPath, 595.28 - 40 - 55, 18, { width: 55, height: 55 });
          } catch (e) {
            this.logger.warn('Could not render Faculty logo in PDF', e);
          }
        }

        doc
          .font(fontToUseBold)
          .fontSize(16)
          .fillColor('#FFFFFF')
          .text('คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย', headerTextX, 22, { align: 'left' });

        doc
          .font(fontToUseRegular)
          .fontSize(10.5)
          .fillColor('#FCE7F3')
          .text('Faculty of Social Sciences, Chiang Rai Rajabhat University', headerTextX, 45, { align: 'left' });

        doc
          .font(fontToUseRegular)
          .fontSize(8.5)
          .fillColor('#FED7AA')
          .text(`เอกสารประวัติวิทยากรและผลงานทางวิชาการฉบับทางการ (Official Speaker Bio & CV) | รหัสคำร้อง: ${requestId}`, headerTextX, 62, { align: 'left' });

        // ------------------ Personal Info ------------------
        const startY = 118;
        doc.y = startY;

        const fullNameTh = [staff.prefixTh, staff.firstNameTh, staff.lastNameTh].filter(Boolean).join(' ');
        const fullNameEn = [staff.prefixEn, staff.firstNameEn, staff.lastNameEn].filter(Boolean).join(' ');

        doc
          .font(fontToUseBold)
          .fontSize(15)
          .fillColor('#1E293B')
          .text(fullNameTh, 40, doc.y);

        if (fullNameEn) {
          doc
            .font(fontToUseRegular)
            .fontSize(11)
            .fillColor('#64748B')
            .text(fullNameEn);
        }

        doc.moveDown(0.4);

        // Positions & Department
        const positionText = [staff.adminPosition, staff.academicPosition].filter(Boolean).join(' • ');
        if (positionText) {
          doc
            .font(fontToUseBold)
            .fontSize(10)
            .fillColor('#85193C')
            .text(`ตำแหน่ง: ${positionText}`);
        }

        const deptName = staff.departmentName || staff.department;
        if (deptName) {
          doc
            .font(fontToUseRegular)
            .fontSize(10)
            .fillColor('#334155')
            .text(`สังกัด: ${deptName} คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย`);
        }

        if (staff.contactEmail) {
          doc
            .font(fontToUseRegular)
            .fontSize(9)
            .fillColor('#0284C7')
            .text(`อีเมลติดต่อทางราชการ: ${staff.contactEmail}`);
        }

        doc.moveDown(0.8);

        // Divider
        doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(0.6);

        // ------------------ Education ------------------
        if (staff.education && staff.education.length > 0) {
          doc
            .font(fontToUseBold)
            .fontSize(11)
            .fillColor('#1E293B')
            .text('ประวัติการศึกษา (Education)');
          doc.moveDown(0.2);

          for (const edu of staff.education) {
            const levelLabel =
              edu.level === 'DOCTORAL' ? 'ปริญญาเอก (Ph.D.)' :
              edu.level === 'MASTER' ? 'ปริญญาโท (Master)' : 'ปริญญาตรี (Bachelor)';
            doc
              .font(fontToUseRegular)
              .fontSize(9.5)
              .fillColor('#334155')
              .text(`• ${levelLabel}: ${edu.detail}`, { indent: 10 });
          }
          doc.moveDown(0.6);
        }

        // ------------------ Expertise ------------------
        if (staff.expertise && staff.expertise.length > 0) {
          doc
            .font(fontToUseBold)
            .fontSize(11)
            .fillColor('#1E293B')
            .text('สาขาความเชี่ยวชาญ (Areas of Expertise)');
          doc.moveDown(0.2);

          const expText = staff.expertise.join('  •  ');
          doc
            .font(fontToUseRegular)
            .fontSize(9.5)
            .fillColor('#334155')
            .text(expText, { indent: 10, lineGap: 3 });
          doc.moveDown(0.6);
        }

        // ------------------ Bio / Vision ------------------
        if (staff.bio) {
          doc
            .font(fontToUseBold)
            .fontSize(11)
            .fillColor('#1E293B')
            .text('ประวัติและผลงานวิชาการโดยสังเขป (Biography)');
          doc.moveDown(0.2);

          doc
            .font(fontToUseRegular)
            .fontSize(9)
            .fillColor('#475569')
            .text(staff.bio, { indent: 10, lineGap: 3 });
          doc.moveDown(0.6);
        }

        // ------------------ Research Identifiers ------------------
        const hasIdentifiers = staff.scopusAuthorId || staff.orcidId || staff.googleScholarUrl;
        if (hasIdentifiers) {
          doc
            .font(fontToUseBold)
            .fontSize(11)
            .fillColor('#1E293B')
            .text('ฐานข้อมูลผลงานวิชาการระดับสากล (Academic Identifiers)');
          doc.moveDown(0.2);

          if (staff.scopusAuthorId) {
            doc
              .font(fontToUseRegular)
              .fontSize(9)
              .fillColor('#334155')
              .text(`• Scopus Author ID: ${staff.scopusAuthorId}`, { indent: 10 });
          }
          if (staff.orcidId) {
            doc
              .font(fontToUseRegular)
              .fontSize(9)
              .fillColor('#334155')
              .text(`• ORCID iD: ${staff.orcidId}`, { indent: 10 });
          }
          if (staff.googleScholarUrl) {
            doc
              .font(fontToUseRegular)
              .fontSize(9)
              .fillColor('#0284C7')
              .text(`• Google Scholar: ${staff.googleScholarUrl}`, { indent: 10 });
          }
          doc.moveDown(0.6);
        }

        // ------------------ Research Projects ------------------
        if (staff.researchProjects && staff.researchProjects.length > 0) {
          doc
            .font(fontToUseBold)
            .fontSize(11)
            .fillColor('#1E293B')
            .text('โครงการวิจัยและงานวิชาการ (Research Projects)');
          doc.moveDown(0.2);

          for (const proj of staff.researchProjects) {
            const title = proj.titleTh || proj.titleEn || 'โครงการวิจัย';
            const yearStr = proj.year ? `(พ.ศ. ${proj.year})` : '';
            const roleStr = proj.role === 'HEAD' ? '[หัวหน้าโครงการ]' : proj.role === 'CO_RESEARCHER' ? '[ผู้ร่วมวิจัย]' : proj.role ? `[${proj.role}]` : '';
            doc
              .font(fontToUseRegular)
              .fontSize(9)
              .fillColor('#334155')
              .text(`• ${title} ${yearStr} ${roleStr}`, { indent: 10, lineGap: 2 });
          }
          doc.moveDown(0.6);
        }

        // ------------------ Academic Services ------------------
        if (staff.academicServices && staff.academicServices.length > 0) {
          doc
            .font(fontToUseBold)
            .fontSize(11)
            .fillColor('#1E293B')
            .text('ผลงานบริการวิชาการและพัฒนาชุมชนท้องถิ่น (Academic & Social Services)');
          doc.moveDown(0.2);

          for (const srv of staff.academicServices) {
            const title = srv.title || 'โครงการบริการวิชาการ';
            const areaStr = srv.area ? `(พื้นที่: ${srv.area})` : '';
            const roleStr = srv.role === 'LEADER' ? '[หัวหน้าโครงการ]' : '[ผู้ร่วมโครงการ]';
            doc
              .font(fontToUseRegular)
              .fontSize(9)
              .fillColor('#334155')
              .text(`• ${title} ${areaStr} ${roleStr}`, { indent: 10, lineGap: 2 });
          }
          doc.moveDown(0.6);
        }

        // ------------------ PDPA & Institutional Footer ------------------
        const footerY = 770;
        doc.rect(40, footerY - 5, 515, 45).fill('#F8FAFC');

        doc
          .font(fontToUseBold)
          .fontSize(8)
          .fillColor('#991B1B')
          .text(
            'ข้อความคุ้มครองข้อมูลส่วนบุคคล (PDPA Notice):',
            50,
            footerY,
          );

        doc
          .font(fontToUseRegular)
          .fontSize(7.5)
          .fillColor('#64748B')
          .text(
            'เอกสารนี้ออกโดยสำนักงานคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย เพื่อใช้ประโยชน์ตามวัตถุประสงค์ในคำขอทางการเท่านั้น ห้ามทำซ้ำ ดัดแปลง หรือเผยแพร่แก่บุคคลที่สามโดยไม่ได้รับอนุญาต',
            50,
            footerY + 11,
            { width: 495 },
          );

        doc
          .font(fontToUseRegular)
          .fontSize(7.5)
          .fillColor('#94A3B8')
          .text(
            `ออกเอกสารเมื่อ: ${new Date().toLocaleDateString('th-TH')} | ติดต่อสอบถาม: socialsciences@crru.ac.th`,
            50,
            footerY + 23,
          );

        doc.end();
      } catch (err) {
        this.logger.error('Failed to generate staff resume PDF:', err);
        reject(err);
      }
    });
  }
}
