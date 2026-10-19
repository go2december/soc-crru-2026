import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import * as fs from 'fs';

interface EducationItem {
  level?: string | null;
  detail?: string | null;
}

interface ResearchProjectItem {
  id?: string | null;
  titleTh?: string | null;
  titleEn?: string | null;
  year?: number | null;
  role?: string | null;
}

interface AcademicServiceItem {
  id?: string | null;
  title?: string | null;
  area?: string | null;
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
  department?: string | null;
  contactEmail?: string | null;
  education?: EducationItem[] | null;
  expertise?: string[] | null;
  bio?: string | null;
  imageUrl?: string | null;
  orcidId?: string | null;
  scopusAuthorId?: string | null;
  googleScholarUrl?: string | null;
  researchProjects?: ResearchProjectItem[] | null;
  academicServices?: AcademicServiceItem[] | null;
  [key: string]: any;
}

@Injectable()
export class PdfResumeService {
  private readonly logger = new Logger(PdfResumeService.name);

  private resolveAssetPath(relativePath: string): string | null {
    const candidates = [
      path.join(__dirname, '..', '..', '..', 'assets', relativePath),
      path.join(__dirname, '..', '..', 'assets', relativePath),
      path.join(__dirname, '..', 'assets', relativePath),
      path.join(process.cwd(), 'assets', relativePath),
      path.join(process.cwd(), 'backend', 'assets', relativePath),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        return c;
      }
    }
    return null;
  }

  private resolveStaffPhotoPath(imageUrl?: string | null): string | null {
    if (!imageUrl || typeof imageUrl !== 'string') return null;
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    const candidates = [
      path.join(process.cwd(), cleanPath),
      path.join(process.cwd(), 'backend', cleanPath),
      path.join(__dirname, '..', '..', '..', cleanPath),
      path.join(__dirname, '..', '..', cleanPath),
      path.join(__dirname, '..', cleanPath),
      path.join(process.cwd(), 'uploads', 'staff', path.basename(cleanPath)),
      path.join(process.cwd(), 'backend', 'uploads', 'staff', path.basename(cleanPath)),
      path.join(__dirname, '..', '..', '..', 'uploads', 'staff', path.basename(cleanPath)),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        return c;
      }
    }
    return null;
  }

  async generateStaffResumePdf(staff: StaffData | any, requestId: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 40,
          bufferPages: true,
          info: {
            Title: `CV_${staff.firstNameTh}_${staff.lastNameTh}`,
            Author: 'Faculty of Social Sciences, Chiang Rai Rajabhat University',
            Subject: 'Official Speaker Bio & Academic Curriculum Vitae',
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // ------------------ Thai Font Registration ------------------
        const fontRegular = this.resolveAssetPath('fonts/tahoma.ttf');
        const fontBold = this.resolveAssetPath('fonts/tahomabd.ttf');

        const hasFontRegular = fontRegular && fs.existsSync(fontRegular);
        const hasFontBold = fontBold && fs.existsSync(fontBold);

        if (hasFontRegular) {
          doc.registerFont('ThaiRegular', fontRegular);
        }
        if (hasFontBold) {
          doc.registerFont('ThaiBold', fontBold);
        }

        const fontToUseRegular = hasFontRegular ? 'ThaiRegular' : 'Helvetica';
        const fontToUseBold = hasFontBold ? 'ThaiBold' : 'Helvetica-Bold';

        // ------------------ Header Bar with CRRU & Faculty Logos ------------------
        const crruLogoPath = this.resolveAssetPath('images/crru-logo.png');
        const facultyLogoPath = this.resolveAssetPath('images/faculty-logo.png');

        // Header Background Banner (University Crimson #7A102E + Gold border #C59B27)
        doc.rect(0, 0, 595.28, 92).fill('#7A102E');
        doc.rect(0, 90, 595.28, 3.5).fill('#C59B27');

        let headerTextX = 40;

        // University Emblem (Left)
        if (crruLogoPath && fs.existsSync(crruLogoPath)) {
          try {
            doc.image(crruLogoPath, 38, 12, { width: 48, height: 68 });
            headerTextX = 96;
          } catch (e) {
            this.logger.warn('Could not render CRRU logo in PDF', e);
          }
        }

        // Faculty Logo (Right)
        if (facultyLogoPath && fs.existsSync(facultyLogoPath)) {
          try {
            doc.image(facultyLogoPath, 595.28 - 40 - 54, 18, { width: 54, height: 54 });
          } catch (e) {
            this.logger.warn('Could not render Faculty logo in PDF', e);
          }
        }

        doc
          .font(fontToUseBold)
          .fontSize(15)
          .fillColor('#FFFFFF')
          .text('คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย', headerTextX, 22, { align: 'left' });

        doc
          .font(fontToUseRegular)
          .fontSize(10)
          .fillColor('#FCE7F3')
          .text('Faculty of Social Sciences, Chiang Rai Rajabhat University', headerTextX, 42, { align: 'left' });

        doc
          .font(fontToUseRegular)
          .fontSize(8.5)
          .fillColor('#FED7AA')
          .text(
            `เอกสารประวัติวิทยากรและผลงานทางวิชาการฉบับทางการ (Official Speaker Bio & CV)`,
            headerTextX,
            58,
            { align: 'left' },
          );

        // ------------------ Personal Profile Information & Photo Layout ------------------
        const photoPath = this.resolveStaffPhotoPath(staff.imageUrl);
        const photoWidth = 72;
        const photoHeight = 92;
        const photoX = 595.28 - 40 - photoWidth; // 483.28 pt (Top-Right position)
        const photoY = 108;

        // If staff has photo: text spans 425 pt; if no photo: expands to 515 pt (Full width)
        const textWidth = photoPath ? 425 : 515;

        // Render photo on the top-right if available
        if (photoPath) {
          try {
            doc.rect(photoX - 2, photoY - 2, photoWidth + 4, photoHeight + 4).fill('#E2E8F0');
            doc.rect(photoX - 1, photoY - 1, photoWidth + 2, photoHeight + 2).fill('#FFFFFF');
            doc.image(photoPath, photoX, photoY, {
              width: photoWidth,
              height: photoHeight,
              fit: [photoWidth, photoHeight],
              align: 'center',
              valign: 'center',
            });
            doc.rect(photoX, photoY, photoWidth, photoHeight).strokeColor('#CBD5E1').lineWidth(0.6).stroke();
          } catch (e) {
            this.logger.warn('Could not render staff photo in PDF', e);
          }
        }

        doc.y = 108;

        const fullNameTh = [staff.prefixTh, staff.firstNameTh, staff.lastNameTh].filter(Boolean).join(' ');
        const fullNameEn = [staff.prefixEn, staff.firstNameEn, staff.lastNameEn].filter(Boolean).join(' ');

        doc
          .font(fontToUseBold)
          .fontSize(15)
          .fillColor('#0F172A')
          .text(fullNameTh, 40, doc.y, { width: textWidth });

        if (fullNameEn && fullNameEn.trim()) {
          doc
            .font(fontToUseRegular)
            .fontSize(10)
            .fillColor('#64748B')
            .text(fullNameEn.trim(), 40, doc.y, { width: textWidth });
        }

        doc.moveDown(0.3);

        // Conditional Positions (Only display if present)
        const posList = [staff.adminPosition, staff.academicPosition].filter(Boolean);
        if (posList.length > 0) {
          doc
            .font(fontToUseBold)
            .fontSize(9.5)
            .fillColor('#85193C')
            .text(`ตำแหน่ง: ${posList.join(' • ')}`, 40, doc.y, { width: textWidth });
        }

        // Conditional Department (Only display if present)
        const deptName = staff.departmentName || staff.department;
        if (deptName && deptName.trim()) {
          doc
            .font(fontToUseRegular)
            .fontSize(9.5)
            .fillColor('#334155')
            .text(`สังกัด: ${deptName.trim()} คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย`, 40, doc.y, { width: textWidth });
        }

        // Conditional Contact Email (Only display if present)
        if (staff.contactEmail && staff.contactEmail.trim()) {
          doc
            .font(fontToUseRegular)
            .fontSize(9)
            .fillColor('#0284C7')
            .text(`อีเมลติดต่อทางราชการ: ${staff.contactEmail.trim()}`, 40, doc.y, { width: textWidth });
        }

        // Ensure vertical cursor is below the photo if present
        const minProfileBottom = photoPath ? photoY + photoHeight + 12 : doc.y + 6;
        if (doc.y < minProfileBottom) {
          doc.y = minProfileBottom;
        } else {
          doc.moveDown(0.4);
        }

        // Horizontal Separation Bar
        doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(0.5);

        // Page break controller to prevent overflow into footer
        const ensureSpace = (neededHeight: number = 45) => {
          if (doc.y + neededHeight > 730) {
            doc.addPage();
            doc.rect(0, 0, 595.28, 26).fill('#7A102E');
            doc
              .font(fontToUseBold)
              .fontSize(8.5)
              .fillColor('#FFFFFF')
              .text('คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย | เอกสารประวัติทางการ (ต่อ)', 40, 8);
            doc.y = 42;
          }
        };

        const renderSectionHeader = (titleTh: string, titleEn: string) => {
          ensureSpace(50);
          doc.rect(40, doc.y, 4, 13).fill('#7A102E');
          doc
            .font(fontToUseBold)
            .fontSize(10.5)
            .fillColor('#0F172A')
            .text(`  ${titleTh} ${titleEn ? `(${titleEn})` : ''}`, 46, doc.y + 1);
          doc.moveDown(0.3);
        };

        // ------------------ 1. Education (Conditional) ------------------
        const validEducation = Array.isArray(staff.education)
          ? staff.education.filter((e) => e && (e.detail?.trim() || e.level?.trim()))
          : [];

        if (validEducation.length > 0) {
          renderSectionHeader('ประวัติการศึกษา', 'Education');
          for (const edu of validEducation) {
            ensureSpace(20);
            const levelLabel =
              edu.level === 'DOCTORAL'
                ? 'ปริญญาเอก (Ph.D.)'
                : edu.level === 'MASTER'
                  ? 'ปริญญาโท (Master)'
                  : edu.level === 'BACHELOR'
                    ? 'ปริญญาตรี (Bachelor)'
                    : edu.level || 'การศึกษา';

            doc
              .font(fontToUseRegular)
              .fontSize(9)
              .fillColor('#334155')
              .text(`• ${levelLabel}: ${edu.detail || ''}`, { indent: 10, lineGap: 2 });
          }
          doc.moveDown(0.5);
        }

        // ------------------ 2. Areas of Expertise (Conditional) ------------------
        const validExpertise = Array.isArray(staff.expertise)
          ? staff.expertise.filter((x) => typeof x === 'string' && x.trim().length > 0)
          : [];

        if (validExpertise.length > 0) {
          renderSectionHeader('สาขาความเชี่ยวชาญ', 'Areas of Expertise');
          ensureSpace(25);
          doc
            .font(fontToUseRegular)
            .fontSize(9)
            .fillColor('#334155')
            .text(validExpertise.join('  •  '), { indent: 10, lineGap: 3 });
          doc.moveDown(0.5);
        }

        // ------------------ 3. Biography / Summary (Conditional) ------------------
        if (staff.bio && staff.bio.trim()) {
          renderSectionHeader('ประวัติและผลงานวิชาการโดยสังเขป', 'Biography');
          ensureSpace(30);
          doc
            .font(fontToUseRegular)
            .fontSize(8.5)
            .fillColor('#475569')
            .text(staff.bio.trim(), { indent: 10, lineGap: 3 });
          doc.moveDown(0.5);
        }

        // ------------------ 4. Academic Identifiers (Conditional) ------------------
        const hasScopus = !!(staff.scopusAuthorId && staff.scopusAuthorId.trim());
        const hasOrcid = !!(staff.orcidId && staff.orcidId.trim());
        const hasScholar = !!(staff.googleScholarUrl && staff.googleScholarUrl.trim());

        if (hasScopus || hasOrcid || hasScholar) {
          renderSectionHeader('ฐานข้อมูลผลงานวิชาการระดับสากล', 'Academic Identifiers');
          if (hasScopus) {
            ensureSpace(18);
            doc
              .font(fontToUseRegular)
              .fontSize(8.5)
              .fillColor('#334155')
              .text(`• Scopus Author ID: ${staff.scopusAuthorId.trim()}`, { indent: 10 });
          }
          if (hasOrcid) {
            ensureSpace(18);
            doc
              .font(fontToUseRegular)
              .fontSize(8.5)
              .fillColor('#334155')
              .text(`• ORCID iD: ${staff.orcidId.trim()}`, { indent: 10 });
          }
          if (hasScholar) {
            ensureSpace(18);
            doc
              .font(fontToUseRegular)
              .fontSize(8.5)
              .fillColor('#0284C7')
              .text(`• Google Scholar: ${staff.googleScholarUrl.trim()}`, { indent: 10 });
          }
          doc.moveDown(0.5);
        }

        // ------------------ 5. Research Projects (Max 10, Conditional) ------------------
        const validProjects = Array.isArray(staff.researchProjects)
          ? staff.researchProjects.filter((p) => p && (p.titleTh?.trim() || p.titleEn?.trim())).slice(0, 10)
          : [];

        if (validProjects.length > 0) {
          renderSectionHeader('โครงการวิจัยและงานวิชาการเด่น (ล่าสุดไม่เกิน 10 โครงการ)', 'Selected Research Projects');
          for (const proj of validProjects) {
            ensureSpace(24);
            const title = (proj.titleTh || proj.titleEn || '').trim();
            const yearStr = proj.year ? `(พ.ศ. ${proj.year})` : '';
            const roleStr =
              proj.role === 'HEAD'
                ? '[หัวหน้าโครงการ]'
                : proj.role === 'CO_RESEARCHER'
                  ? '[ผู้ร่วมวิจัย]'
                  : proj.role
                    ? `[${proj.role}]`
                    : '';
            doc
              .font(fontToUseRegular)
              .fontSize(8.5)
              .fillColor('#334155')
              .text(`• ${title} ${yearStr} ${roleStr}`.trim(), { indent: 10, lineGap: 2 });
          }
          doc.moveDown(0.5);
        }

        // ------------------ 6. Academic Services (Max 10, Conditional) ------------------
        const validServices = Array.isArray(staff.academicServices)
          ? staff.academicServices.filter((s) => s && s.title?.trim()).slice(0, 10)
          : [];

        if (validServices.length > 0) {
          renderSectionHeader('ผลงานบริการวิชาการและพัฒนาชุมชนท้องถิ่น (ล่าสุดไม่เกิน 10 โครงการ)', 'Academic & Community Services');
          for (const srv of validServices) {
            ensureSpace(24);
            const title = (srv.title || '').trim();
            const areaStr = srv.area?.trim() ? `(พื้นที่: ${srv.area.trim()})` : '';
            const roleStr = srv.role === 'LEADER' ? '[หัวหน้าโครงการ]' : '[ผู้ร่วมโครงการ]';
            doc
              .font(fontToUseRegular)
              .fontSize(8.5)
              .fillColor('#334155')
              .text(`• ${title} ${areaStr} ${roleStr}`.trim(), { indent: 10, lineGap: 2 });
          }
          doc.moveDown(0.5);
        }

        // ------------------ Uniform PDPA & Institutional Footer Across All Pages ------------------
        const range = doc.bufferedPageRange();
        const issueDateStr = new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i);

          // Subtle footer box
          doc.rect(40, 772, 515, 42).fill('#F8FAFC');
          doc.strokeColor('#E2E8F0').lineWidth(0.5).rect(40, 772, 515, 42).stroke();

          doc
            .font(fontToUseBold)
            .fontSize(7.5)
            .fillColor('#7A102E')
            .text('ข้อความคุ้มครองข้อมูลส่วนบุคคล (PDPA Notice):', 48, 776);

          doc
            .font(fontToUseRegular)
            .fontSize(7)
            .fillColor('#64748B')
            .text(
              'เอกสารนี้ออกและรับรองโดยสำนักงานคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย เพื่อใช้ตามวัตถุประสงค์ในคำขอทางการเท่านั้น ห้ามคัดลอก ดัดแปลง หรือเผยแพร่แก่บุคคลที่สามโดยไม่ได้รับอนุญาต',
              48,
              786,
              { width: 498 },
            );

          doc
            .font(fontToUseRegular)
            .fontSize(6.8)
            .fillColor('#94A3B8')
            .text(
              `วันที่ออกเอกสาร: ${issueDateStr} | รหัสอ้างอิง: ${requestId} | หน้า ${i + 1} จาก ${range.count} | ติดต่อ: socialsciences@crru.ac.th`,
              48,
              798,
              { width: 498 },
            );
        }

        doc.end();
      } catch (err) {
        this.logger.error('Failed to generate staff resume PDF:', err);
        reject(err);
      }
    });
  }
}
