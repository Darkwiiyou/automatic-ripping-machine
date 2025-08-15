# Automatic Ripping Machine (ARM) — With faketime / ddrescue

This repository is a user-focused fork of the upstream Automatic Ripping Machine, with a smoother UI and first-class support for faketime and ddrescue. It keeps the core functionality of ARM but improves day‑to‑day usability and resiliency.

Upstream project: [automatic-ripping-machine/automatic-ripping-machine](https://github.com/automatic-ripping-machine/automatic-ripping-machine)


## What’s new in this fork

- UI polish for Active Rips
  - Consistent, aligned layout for all fields (labels/values grid)
  - Poster anchored to the right; header status icon; long titles are truncated cleanly
  - Robust Start Date/Time/Job Time rendering (handles DB formats reliably)
  - Progress bar reworked with an in-bar percentage label (left‑anchored)
  - Stage display is smarter: clearly shows Scanning, Ripping, Transcoding, Waiting, and appends detailed steps when available (e.g., `Track 3/10`)
- ddrescue integration
  - When ddrescue is used to create an ISO from damaged media, the UI shows stage, ETA, and progress parsed from ddrescue logs
  - Install helper included (see `arm-dependencies/scripts/install_ddrescue.sh`)
- Optional faketime signal
  - When MakeMKV is invoked under faketime, the UI labels the stage accordingly so it’s visible in Active Rips
  - Install helper included (see `arm-dependencies/scripts/install_faketime.sh`)
- Status naming consistency
  - Ripping/transcoding stages map to friendly names: Scanning → Ripping → Transcoding → Waiting → Finished


## Overview (inherits from upstream)

Insert an optical disc (Blu‑ray, DVD, CD). ARM detects the disc type, rips it, and (optionally) transcodes it.

See upstream for a comprehensive feature list and docs: [ARM on GitHub](https://github.com/automatic-ripping-machine/automatic-ripping-machine)


## Highlights

- Detects disc insertion via udev
- Determines disc type (video, audio, data)
- Video: MakeMKV rip, HandBrake transcode; TV/Movie metadata lookups
- Audio CDs: abcde with MusicBrainz metadata and cover art
- Data discs: ISO backups; integrates ddrescue when configured
- Multiple optical drives supported; headless server friendly
- Flask UI for jobs, logs, and settings


## Installation notes

Everything from upstream applies. Additional options in this fork:

- faketime (optional):
  - Install via helper script: `arm-dependencies/scripts/install_faketime.sh`
  - If the system is configured to run MakeMKV under faketime, Active Rips will display “MakeMKV (faketime)” in the stage.
- ddrescue (optional but recommended for damaged media):
  - Install via helper script: `arm-dependencies/scripts/install_ddrescue.sh`
  - When enabled in your workflow, ddrescue progress is parsed and displayed in Active Rips.

Docker and manual installs follow the upstream instructions. Refer to the upstream wiki for platform specifics.


## Usage

1. Insert a disc
2. Watch progress in Active Rips (Scanning → Ripping → Transcoding)
3. Wait for the disc to eject
4. Repeat


## Troubleshooting

Please see the upstream wiki for general troubleshooting and configuration guidance. This fork keeps parity with upstream documentation: [ARM Wiki](https://github.com/automatic-ripping-machine/automatic-ripping-machine/wiki)


## Credits and License

- Based on the excellent upstream ARM project: [automatic-ripping-machine/automatic-ripping-machine](https://github.com/automatic-ripping-machine/automatic-ripping-machine)
- This repository remains MIT licensed. See [LICENSE](LICENSE).

