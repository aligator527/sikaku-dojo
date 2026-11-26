import type { TermRow } from '../../components/glossary/GlossaryIndex';
import { routes } from '../paths';
import type { Term } from './glossary';

export const toTermRow = (term: Term): TermRow => ({
  id: term.id,
  term: term.term,
  reading: term.reading,
  en: term.en,
  aliases: term.aliases,
  exams: term.exams,
  summary: term.summary,
  row: term.row,
  href: routes.term(term.id),
});
