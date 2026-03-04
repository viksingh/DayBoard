export interface UserSettings {
  sidebarCollapsed: boolean;
  dateFormat: "MM/dd/yyyy" | "dd/MM/yyyy" | "yyyy-MM-dd";
  darkMode: boolean;
  dailyTemplate: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  sidebarCollapsed: false,
  dateFormat: "MM/dd/yyyy",
  darkMode: false,
  dailyTemplate: "",
};
