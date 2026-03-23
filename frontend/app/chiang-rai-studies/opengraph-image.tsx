import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Chiang Rai Studies Center';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #2e1065 0%, #6b21a8 45%, #f97316 100%)',
                    color: '#ffffff',
                    fontFamily: 'Kanit, Arial, sans-serif',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 32%), radial-gradient(circle at bottom left, rgba(255,255,255,0.18), transparent 30%)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 48,
                        left: 56,
                        display: 'flex',
                        padding: '10px 18px',
                        borderRadius: 9999,
                        border: '1px solid rgba(255,255,255,0.35)',
                        background: 'rgba(255,255,255,0.12)',
                        fontSize: 24,
                        fontWeight: 600,
                        letterSpacing: 0.6,
                    }}
                >
                    คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '120px 72px 72px',
                        width: '100%',
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 34,
                            fontWeight: 700,
                            color: '#fde68a',
                            marginBottom: 18,
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                        }}
                    >
                        Chiang Rai Studies
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            maxWidth: 900,
                            fontSize: 72,
                            lineHeight: 1.08,
                            fontWeight: 800,
                            marginBottom: 24,
                        }}
                    >
                        ศูนย์เชียงรายศึกษา
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            maxWidth: 900,
                            fontSize: 30,
                            lineHeight: 1.45,
                            color: 'rgba(255,255,255,0.92)',
                        }}
                    >
                        แหล่งเรียนรู้อัตลักษณ์เชียงราย ประวัติศาสตร์ โบราณคดี ชาติพันธุ์ ศิลปะการแสดง และภูมิปัญญาท้องถิ่น
                    </div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        right: 56,
                        bottom: 48,
                        display: 'flex',
                        padding: '14px 22px',
                        borderRadius: 24,
                        background: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.24)',
                        fontSize: 24,
                        fontWeight: 600,
                    }}
                >
                    soc.crru.ac.th/chiang-rai-studies
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
