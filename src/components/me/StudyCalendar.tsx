/** 学習カレンダー: a heat map of daily study, with the current and longest streak. */
import { Fragment, useEffect, useRef } from 'react';

import { calendarWeeks, recentTotals } from '../../domain/calendar';
import { currentStreak, longestStreak, type ProgressState } from '../../domain/progress';
import { t } from '../../i18n';
import s from './Me.module.css';

const WEEKS = 26;
const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日'];

const md = (dateKey: string) => {
  const [, m, d] = dateKey.split('-').map(Number);
  return { m: m!, d: d! };
};

export function StudyCalendar({ progress, today }: { progress: ProgressState; today: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const weeks = calendarWeeks(progress, today, WEEKS);
  const week = recentTotals(progress, today, 7);
  const c = t.me.calendar;

  // Show the most recent weeks first on narrow screens.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <div className={s.calendar}>
      <dl className={s.streaks}>
        <div>
          <dt>{c.streak}</dt>
          <dd>
            <span className="num">{currentStreak(progress, today)}</span>
            {c.days}
          </dd>
        </div>
        <div>
          <dt>{c.longest}</dt>
          <dd>
            <span className="num">{longestStreak(progress)}</span>
            {c.days}
          </dd>
        </div>
        <div>
          <dt>{c.thisWeek}</dt>
          <dd>
            <span className="num">{week.answered}</span>
            {c.questions}
          </dd>
        </div>
        <div>
          <dt>{c.activeDays}</dt>
          <dd>
            <span className="num">{week.activeDays}</span>
            {c.days}
          </dd>
        </div>
      </dl>

      <div className={s.heatScroll} ref={scroller}>
        {/* Column flow: the first column holds weekday labels, then one column per week. */}
        <div className={s.heat} role="img" aria-label={c.label(WEEKS)}>
          <span />
          {WEEKDAYS.map((label, i) => (
            <span key={label} className={s.heatDay}>
              {i % 2 === 0 ? label : ''}
            </span>
          ))}
          {weeks.map((w, i) => {
            const first = md(w[0]!.date);
            const prev = i > 0 ? md(weeks[i - 1]![0]!.date) : null;
            return (
              <Fragment key={w[0]!.date}>
                <span className={s.heatMonth}>{!prev || prev.m !== first.m ? `${first.m}月` : ''}</span>
                {w.map((d) => {
                  const { m, d: day } = md(d.date);
                  return (
                    <span
                      key={d.date}
                      className={s.heatCell}
                      data-level={d.future ? undefined : d.level}
                      data-future={d.future || undefined}
                      title={d.future ? undefined : c.tooltip(m, day, d.answered, d.cards)}
                    />
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
      <p className={s.heatLegend} aria-hidden="true">
        {c.less}
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className={s.heatCell} data-level={l} />
        ))}
        {c.more}
      </p>
    </div>
  );
}
