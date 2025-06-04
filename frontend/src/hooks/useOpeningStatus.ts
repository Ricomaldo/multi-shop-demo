import { useMemo } from "react";
import type { OpeningHours } from "@/types";

interface OpeningStatus {
  isOpen: boolean;
  nextOpeningTime: string | null;
}

export function useOpeningStatus(
  openingHours?: OpeningHours | string
): OpeningStatus {
  return useMemo(() => {
    if (!openingHours) {
      return { isOpen: false, nextOpeningTime: null };
    }

    // Parse les horaires si c'est une string
    const hours =
      typeof openingHours === "string"
        ? (JSON.parse(openingHours) as OpeningHours)
        : openingHours;

    // Obtient le jour actuel
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const now = new Date();
    const currentDay = days[now.getDay()];

    // Vérifie les horaires du jour
    const todayHours = hours[currentDay as keyof OpeningHours];

    if (!todayHours || todayHours.toLowerCase() === "fermé") {
      // Trouve le prochain jour d'ouverture
      let nextDay = now.getDay();
      let nextDayHours = null;

      for (let i = 1; i <= 7; i++) {
        nextDay = (nextDay + 1) % 7;
        const nextDayKey = days[nextDay] as keyof OpeningHours;
        if (hours[nextDayKey] && hours[nextDayKey]?.toLowerCase() !== "fermé") {
          nextDayHours = hours[nextDayKey];
          break;
        }
      }

      return {
        isOpen: false,
        nextOpeningTime: nextDayHours
          ? `${days[nextDay]} ${nextDayHours}`
          : null,
      };
    }

    // Parse les heures d'ouverture (format attendu: "9h00 - 18h00")
    const [openTime, closeTime] = todayHours.split("-").map((t) => t.trim());
    const [openHour, openMinute] = openTime
      .replace("h", ":")
      .split(":")
      .map(Number);
    const [closeHour, closeMinute] = closeTime
      .replace("h", ":")
      .split(":")
      .map(Number);

    // Crée des dates pour comparaison
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openingTime = openHour * 60 + (openMinute || 0);
    const closingTime = closeHour * 60 + (closeMinute || 0);

    const isOpen = currentTime >= openingTime && currentTime < closingTime;

    return {
      isOpen,
      nextOpeningTime: !isOpen ? todayHours : null,
    };
  }, [openingHours]);
}
