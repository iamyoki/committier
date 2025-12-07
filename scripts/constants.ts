export const EMOJI_MAP: Record<
  string,
  { emoji: string; title: string; description: string }
> = {
  feat: { emoji: "✨", title: "Feature", description: "A new feature" },
  fix: { emoji: "🐛", title: "Bug Fixes", description: "A bug fix" },
  chore: {
    emoji: "🎨",
    title: "Chores",
    description: "Other changes that don't modify src or test files",
  },
  style: {
    emoji: "💄",
    title: "Styles",
    description:
      "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
  },
  test: {
    emoji: "🧪",
    title: "Tests",
    description: "Adding missing tests or correcting existing tests",
  },
  build: {
    emoji: "📦️",
    title: "Builds",
    description:
      "Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
  },
  "chore(release)": {
    emoji: "🚀",
    title: "Release",
    description: "A new release",
  },
  ci: {
    emoji: "👷",
    title: "Continuous Integrations",
    description:
      "Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
  },
  docs: {
    emoji: "📝",
    title: "Documentation",
    description: "Documentation only changes",
  },
  perf: {
    emoji: "⚡️",
    title: "Performance Improvements",
    description: "A code change that improves performance",
  },
  refactor: {
    emoji: "♻️",
    title: "Code Refactoring",
    description: "A code change that neither fixes a bug nor adds a feature",
  },
  revert: {
    emoji: "➖",
    title: "Reverts",
    description: "Reverts a previous commit",
  },
};
