export interface Category {
  key: string;
  label: string;
  emoji: string;
  questions: string[];
}

export const universalQuestions: string[] = [
  'Have I thought about this for at least one week?',
  'Is buying this worth giving up progress towards my goal?',
  'Where will this item be in five years?',
  'Will I have to work more than [threshold] hours to pay for it?',
  'Do I have space to put it away when not in use?',
  'Can I be happy without it?',
  'Does it solve a problem I have genuinely noticed?',
];

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

export function getQuestionsForCategory(
  categoryKey: string,
  hourlyWage?: number
): string[] {
  const category = categories.find((c) => c.key === categoryKey);
  if (!category) return universalQuestions;

  const threshold = hourlyWage ? Math.round(50 / hourlyWage) : 3;
  const processed = universalQuestions.map((q) =>
    q.replace('[threshold]', String(threshold))
  );

  return [...processed, ...category.questions];
}
