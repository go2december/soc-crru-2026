'use client';

import { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { RESEARCH_SDG_DESCRIPTIONS } from '@/lib/research';

interface ResearchSdgBadgesProps {
  sdgIds: number[];
  emptyText?: string;
}

export default function ResearchSdgBadges({
  sdgIds,
  emptyText = 'ยังไม่ระบุ SDGs',
}: ResearchSdgBadgesProps) {
  const [activeSdgId, setActiveSdgId] = useState<number | null>(null);

  const activeSdg = useMemo(() => {
    if (!activeSdgId) return null;
    return RESEARCH_SDG_DESCRIPTIONS[activeSdgId] || null;
  }, [activeSdgId]);

  if (!sdgIds.length) {
    return <span className="text-base-content/60">{emptyText}</span>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {sdgIds.map((sdgId) => (
          <span key={sdgId} className="badge badge-lg badge-outline gap-1.5 pr-2">
            <span>SDG {sdgId}</span>
            <button
              type="button"
              aria-label={`ดูคำอธิบาย SDG ${sdgId}`}
              className="inline-flex items-center rounded-full text-base-content/60 transition hover:text-primary"
              onClick={() => setActiveSdgId(sdgId)}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>

      <dialog className={`modal ${activeSdg ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-lg">
          <h3 className="text-lg font-bold">
            {activeSdgId ? `SDG ${activeSdgId}: ${activeSdg?.title || ''}` : 'คำอธิบาย SDG'}
          </h3>
          <p className="mt-3 text-sm leading-7 text-base-content/80">
            {activeSdg?.description || ''}
          </p>
          <div className="modal-action">
            <button type="button" className="btn btn-outline" onClick={() => setActiveSdgId(null)}>
              ปิด
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => setActiveSdgId(null)}>
            close
          </button>
        </form>
      </dialog>
    </>
  );
}
