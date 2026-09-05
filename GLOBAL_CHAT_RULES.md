# Global Chat Rules — DONE RITE / User Continuity

Updated: 2026-09-05

## Purpose

This file contains non-sensitive continuity rules for any ChatGPT or Claude conversation helping with DONE RITE work or any related project task.

## First rule

Before asking the user to repeat prior decisions, preferences, workflow rules, naming conventions, or recent project state:

1. Use available conversation memory / chat history / project context first.
2. If the task touches DONE RITE Creator OS, read `CHAT_SYNC_STATUS.md` and check current remote `main` before changing code.
3. If another chat may have changed the same repo or file, inspect recent commits before editing.
4. Do not make the user repeat information that can be recovered from available context.

## Continuity behavior

Treat prior user-approved decisions as persistent unless the user changes them.

When context is incomplete, distinguish between:

- facts already recoverable from memory/history/project context,
- current repository state that must be checked live,
- information that truly requires asking the user again.

Do not guess missing project state when a live source of truth exists.

## Privacy rule

Do not place sensitive personal information, credentials, financial data, medical details, private family information, or secrets into this public repository coordination file.

Use ChatGPT Memory / chat history for personal continuity, and use the repository only for non-sensitive project/workflow coordination.

## DONE RITE standing preferences

- Keep the workflow mobile-first for iPhone Safari / Home Screen PWA.
- Preserve user data and storage keys unless a tested migration is explicitly approved.
- Preserve the user's original voice volume, tone, pitch, timing, and speed unless explicitly asked to change it.
- SFX must not duck or lower the user's voice.
- No prices, discounts, unsupported scarcity, absolute claims, or unsupported medical claims in affiliate content.
- Include `#ad` in affiliate hashtag sets.
- When the user says “give me the details,” provide caption, hashtags, proper video/file name, and cover image name/title.
- For code work, inspect current `main` first and do not overwrite another chat's work.

## Limitation

This file cannot force every unrelated ChatGPT conversation on the platform to open GitHub automatically. For true cross-chat continuity, ChatGPT account Memory and Reference chat history should be enabled. This file is the project-side backup and shared source of non-sensitive workflow rules.

# END GLOBAL CHAT RULES
