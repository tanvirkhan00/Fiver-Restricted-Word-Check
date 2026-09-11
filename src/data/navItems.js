import {
  LayoutDashboard,
  MessageSquareText,
  BookmarkCheck,
  Tags,
  Settings as SettingsIcon,
  Files,
  Ban
} from "lucide-react";
import { Dashboard } from "../pages/Dashboard";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "checker", label: "Message Checker", icon: MessageSquareText },
  { id: "templates", label: "Message Templates", icon: Files },
  { id: "saved", label: "Saved Messages", icon: BookmarkCheck },
  { id: "words", label: "Restricted Words", icon: Ban },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];
