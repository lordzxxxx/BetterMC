export type CivicRecording = {
  id: string;
  title: string;
  category: "Legislative session" | "BAC meeting" | "City activity";
  publisher: string;
  sourceUrl: string;
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

// Each permalink was inspected on its publisher's public Facebook video page on 18 November 2026.
// A recording title or thumbnail alone does not verify the spoken discussion or any outcome.
export const civicRecordings: CivicRecording[] = [
  ...([
    ["1139814078783195", "70th", "2:44:05", "17 November 2026"],
    ["1145005021720628", "69th", "2:44:44", "10 November 2026"],
    ["988731936991283", "68th", "2:10:17", "3 November 2026"],
    ["1778168556746961", "67th", "1:53:34", "27 October 2026"],
    ["28810174378633467", "66th", "2:35:14", "20 October 2026"],
  ] as const).map(([id, ordinal, duration, eventDate]) => ({
    id,
    title: `${ordinal} Regular Session · 10th Sangguniang Panlungsod`,
    category: "Legislative session" as const,
    publisher: 'Estelito "Litoy" R. Marabe',
    sourceUrl: `https://www.facebook.com/estelitolitoymarabe/videos/${id}/`,
    duration,
    eventDate,
    description: `Full ${ordinal.toLowerCase()} regular session recording published on the Vice Mayor's public video page.`,
    sourceContext: `The Vice Mayor's public page identifies this as the ${ordinal.toLowerCase()} regular session of Malaybalay City's 10th Sangguniang Panlungsod. This page keeps the full recording and its source together for residents.`,
    poster: `/images/recordings/${id}.jpg`,
  })),
  {
    id: "1641508124420651",
    title: "Bids and Awards Committee Meeting · 18 November 2026",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1641508124420651/",
    duration: "2:35:29",
    eventDate: "18 November 2026",
    description: "Full BAC meeting recording published by the City Government.",
    sourceContext: "The City Government publishes this recording as a Bids and Awards Committee meeting. Residents can watch the original proceeding through the video above.",
    poster: "/images/recordings/1641508124420651.jpg",
  },
  {
    id: "1481595420501767",
    title: "Bids and Awards Committee Meeting",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1481595420501767/",
    duration: "4:35:31",
    description: "Full BAC meeting recording published by the City Government. The event date is not stated in the visible title.",
    sourceContext: "The City Government identifies a BAC meeting and links a price schedule folder for procurement projects presented at the pre-bid conference. Open the folder alongside the recording to inspect the published materials.",
    relatedSource: { label: "Publisher-linked price schedule folder", url: "https://drive.google.com/drive/folders/16Y5k6czs9rs_bjZoc7By1AU7m4t9BRKL?usp=drive_link" },
    poster: "/images/recordings/1481595420501767.jpg",
  },
  {
    id: "1612035207388575",
    title: "Bids and Awards Committee Meeting · 4 November 2026",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1612035207388575/",
    duration: "2:10:18",
    eventDate: "4 November 2026",
    description: "Full BAC meeting recording published by the City Government.",
    sourceContext: "The City Government identifies a BAC meeting and links a price schedule folder for procurement projects presented at the pre-bid conference. Open the folder alongside the recording to inspect the published materials.",
    relatedSource: { label: "Publisher-linked price schedule folder", url: "https://drive.google.com/drive/folders/12Yv28JcTSgZ7-bXkLnTMln9fO8tRGLov?usp=drive_link" },
    poster: "/images/recordings/1612035207388575.jpg",
  },
  {
    id: "1110522651866036",
    title: "Bids and Awards Committee Meeting",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1110522651866036/",
    duration: "2:37:24",
    description: "Full BAC meeting recording published by the City Government. The event date is not stated in the visible title.",
    sourceContext: "The City Government identifies a BAC meeting and links a price schedule folder for procurement projects presented at the pre-bid conference. Open the folder alongside the recording to inspect the published materials.",
    relatedSource: { label: "Publisher-linked price schedule folder", url: "https://drive.google.com/drive/folders/1B4cwvRG-YszfIOrbqklx7Q65xZsjYJbn?usp=sharing" },
    poster: "/images/recordings/1110522651866036.jpg",
  },
  {
    id: "1655350899575841",
    title: "Bids and Awards Committee Meeting · 28 October 2026",
    category: "BAC meeting",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1655350899575841/",
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
    duration: "2:33:59",
    eventDate: "4 May 2022",
    description: "Recording of the BAC meeting published after its live broadcast was interrupted, according to the BAC page caption.",
    sourceContext: "The BAC office says this recording continues the 4 May 2022 meeting after its livestream was interrupted by a slow internet connection.",
    poster: "/images/recordings/5048284161875584.jpg",
  },
  {
    id: "1472517011656501",
    title: "Kapihan Quarterly Media Forum · 30 October 2026",
    category: "City activity",
    publisher: "City Government of Malaybalay",
    sourceUrl: "https://www.facebook.com/100063747444247/videos/1472517011656501/",
    duration: "2:26:50",
    eventDate: "30 October 2026",
    description: "Quarterly media forum recording published by the City Government.",
    sourceContext: "The City Government identifies this as the Kapihan Quarterly Media Forum held at People's Hall, New City Hall, on 30 October 2026.",
    poster: "/images/recordings/1472517011656501.jpg",
  },
  {
    id: "2188734111679711",
    title: "Makisayud sa City Government of Malaybalay",
    category: "City activity",
    publisher: "Mayor Warren Pabillaran",
    sourceUrl: "https://www.facebook.com/mayorwarrenpabillaran/videos/2188734111679711/",
    publishedDate: "14 November 2026",
    description: "Public city government discussion recording shared by the Mayor's page on 14 November 2026.",
    sourceContext: "The Mayor's page publishes this public discussion under the title ‘Makisayud sa City Government of Malaybalay.’",
    poster: "/images/recordings/2188734111679711.jpg",
  },
];
