# Chat Bot

## Werewolf

- TODO:
  - check group members
    - leave if too many people?
  - options
    - set vote to postback message or private
    - werewolves know each other
      - kill one or idle
  - debounce response
  - fix stage should not be skip, if the characters are dead

## Development

### VSCode extension - i18n Ally

Suggested to install this plugin for development

- [Download](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally).
- Since the locale object could be an array of strings, it cannot be displayed by the extension, we use the function `defineMessages` to flatten the array ( if process.env.VSCODE_PID is defined ).
- `tsconfig-paths.cjs` is used to resolve paths like `@/xxx` in locale files
