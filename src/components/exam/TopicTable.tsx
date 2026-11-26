import { summarizeByTopic } from '../../domain/progress';
import { useProgress } from '../hooks/useProgress';
import s from './Exam.module.css';

interface Props {
  groups: { group?: string; topics: { id: string; name: string }[] }[];
  /** question id → topic ids */
  questions: { id: string; topics: string[] }[];
  /** topic id → its question-list page */
  topicHrefs: Record<string, string>;
}

/** 出題範囲 with the number of questions per topic and the learner's accuracy. */
export default function TopicTable({ groups, questions, topicHrefs }: Props) {
  const { progress, ready } = useProgress();
  const byTopic = summarizeByTopic(progress, questions);

  return (
    <div>
      {groups.map(({ group, topics }) => (
        <section className={s.topicGroup} key={group ?? topics[0]?.id}>
          {group && <h3 className={s.topicGroupName}>{group}</h3>}
          <ul className={s.topicList}>
            {topics.map((topic) => {
              const sum = byTopic.get(topic.id);
              const count = sum?.total ?? 0;
              const acc =
                ready && sum?.accuracy !== null && sum?.accuracy !== undefined ? sum.accuracy : null;
              return (
                <li className={s.topicRow} key={topic.id}>
                  {count > 0 && topicHrefs[topic.id] ? (
                    <a href={topicHrefs[topic.id]}>{topic.name}</a>
                  ) : (
                    <span>{topic.name}</span>
                  )}
                  <span className={`${s.dim} num`}>{count > 0 ? `${count}問` : '—'}</span>
                  <span
                    className={s.bar}
                    aria-label={acc === null ? '未解答' : `正答率${Math.round(acc * 100)}%`}
                  >
                    <span className={s.track}>
                      <span
                        className={s.fill}
                        style={{ display: 'block', width: `${Math.round((acc ?? 0) * 100)}%` }}
                      />
                    </span>
                    <span className="num">{acc === null ? '' : `${Math.round(acc * 100)}%`}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
