import { t } from '../../i18n';
import s from './Question.module.css';

/** A one-line legend of keyboard shortcuts. Hidden on touch screens by CSS. */
export function KeyHints({
  choices,
  next = false,
  mock = false,
}: {
  choices: number;
  next?: boolean;
  mock?: boolean;
}) {
  const k = t.shortcuts;
  return (
    <p className={s.keyHints} aria-label={k.title}>
      {choices > 0 && (
        <span>
          <kbd>1</kbd>〜<kbd>{Math.min(9, choices)}</kbd> {k.choose}
        </span>
      )}
      {mock ? (
        <>
          <span>
            <kbd>←</kbd>
            <kbd>→</kbd> {k.move}
          </span>
          <span>
            <kbd>F</kbd> {k.flag}
          </span>
        </>
      ) : (
        <>
          <span>
            <kbd>Enter</kbd> {next ? k.submitNext : k.submit}
          </span>
          <span>
            <kbd>E</kbd> {k.explanation}
          </span>
        </>
      )}
    </p>
  );
}
