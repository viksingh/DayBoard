export type Mood = "great" | "good" | "okay" | "bad" | "terrible" | null;

export interface DailyNote {
  date: string; // YYYY-MM-DD
  content: string;
  mood: Mood;
  linkedCardIds: string[];
  updatedAt: string;
}

export const MOOD_OPTIONS: { value: Mood; emoji: string; label: string }[] = [
  { value: "great", emoji: "\u{1F929}", label: "Great" },
  { value: "good", emoji: "\u{1F60A}", label: "Good" },
  { value: "okay", emoji: "\u{1F610}", label: "Okay" },
  { value: "bad", emoji: "\u{1F614}", label: "Bad" },
  { value: "terrible", emoji: "\u{1F62D}", label: "Terrible" },
];
