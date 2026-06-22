export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    'declaration-block-no-duplicate-properties': true,
    'no-duplicate-selectors': true,
    'order/properties-alphabetical-order': true,

    'selector-class-pattern': [
      '^([a-z][a-zA-Z0-9]*|[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__(?:[a-z][a-z0-9]*)(?:-[a-z0-9]+)*)?(?:--(?:[a-z][a-z0-9]*)(?:-[a-z0-9]+)*)?)$',
      {
        message:
          'Expected class selector to be camelCase, kebab-case, or BEM-like.',
      },
    ],
  },
};
