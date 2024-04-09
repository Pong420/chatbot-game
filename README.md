# Chat Bot

## Werewolf

[ ] Website

    [ ] Settings
    [ ] Documentation
    [ ] Game Room

- TODO:
  - cache response
  - check group enenber
    - leave if too many people

## VSCode - i18n Ally

- [Download](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally).
- Since the locale object could be an array of strings, it cannot be displayed by the extension, we use the function `defineMessages` to flatten the array ( if process.env.VSCODE_PID is defined ).
- `tsconfig-paths.cjs` is used for resolve paths like `@/xxx` in locale files
