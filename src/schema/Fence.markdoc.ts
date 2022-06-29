import type { Schema } from '@markdoc/markdoc';

export const fence: Schema = {
  render: 'Fence',
  attributes: {
    language: {
      type: String,
      description:
        'The programming language of the code block. Place it after the backticks',
    },
  },
};
