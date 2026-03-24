/**
 * data/questions.ts — All categories and their questions
 *
 * This file is the single source of truth for everything the questionnaire
 * screen displays. Questions must never be hardcoded in screen components —
 * always import from here.
 *
 * Structure:
 *   - Category interface     — shape of each category object
 *   - universalQuestions     — questions added to every category regardless
 *   - categories array       — one entry per purchase category, each with
 *                              a key (used as an ID), label, emoji, and
 *                              category-specific questions
 *   - getQuestionsForCategory — the main helper used by the questionnaire
 *                               screen; merges universal + category questions
 *                               and substitutes the wage-derived threshold
 *
 * The [threshold] placeholder in universalQuestions is replaced at runtime
 * with the number of hours derived from the user's hourly wage. The formula
 * is: threshold = round(50 / hourlyWage). This represents roughly how long
 * a person would need to work to afford a £50 item — scaled to the item's
 * actual price elsewhere. Defaults to 3 hours if no wage is set.
 *
 * Scoring logic (not in this file — see utils/scoring.ts when built):
 *   A "negative" answer is a "No". The verdict is based on the ratio of
 *   negative answers to total questions:
 *     ≤ 1/2 negative  → 🟢 Conscious buy
 *     1/2–5/6         → 🟡 Sleep on it
 *     ≥ 5/6           → 🔴 Probably not for today
 */

/** Shape of a single purchase category. */
export interface Category {
  /** Unique string ID used as a route param and for AsyncStorage keys. */
  key: string;
  /** Human-readable display name, e.g. "Clothing & Accessories". */
  label: string;
  /** Emoji shown next to the category name throughout the UI. */
  emoji: string;
  /** Category-specific yes/no questions (appended after universalQuestions). */
  questions: string[];
}

/**
 * Questions shown for every category.
 * The string '[threshold]' is a placeholder replaced by getQuestionsForCategory
 * with the user's personalised hours-of-work figure.
 */
export const universalQuestions: string[] = [
  'Have I thought about this for at least one week?',
  'Is buying this worth giving up progress towards my goal?',
  'Where will this item be in five years?',
  'Will I have to work more than [threshold] hours to pay for it?',
  'Do I have space to put it away when not in use?',
  'Can I be happy without it?',
  'Does it solve a problem I have genuinely noticed?',
];

/** All supported purchase categories with their specific questions. */
export const categories: Category[] = [
  {
    key: 'clothing',
    label: 'Clothing & Accessories',
    emoji: '🧥',
    questions: [
      'Do I already own something similar?',
      'Have I worn similar items I own in the last 6 months?',
      'Could I borrow or thrift this instead?',
      'Is it made to last (quality stitching, natural fibres)?',
      'Can it be repaired if damaged?',
      'Do I love it, not just like it?',
      'Will it work with at least 3 things I already own?',
    ],
  },
  {
    key: 'electronics',
    label: 'Electronics',
    emoji: '📱',
    questions: [
      'Do I already own one?',
      'Is my current one broken or truly insufficient?',
      'Could the current one be repaired instead of replaced?',
      'Is the battery replaceable?',
      'Are spare parts and repairs available for this model?',
      'Could I borrow or rent one for the specific use case I have in mind?',
    ],
  },
  {
    key: 'furniture',
    label: 'Furniture & Home',
    emoji: '🛋️',
    questions: [
      'Do I have a functional equivalent already?',
      'Is this replacing something broken — and could that be repaired?',
      'Will it fit my life long-term, not just my current home?',
      'Is it made of durable, repairable materials?',
      'Could I find this secondhand?',
    ],
  },
  {
    key: 'books',
    label: 'Books, Media & Entertainment',
    emoji: '📚',
    questions: [
      'Could I borrow it from a library or friend?',
      'Do I already own something unread or unwatched in this genre?',
      'Will I return to it more than once?',
      'Is a digital version sufficient?',
    ],
  },
  {
    key: 'sports',
    label: 'Sports & Hobbies',
    emoji: '🏋️',
    questions: [
      'Have I done this activity enough to justify owning the gear?',
      'Could I rent or borrow to try it first?',
      'Do I already own something that serves this purpose?',
      'Is this gear built to last, or fashion-driven?',
    ],
  },
  {
    key: 'beauty',
    label: 'Beauty & Personal Care',
    emoji: '🧴',
    questions: [
      'Do I have an unfinished equivalent at home?',
      'Is the packaging refillable or recyclable?',
      'Is this a genuine gap in my routine?',
    ],
  },
  {
    key: 'toys',
    label: 'Toys & Kids',
    emoji: '🧸',
    questions: [
      'Could I borrow, swap, or buy secondhand?',
      'Will this hold attention beyond a few weeks?',
      'Is it durable and repairable?',
    ],
  },
  {
    key: 'tools',
    label: 'Tools & Equipment',
    emoji: '🔧',
    questions: [
      'Will I use this more than a handful of times?',
      'Could I borrow or rent it?',
      'Do I already own something that could do this job?',
      'Are spare parts available for this model?',
    ],
  },
  {
    key: 'gifts',
    label: 'Gifts',
    emoji: '🎁',
    questions: [
      'Does the recipient actually want or need this?',
      'Could an experience replace a physical gift?',
      'Is it something they would choose themselves?',
    ],
  },
];

/**
 * Returns the full list of yes/no questions for a given category.
 *
 * Combines universalQuestions (with the [threshold] placeholder resolved)
 * and the category-specific questions. This is what the questionnaire screen
 * should render.
 *
 * @param categoryKey - The `key` field of the chosen category (e.g. 'electronics').
 * @param hourlyWage  - The user's hourly wage from settings. Used to calculate
 *                     how many hours of work the threshold question references.
 *                     If omitted, the threshold defaults to 3 hours.
 * @returns           Ordered array of question strings ready to display.
 */
export function getQuestionsForCategory(
  categoryKey: string,
  hourlyWage?: number
): string[] {
  const category = categories.find((c) => c.key === categoryKey);

  // If the key doesn't match any known category, return just the universal
  // questions as a safe fallback rather than an empty array.
  if (!category) return universalQuestions;

  // Derive the hours threshold: how long would the user need to work to afford
  // a "typical" discretionary item (~£50)? round(50 / wage).
  // e.g. wage=25 → threshold=2h, wage=10 → threshold=5h.
  // Default of 3 is used when the user hasn't set their wage.
  const threshold = hourlyWage ? Math.round(50 / hourlyWage) : 3;

  // Replace the [threshold] placeholder in the universal questions array.
  const processed = universalQuestions.map((q) =>
    q.replace('[threshold]', String(threshold))
  );

  // Universal questions first, then category-specific questions.
  return [...processed, ...category.questions];
}
