import { z } from "zod";
import { portalSearchIndex } from "./searchIndex";

export type KuyaMacSource = {
  type: string;
  title: string;
  detail: string;
  href: string;
};

export const kuyaMacRequestSchema = z.object({
  message: z.string().trim().min(1).max(1_200),
});

const greetingPattern = /^(hi|hello|hey|maayong (buntag|hapon|gabi|adlaw)|kumusta|musta|good (morning|afternoon|evening)|magandang (umaga|hapon|gabi))\b/i;
const civicTerms = /\b(malaybalay|bettermc|barangay|baranggay|punong|kagawad|official|mayor|council|government|city hall|service|permit|certificate|psa|bir|sss|philhealth|pag-ibig|pagibig|lto|dti|gsis|emergency|hotline|flood|weather|project|procurement|budget|financial|ordinance|legislation|transparency|map|maps|office|department|feedback|report|record)\b/i;
const promptInjectionPattern = /\b(ignore|reveal|show|print|repeat|extract)\b.{0,80}\b(system|prompt|instruction|api key|secret|password|environment|env|credential)\b|\b(jailbreak|developer message|tool call)\b/i;
const offTopicPattern = /\b(write|make|generate|solve|create)\b.{0,80}\b(essay|poem|story|code|homework|recipe|travel plan)\b/i;

const stopWords = new Set([
  "about", "after", "ang", "and", "are", "asa", "can", "city", "does", "find", "for", "from", "how", "information", "is", "it", "mga", "need", "ng", "of", "on", "please", "sa", "the", "to", "unsa", "what", "where", "which", "who", "with", "you",
]);

function tokens(value: string): string[] {
  return value
    .toLocaleLowerCase("en-PH")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[a-z0-9]{2,}/g)
    ?.filter((token) => !stopWords.has(token)) ?? [];
}

export function hasKuyaMacPromptInjection(message: string): boolean {
  return promptInjectionPattern.test(message);
}

export function isKuyaMacTopic(message: string): boolean {
  if (offTopicPattern.test(message)) return false;
  return greetingPattern.test(message) || civicTerms.test(message) || retrieveKuyaMacSources(message).length > 0;
}

export function retrieveKuyaMacSources(message: string, limit = 5): KuyaMacSource[] {
  const queryTokens = new Set(tokens(message));
  if (queryTokens.size === 0) return [];

  return portalSearchIndex
    .map((record) => {
      const title = record.title.toLocaleLowerCase("en-PH");
      const detail = record.detail.toLocaleLowerCase("en-PH");
      const keywords = (record.keywords ?? "").toLocaleLowerCase("en-PH");
      const type = record.type.toLocaleLowerCase("en-PH");
      const score = [...queryTokens].reduce(
        (total, token) => total
          + (title.includes(token) ? 8 : 0)
          + (title === token ? 24 : 0)
          + (keywords.includes(token) ? 3 : 0)
          + (detail.includes(token) ? 2 : 0)
          + (type.includes(token) ? 1 : 0),
        0,
      );
      return { record, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title))
    .slice(0, limit)
    .map(({ record }) => ({
      type: record.type,
      title: record.title,
      detail: record.detail,
      href: record.href,
    }));
}

export function kuyaMacFallbackAnswer(message: string, sources: KuyaMacSource[]): string {
  if (greetingPattern.test(message)) {
    return "Maayong adlaw! Ako si Kuya MAC, ang imohang AI Companion.";
  }
  const primarySource = sources[0];
  if (primarySource) {
    return `Pinakarelevant nga BetterMC record: ${primarySource.title}.\n\n${primarySource.detail}\n\nAblihi ang record sa ubos para sa kumpletong detalye ug source context.`;
  }
  return "Wala koy verified BetterMC record para ana. Makapangutana ka bahin sa Malaybalay public services, barangays, offices, officials, public records, maps, o unsaon paggamit sa BetterMC.";
}
