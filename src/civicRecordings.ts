export type CivicRecording = {
  id: string;
  title: string;
  category: "Legislative session" | "BAC meeting" | "City activity";
  publisher: string;
  sourceUrl: string;
  embedUrl?: string;
  duration?: string;
  eventDate?: string;
  publishedDate?: string;
  description: string;
  poster: string;
  sourceContext: string;
  relatedSource?: { label: string; url: string };
  transcript?: {
    language: string;
    reviewedOn: string;
    coverage: "complete" | "partial";
    sourceUrl: string;
    segments: { time: string; speaker?: string; text: string }[];
  };
};

export function buildFacebookVideoEmbedUrl(videoUrl: string, width = 900): string {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&width=${width}`;
}

// Each permalink was inspected on its publisher's public Facebook video page on 24 November 2026.
// A recording title or thumbnail alone does not verify the spoken discussion or any outcome.
export const civicRecordings: CivicRecording[] = [
  ...([
    ["1139814078783195", "70th", "2:44:05", "17 November 2026"],
    ["1145005021720628", "69th", "2:44:44", "10 November 2026"],
    ["988731936991283", "68th", "2:10:17", "3 November 2026"],
    ["1778168556746961", "67th", "1:53:34", "27 October 2026"],
    ["28810174378633467", "66th", "2:35:14", "20 October 2026"],
  ] as const).map(([id, ordinal, duration, eventDate]) => {
    const sourceUrl = `https://www.facebook.com/estelitolitoymarabe/videos/${id}/`;
    return {
      id,
      title: `${ordinal} Regular Session · 10th Sangguniang Panlungsod`,
      category: "Legislative session" as const,
      publisher: 'Estelito "Litoy" R. Marabe',
      sourceUrl,
      embedUrl: buildFacebookVideoEmbedUrl(sourceUrl),
      duration,
      eventDate,
      description: `Full ${ordinal.toLowerCase()} regular session livestream recording published on Vice Mayor Estelito "Litoy" R. Marabe's public video page.`,
      sourceContext: `The Vice Mayor's public page identifies this livestream as the ${ordinal.toLowerCase()} regular session of Malaybalay City's 10th Sangguniang Panlungsod. This page keeps the full recording, thumbnail, and embedded player together for residents.`,
      poster: `/images/recordings/${id}.jpg`,
    };
  }),
  {
    id: "2054078841948771",
    title: "70th Regular Session Highlights · 10th Sangguniang Panlungsod",
    category: "Legislative session",
    publisher: 'Estelito "Litoy" R. Marabe',
    sourceUrl: "https://www.facebook.com/estelitolitoymarabe/videos/2054078841948771/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/estelitolitoymarabe/videos/2054078841948771/"),
    duration: "0:27",
    eventDate: "19 November 2026",
    description: "Short video highlight from the 70th Regular Session of the 10th Sangguniang Panlungsod published on the Vice Mayor's Facebook page.",
    sourceContext: "Vice Mayor Estelito 'Litoy' R. Marabe published this session highlight reel following the 70th Regular Session at the New SP Session Hall.",
    poster: "/images/recordings/2054078841948771.jpg",
  },
  {
    id: "909018868867744",
    title: "69th Regular Session Highlights · 10th Sangguniang Panlungsod",
    category: "Legislative session",
    publisher: 'Estelito "Litoy" R. Marabe',
    sourceUrl: "https://www.facebook.com/estelitolitoymarabe/videos/909018868867744/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/estelitolitoymarabe/videos/909018868867744/"),
    duration: "0:30",
    eventDate: "13 November 2026",
    description: "Short video highlight from the 69th Regular Session of the 10th Sangguniang Panlungsod published on the Vice Mayor's Facebook page.",
    sourceContext: "Vice Mayor Estelito 'Litoy' R. Marabe published this video recap covering the 69th Regular Session of the 10th City Council.",
    poster: "/images/recordings/909018868867744.jpg",
  },
  {
    id: "1641508124420651",
    title: "Bids and Awards Committee Meeting · 18 November 2026",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1641508124420651/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/100063747444247/videos/1641508124420651/"),
    duration: "2:35:29",
    eventDate: "18 November 2026",
    description: "Full BAC meeting recording published by the City Government.",
    sourceContext: "The City Government publishes this recording as a Bids and Awards Committee meeting. Residents can watch the original proceeding through the video above.",
    poster: "/images/recordings/1641508124420651.jpg",
  },
  {
    id: "1481595420501767",
    title: "Bids and Awards Committee Meeting · 11 November 2026",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1481595420501767/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/100063747444247/videos/1481595420501767/"),
    duration: "4:35:31",
    eventDate: "11 November 2026",
    description: "Full BAC meeting livestream recording published by the City Government on 11 November 2026 with linked pre-bid price schedule documents.",
    sourceContext: "The City Government identifies a BAC meeting broadcast on 11 November 2026 and links a price schedule folder for procurement projects presented at the pre-bid conference (including ITB 2026-176, 2026-184, 2026-187, 2026-188, 2026-189, 2026-190, and 2026-208).",
    relatedSource: { label: "Publisher-linked price schedule folder", url: "https://drive.google.com/drive/folders/16Y5k6czs9rs_bjZoc7By1AU7m4t9BRKL?usp=drive_link" },
    poster: "/images/recordings/1481595420501767.jpg",
  },
  {
    id: "1612035207388575",
    title: "Bids and Awards Committee Meeting · 4 November 2026",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1612035207388575/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/100063747444247/videos/1612035207388575/"),
    duration: "2:10:18",
    eventDate: "4 November 2026",
    description: "Full BAC meeting recording published by the City Government.",
    sourceContext: "The City Government identifies a BAC meeting and links a price schedule folder for procurement projects presented at the pre-bid conference. Open the folder alongside the recording to inspect the published materials.",
    relatedSource: { label: "Publisher-linked price schedule folder", url: "https://drive.google.com/drive/folders/12Yv28JcTSgZ7-bXkLnTMln9fO8tRGLov?usp=drive_link" },
    poster: "/images/recordings/1612035207388575.jpg",
  },
  {
    id: "1110522651866036",
    title: "Bids and Awards Committee Meeting · 29 October 2026",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1110522651866036/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/100063747444247/videos/1110522651866036/"),
    duration: "2:37:24",
    eventDate: "29 October 2026",
    description: "Full BAC meeting livestream recording published by the City Government on 29 October 2026.",
    sourceContext: "The City Government identifies a BAC meeting broadcast on 29 October 2026 and links a price schedule folder for procurement projects presented at the pre-bid conference. Open the folder alongside the recording to inspect the published materials.",
    relatedSource: { label: "Publisher-linked price schedule folder", url: "https://drive.google.com/drive/folders/1B4cwvRG-YszfIOrbqklx7Q65xZsjYJbn?usp=sharing" },
    poster: "/images/recordings/1110522651866036.jpg",
  },
  {
    id: "1655350899575841",
    title: "Bids and Awards Committee Meeting · 28 October 2026",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1655350899575841/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/100063747444247/videos/1655350899575841/"),
    eventDate: "28 October 2026",
    description: "BAC meeting recording with a linked pre-bid price schedule in the original post.",
    sourceContext: "The City Government identifies a BAC meeting and links a price schedule folder for procurement projects presented at the pre-bid conference. Open the folder alongside the recording to inspect the published materials.",
    relatedSource: { label: "Publisher-linked price schedule folder", url: "https://drive.google.com/drive/folders/1s4rPTElX-rWrlYeRjCGc56bx0uh4jBUT?usp=drive_link" },
    poster: "/images/recordings/1655350899575841.jpg",
  },
  {
    id: "5048284161875584",
    title: "BAC Meeting · 4 May 2022",
    category: "BAC meeting",
    publisher: "BAC LGU Malaybalay",
    sourceUrl: "https://www.facebook.com/bacmalaybalay/videos/5048284161875584/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/bacmalaybalay/videos/5048284161875584/"),
    duration: "2:33:59",
    eventDate: "4 May 2022",
    description: "Recording of the BAC meeting published after its live broadcast was interrupted, according to the BAC page caption.",
    sourceContext: "The BAC office says this recording continues the 4 May 2022 meeting after its livestream was interrupted by a slow internet connection.",
    poster: "/images/recordings/5048284161875584.jpg",
  },
  {
    id: "2296755867563611",
    title: "Kalihukan sa Semana (16–20 November 2026)",
    category: "City activity",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/2296755867563611/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/100063747444247/videos/2296755867563611/"),
    duration: "2:24",
    eventDate: "23 November 2026",
    description: "Weekly public service video recap covering City Government of Malaybalay activities from November 16 to 20, 2026.",
    sourceContext: "The City Government of Malaybalay published this weekly video summary ('Kalihukan sa Semana') highlighting city programs, project turnovers, and departmental services.",
    poster: "/images/recordings/2296755867563611.jpg",
  },
  {
    id: "1604593474848920",
    title: "Makisayud sa City Government of Malaybalay · 21 November 2026",
    category: "City activity",
    publisher: "Mayor Warren Pabillaran",
    sourceUrl: "https://www.facebook.com/mayorwarrenpabillaran/videos/1604593474848920/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/mayorwarrenpabillaran/videos/1604593474848920/"),
    duration: "39:20",
    eventDate: "21 November 2026",
    description: "Public governance broadcast ('Makisayud sa City Government of Malaybalay') published on Mayor Jay Warren R. Pabillaran's Facebook page on 21 November 2026.",
    sourceContext: "The Mayor's page publishes this public information program under 'Makisayud sa City Government of Malaybalay' discussing ongoing city projects and executive updates.",
    poster: "/images/recordings/1604593474848920.jpg",
  },
  {
    id: "2188734111679711",
    title: "Makisayud sa City Government of Malaybalay · 14 November 2026",
    category: "City activity",
    publisher: "Mayor Warren Pabillaran",
    sourceUrl: "https://www.facebook.com/mayorwarrenpabillaran/videos/2188734111679711/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/mayorwarrenpabillaran/videos/2188734111679711/"),
    publishedDate: "14 November 2026",
    description: "Public city government discussion recording shared by the Mayor's page on 14 November 2026.",
    sourceContext: "The Mayor's page publishes this public discussion under the title ‘Makisayud sa City Government of Malaybalay.’",
    poster: "/images/recordings/2188734111679711.jpg",
  },
  {
    id: "1020346527754282",
    title: "2nd Monday Convocation Program · 9 November 2026",
    category: "City activity",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1020346527754282/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/100063747444247/videos/1020346527754282/"),
    duration: "1:44:13",
    eventDate: "9 November 2026",
    description: "Livestream recording of the City Government of Malaybalay 2nd Monday Convocation Program held on 9 November 2026.",
    sourceContext: "The City Government of Malaybalay streamed the 2nd Monday Convocation Program featuring city department reports and executive announcements.",
    poster: "/images/recordings/1020346527754282.jpg",
  },
  {
    id: "1472517011656501",
    title: "Kapihan Quarterly Media Forum · 30 October 2026",
    category: "City activity",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1472517011656501/",
    embedUrl: buildFacebookVideoEmbedUrl("https://www.facebook.com/100063747444247/videos/1472517011656501/"),
    duration: "2:26:50",
    eventDate: "30 October 2026",
    description: "Quarterly media forum recording published by the City Government.",
    sourceContext: "The City Government identifies this as the Kapihan Quarterly Media Forum held at People's Hall, New City Hall, on 30 October 2026.",
    poster: "/images/recordings/1472517011656501.jpg",
  },
];

