/**
 * Static taxonomy shared by the content schema and the UI.
 * Adding a new qualification family or category starts here.
 */

export const CATEGORIES = [
  { id: 'statistics', name: '統計・データサイエンス' },
  { id: 'math', name: '数学' },
  { id: 'it', name: 'IT・情報処理' },
  { id: 'ai', name: 'AI・ディープラーニング' },
  { id: 'accounting', name: '会計・簿記' },
  { id: 'management', name: '経営・コンサルティング' },
] as const;

export const FAMILIES = [
  { id: 'toukei', name: '統計検定', category: 'statistics' },
  { id: 'suken', name: '実用数学技能検定', category: 'math' },
  { id: 'ipa', name: '情報処理技術者試験', category: 'it' },
  { id: 'jdla', name: 'JDLA資格', category: 'ai' },
  { id: 'boki', name: '日商簿記検定', category: 'accounting' },
  { id: 'shindanshi', name: '中小企業診断士', category: 'management' },
] as const;

/**
 * Choice label styles, matching what each organiser prints on the paper:
 * IPA uses ア〜エ, 統計検定 uses ①〜⑤, and so on.
 */
export const CHOICE_STYLES = ['katakana', 'circled', 'alpha', 'number'] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type FamilyId = (typeof FAMILIES)[number]['id'];
export type ChoiceStyle = (typeof CHOICE_STYLES)[number];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];
export const FAMILY_IDS = FAMILIES.map((f) => f.id) as [FamilyId, ...FamilyId[]];

export const categoryName = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.name ?? id;
export const familyName = (id: FamilyId) => FAMILIES.find((f) => f.id === id)?.name ?? id;
