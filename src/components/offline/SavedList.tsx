/** The exams saved for offline use, read from this browser. Used on the offline fallback page. */
import { useEffect, useState } from 'react';

import { t } from '../../i18n';
import { savedRecords, type SavedRecord } from '../../lib/offline';
import s from './Offline.module.css';

export default function SavedList({ exams }: { exams: { id: string; name: string; href: string }[] }) {
  const [records, setRecords] = useState<Record<string, SavedRecord> | null>(null);
  useEffect(() => setRecords(savedRecords()), []);
  if (!records) return null;
  const saved = exams.filter((e) => records[e.id]);
  if (saved.length === 0) return <p className="meta">{t.offline.noneSaved}</p>;
  return (
    <ul className={s.list}>
      {saved.map((e) => (
        <li key={e.id}>
          <a href={e.href}>{e.name}</a>
        </li>
      ))}
    </ul>
  );
}
