import type { Schema } from '@markdoc/markdoc';

export const callout: Schema = {
  render: 'Callout',
  attributes: {
    type: {
      type: String,
      default: 'note',
      matches: ['caution', 'note', 'warning'],
    },
    content: {
      type: String,
    },
  },
};
