export interface UserSettings {
  sidebarCollapsed: boolean;
  dateFormat: "MM/dd/yyyy" | "dd/MM/yyyy" | "yyyy-MM-dd";
}

export const DEFAULT_SETTINGS: UserSettings = {
  sidebarCollapsed: false,
  dateFormat: "MM/dd/yyyy",
};
