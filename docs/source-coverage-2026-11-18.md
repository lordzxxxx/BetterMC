# BetterMC source coverage — 18 November 2026

## Weather and flood context

- The homepage current conditions come from the Open-Meteo forecast API. The displayed precipitation is a model estimate for the preceding hour, not a rain gauge observation.
- The GIS timeline reads Open-Meteo daily weather data. A failed request leaves the values unavailable; it does not generate replacement rainfall, river stage, discharge, or alerts.
- The Project NOAH overlay is mapped flood hazard for planning scenarios. It does not show a current flood or live river conditions.
- BetterMC has no verified live Sawaga River gauge, local discharge feed, or authority to issue flood warnings. Current advisories are linked to PAGASA's flood bulletins and Mindanao regional forecast; residents should follow the City Disaster Risk Reduction and Management Office for local instructions.
- Location markers in the GIS are approximate references. They are not validated building entrances, surveyed elevations, or site-specific flood certifications.

## Legislative text

- Ordinance No. 1118, Series of 2026: the City publication links a scanned six-page signed ordinance. The BetterMC provision summaries were checked against that scan. The document names Hon. Cristopher Lambert N. Tortola as author; it does not publish barangay audit results.
- Other listed measures retain concise summaries within the evidence available from their City publication pages. Missing full text is not reconstructed.

## Recordings and transcripts

- Thirteen distinct public video permalinks were inspected: five full 10th Sangguniang Panlungsod regular sessions on [Vice Mayor Marabe's video page](https://www.facebook.com/estelitolitoymarabe/videos/), five BAC meetings and one media forum on the [City Government video page](https://www.facebook.com/profile.php?id=100063747444247&sk=videos), one BAC meeting on the [BAC office video page](https://www.facebook.com/bacmalaybalay/videos/), and one public discussion on [Mayor Pabillaran's video page](https://www.facebook.com/mayorwarrenpabillaran/videos/). Each has its own BetterMC card and permanent page. The original URLs are in `src/civicRecordings.ts`.
- The video thumbnails were obtained from each public video's Open Graph metadata and stored locally at 960 × 540 pixels. Each card links to its exact source. The Facebook embed loads only when a visitor chooses to play it.
- The five council session dates were read from the dates printed in the publisher's video preview image: 70th (17 November), 69th (10 November), 68th (3 November), 67th (27 October), and 66th (20 October 2026). An event date is not inferred for City videos whose visible title does not state it.
- The user's additional share links were resolved and deduplicated by underlying video ID. The duplicate BAC post permalink was reviewed as a post, not presented as another recording.
- BetterMC now links directly to the City Government and BAC LGU Malaybalay video libraries from the hearings and procurement sections. These are official publishing channels; the links are browsable even when a particular recording has not yet been indexed as its own BetterMC record.
- The Facebook player may require Facebook access or may change availability. Loading an embed is not proof that playback succeeds for every visitor.
- Other indexed hearing and procurement documents still lack a verified matching video URL. BetterMC does not attach a general Facebook page as if it were a specific recording, or attach a BAC video to an unrelated bid result.
- No reviewed verbatim transcript or discussion summary exists for these thirteen recordings. Procurement amounts and outcomes shown on BetterMC derive from separately linked disclosure documents, not an unreviewed recording.
- These are the publicly visible recordings found and checked in this pass, not a complete historical archive. Additional videos and transcripts require individual permalink checks and authorized audio or transcript access.

## Primary links

- [Project NOAH hazard map](https://noah.up.edu.ph/)
- [PAGASA flood bulletins](https://pagasa.dost.gov.ph/flood)
- [PAGASA Mindanao regional forecast](https://pagasa.dost.gov.ph/regional-forecast/minprsd)
- [Open-Meteo forecast documentation](https://open-meteo.com/en/docs)
- [City publication for Ordinance No. 1118](https://sakata.malaybalaycity.gov.ph/ordinance-no-1118-series-of-2026/)
- [City BAC Facebook page](https://www.facebook.com/bacmalaybalay)
- [City Government video library](https://www.facebook.com/profile.php?id=100063747444247&sk=videos)
- [BAC LGU Malaybalay video library](https://www.facebook.com/bacmalaybalay/videos/)
