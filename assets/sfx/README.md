# DONE RITE One-Click SFX Assets

This folder is reserved for custom sound effects used by the One-Click editor.

Built-in browser-generated effects already available without files:
- whoosh — navigation, Back, and Open controls
- click — standard controls
- pop — Create, Record, Render, Save, and Finish controls
- snap — Remove, Clear, Delete, and Reset controls

The shared `modules/ui-touch-feedback.js` controller reads this folder's manifest and plays these effects only after a real button touch or keyboard activation. It uses a separate browser-audio path and never changes source-video or voiceover volume.

Custom files may be added here later as MP3, WAV, M4A, or AAC files. Keep effects short and clean so they can sit on a separate layer without changing or ducking the original voiceover.

Suggested naming:
- hook-whoosh-01.mp3
- text-click-01.wav
- feature-pop-01.wav
- cta-snap-01.wav
- transition-whoosh-02.mp3
