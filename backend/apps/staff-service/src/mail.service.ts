import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class StaffMailService {
  private readonly logger = new Logger(StaffMailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const rawPass = process.env.SMTP_PASS;
    const smtpPass = rawPass ? rawPass.replace(/\s+/g, '') : undefined;

    if (smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for 587
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log(`Initialized SMTP transport via ${smtpHost}:${smtpPort} as ${smtpUser}`);
    } else {
      this.logger.warn(
        'SMTP credentials (SMTP_USER/SMTP_PASS) not fully configured in .env. Emails will run in simulated preview mode.',
      );
    }
  }

  private getFromAddress(): string {
    return (
      process.env.SMTP_FROM ||
      '"คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย" <social@crru.ac.th>'
    );
  }

  /**
   * ส่งอีเมลยืนยันการรับคำร้องไปยังผู้ขอ (ระบุเงื่อนไขจัดส่งไม่เกิน 7 วันทำการตาม PDPA)
   */
  async sendAcknowledgmentEmail(params: {
    to: string;
    requesterName: string;
    organization: string;
    staffName: string;
    purpose: string;
    requestId: string;
  }) {
    const { to, requesterName, organization, staffName, purpose, requestId } = params;

    const subject = `[คณะสังคมศาสตร์ มร.ชร.] ยืนยันการรับคำขอเอกสารประวัติวิทยากร/เรซูเม่อาจารย์ (${staffName})`;
    const html = `
      <div style="font-family: 'Sarabun', Tahoma, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #85193C; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #85193C; margin: 0; font-size: 20px;">คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Faculty of Social Sciences, Chiang Rai Rajabhat University</p>
        </div>

        <p style="font-size: 15px; font-weight: bold;">เรียน คุณ${requesterName} (${organization})</p>

        <p style="font-size: 14px;">
          สำนักงานคณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ได้รับคำขอเอกสารประวัติ / ประวัติวิทยากร (Curriculum Vitae & Speaker Bio) ของ <strong>${staffName}</strong> รหัสคำร้อง <code>${requestId}</code> เรียบร้อยแล้ว
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #85193C; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>วัตถุประสงค์:</strong> ${purpose}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>ระยะเวลาดำเนินการ:</strong> ทำการตรวจสอบความถูกต้องและจัดส่งเอกสารให้ <strong>ไม่เกิน 7 วันทำการหลังจากได้รับการร้องขอเอกสาร</strong></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>มาตรการคุ้มครองข้อมูล (PDPA):</strong> ข้อมูลนี้จัดส่งให้เพื่อวัตถุประสงค์ตามที่ระบุในคำร้องเท่านั้น ห้ามเผยแพร่ต่อสาธารณะโดยไม่ได้รับอนุญาต</p>
        </div>

        <p style="font-size: 13px; color: #475569;">
          หากมีข้อสงสัยหรือต้องการประสานงานเร่งด่วน กรุณาติดต่อสำนักงานคณะสังคมศาสตร์ โทร. 053-776-000 หรืออีเมล socialsciences@crru.ac.th
        </p>

        <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
          คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย 80 หมู่ 9 ถนนพหลโยธิน ต.บ้านดู่ อ.เมือง จ.เชียงราย 57100
        </div>
      </div>
    `;

    if (!this.transporter) {
      this.logger.log(
        `[SIMULATED EMAIL] Acknowledgment email to: ${to} for request ${requestId} (staff: ${staffName})`,
      );
      return { success: true, simulated: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.getFromAddress(),
        to,
        subject,
        html,
      });
      this.logger.log(`Acknowledgment email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Failed to send acknowledgment email to ${to}:`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * ส่งอีเมลพร้อมไฟล์ PDF Resume ทางการไปยังผู้ขอ
   */
  async sendOfficialResumeEmail(params: {
    to: string;
    requesterName: string;
    organization: string;
    staffName: string;
    pdfBuffer: Buffer;
    fileName: string;
    requestId: string;
  }) {
    const { to, requesterName, organization, staffName, pdfBuffer, fileName, requestId } = params;

    const subject = `[อนุมัติคำขอ] เอกสารประวัติวิทยากร/เรซูเม่ ${staffName} - คณะสังคมศาสตร์ มร.ชร.`;
    const html = `
      <div style="font-family: 'Sarabun', Tahoma, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #85193C; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #85193C; margin: 0; font-size: 20px;">คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Faculty of Social Sciences, Chiang Rai Rajabhat University</p>
        </div>

        <p style="font-size: 15px; font-weight: bold;">เรียน คุณ${requesterName} (${organization})</p>

        <p style="font-size: 14px;">
          ตามที่ท่านได้ยื่นคำขอรับเอกสารประวัติวิทยากร (Curriculum Vitae & Speaker Bio) ของ <strong>${staffName}</strong> (รหัสคำร้อง: <code>${requestId}</code>)
        </p>

        <p style="font-size: 14px;">
          คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย ได้พิจารณาอนุมัติคำขอและแนบไฟล์เอกสารประวัติฉบับทางการ (PDF) มาพร้อมกับอีเมลฉบับนี้แล้ว
        </p>

        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 12px 16px; margin: 16px 0; border-radius: 4px; font-size: 12px; color: #991b1b;">
          <strong>ข้อกำหนดด้านความคุ้มครองข้อมูลส่วนบุคคล (PDPA Notice):</strong><br/>
          เอกสารที่แนบมานี้เป็นเอกสารราชการเฉพาะกิจ อนุญาตให้ใช้เฉพาะวัตถุประสงค์ที่ระบุในคำขอ ห้ามมิให้ทำซ้ำ ดัดแปลง เผยแพร่ หรือส่งต่อแก่บุคคลภายนอกโดยมิได้รับอนุญาตเป็นลายลักษณ์อักษร
        </div>

        <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
          คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย | socialsciences@crru.ac.th
        </div>
      </div>
    `;

    if (!this.transporter) {
      this.logger.log(
        `[SIMULATED EMAIL] Official Resume PDF sent to: ${to} (File: ${fileName}, Size: ${pdfBuffer.length} bytes)`,
      );
      return { success: true, simulated: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.getFromAddress(),
        to,
        subject,
        html,
        attachments: [
          {
            filename: fileName,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
      this.logger.log(`Official resume email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Failed to send official resume email to ${to}:`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * แจ้งเตือนไปยังอาจารย์หรือผู้ดูแลระบบเมื่อมีคำขอใหม่
   */
  async sendAdminAlert(params: {
    adminEmail?: string;
    requesterName: string;
    organization: string;
    staffName: string;
    purpose: string;
    requestId: string;
  }) {
    const adminEmail = params.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'socialsciences@crru.ac.th';
    const subject = `[แจ้งเตือนคำขอใหม่] มีผู้ขอเอกสารประวัติวิทยากร: ${params.staffName}`;
    const html = `
      <div style="font-family: 'Sarabun', Tahoma, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; padding: 20px;">
        <h3 style="color: #85193C;">แจ้งเตือนคำขอเอกสารประวัติวิทยากร / Resume ใหม่</h3>
        <p>มีผู้ยื่นคำขอเอกสารประวัติของ <strong>${params.staffName}</strong> ผ่านระบบเว็บไซต์:</p>
        <ul>
          <li><strong>ผู้ขอ:</strong> ${params.requesterName}</li>
          <li><strong>หน่วยงาน:</strong> ${params.organization}</li>
          <li><strong>วัตถุประสงค์:</strong> ${params.purpose}</li>
          <li><strong>รหัสคำร้อง:</strong> ${params.requestId}</li>
        </ul>
        <p>กรุณาตรวจสอบความถูกต้องและดำเนินการอนุมัติภายใน 7 วันทำการ</p>
      </div>
    `;

    if (!this.transporter) {
      this.logger.log(`[SIMULATED EMAIL] Admin alert sent to ${adminEmail}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.getFromAddress(),
        to: adminEmail,
        subject,
        html,
      });
    } catch (err) {
      this.logger.error(`Failed to send admin alert to ${adminEmail}:`, err);
    }
  }
}
