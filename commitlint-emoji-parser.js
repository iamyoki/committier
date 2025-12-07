export async function commitlintEmojiParser() {
  return {
    conventionalChangelog: {
      headerPattern: /^(?:\S+? )?(\w*)(?:\((.*)\))?!?: (.*)$/,
      breakingHeaderPattern: /^(?:\S+? )?(\w*)(?:\((.*)\))?!: (.*)$/,
    },
    recommendedBumpOpts: {
      headerPattern: /^(?:\S+? )?(\w*)(?:\((.*)\))?!?: (.*)$/,
      breakingHeaderPattern: /^(?:\S+? )?(\w*)(?:\((.*)\))?!: (.*)$/,
    },
    parserOpts: {
      headerPattern: /^(?:\S+? )?(\w*)(?:\((.*)\))?!?: (.*)$/,
      breakingHeaderPattern: /^(?:\S+? )?(\w*)(?:\((.*)\))?!: (.*)$/,
    },
  };
}
