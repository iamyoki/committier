# @iamyoki/generate-conventional-emoji

Generate emoji for commit message based on conventional commits

## Install

`pnpm/npm/yarn add @iamyoki/generate-conventional-emoji`

## Usage

`.husky/commit-msg`

```diff
npx --no -- commitlint --edit $1
npx --no -- generate-conventional-emoji $1
```

## API

### sum(...nums: number[]): number

Returns a number summarized by nums.

## Config

## License

ISC
