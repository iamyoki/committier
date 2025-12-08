import type { ConfigType } from "../types/config.type.ts";

export const DefaultConfig: ConfigType = {
  autoEmoji: true,
  autoScope: "replaceToPackageName",
  defaultType: "fix",
  types: {
    feat: {
      emoji: "✨",
      title: "Feature",
      description: "A new feature",
    },
    fix: {
      emoji: "🐛",
      title: "Bug Fixes",
      description: "A bug fix",
    },
    refactor: {
      emoji: "♻️",
      title: "Code Refactoring",
      description: "A code change that neither fixes a bug nor adds a feature",
    },
    perf: {
      emoji: "⚡️",
      title: "Performance Improvements",
      description: "A code change that improves performance",
    },
    chore: {
      emoji: "🎨",
      title: "Chores",
      description: "Other changes that don't modify src or test files",
      scopes: [
        {
          match: "release",
          emoji: "🚀",
          title: "Release",
          description: "A new release",
        },
      ],
    },
    test: {
      emoji: "🧪",
      title: "Tests",
      description: "Adding missing tests or correcting existing tests",
    },
    style: {
      emoji: "💄",
      title: "Styles",
      description:
        "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
    },
    docs: {
      emoji: "📝",
      title: "Documentation",
      description: "Documentation only changes",
    },
    revert: {
      emoji: "➖",
      title: "Reverts",
      description: "Reverts a previous commit",
    },
    build: {
      emoji: "📦️",
      title: "Builds",
      description:
        "Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
    },
    ci: {
      emoji: "👷",
      title: "Continuous Integrations",
      description:
        "Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
    },
    breakingChange: {
      emoji: "💥",
      title: "Breaking Changes",
      description: "Introduce breaking changes.",
    },
  },
};
