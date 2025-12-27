export function commitlintEmojiParser() {
  return {
    conventionalChangelog: {
      headerPattern:
        /^(?:\p{Emoji_Presentation} |\p{Emoji}\uFE0F )?(\w*)(?:\((.*)\))?!?: (.*)$/u,
      breakingHeaderPattern:
        /^(?:\p{Emoji_Presentation} |\p{Emoji}\uFE0F )?(\w*)(?:\((.*)\))?!: (.*)$/u,
    },
    recommendedBumpOpts: {
      headerPattern:
        /^(?:\p{Emoji_Presentation} |\p{Emoji}\uFE0F )?(\w*)(?:\((.*)\))?!?: (.*)$/u,
      breakingHeaderPattern:
        /^(?:\p{Emoji_Presentation} |\p{Emoji}\uFE0F )?(\w*)(?:\((.*)\))?!: (.*)$/u,
    },
    parserOpts: {
      headerPattern:
        /^(?:\p{Emoji_Presentation} |\p{Emoji}\uFE0F )?(\w*)(?:\((.*)\))?!?: (.*)$/u,
      breakingHeaderPattern:
        /^(?:\p{Emoji_Presentation} |\p{Emoji}\uFE0F )?(\w*)(?:\((.*)\))?!: (.*)$/u,
    },
  };
}
