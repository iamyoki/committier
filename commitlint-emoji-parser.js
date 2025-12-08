export function commitlintEmojiParser() {
  return {
    conventionalChangelog: {
      headerPattern:
        /^(?:\p{Emoji_Presentation} )?(\w*)(?:\((.*)\))?!?: (.*)$/u,
      breakingHeaderPattern:
        /^(?:\p{Emoji_Presentation} )?(\w*)(?:\((.*)\))?!: (.*)$/u,
    },
    recommendedBumpOpts: {
      headerPattern:
        /^(?:\p{Emoji_Presentation} )?(\w*)(?:\((.*)\))?!?: (.*)$/u,
      breakingHeaderPattern:
        /^(?:\p{Emoji_Presentation} )?(\w*)(?:\((.*)\))?!: (.*)$/u,
    },
    parserOpts: {
      headerPattern:
        /^(?:\p{Emoji_Presentation} )?(\w*)(?:\((.*)\))?!?: (.*)$/u,
      breakingHeaderPattern:
        /^(?:\p{Emoji_Presentation} )?(\w*)(?:\((.*)\))?!: (.*)$/u,
    },
  };
}
