export type EventItem = {
  id: number;
  title: string;
  date: string;
  attendees: number;
  clickable: boolean;
  timeframe: 'upcoming' | 'past';
};

export const events: EventItem[] = [
  {
    id: 1,
    title: "mental static",
    date: "31/03/25",
    attendees: 12,
    clickable: true,
    timeframe: 'upcoming'
  },
  {
    id: 2,
    title: "strawberry hour",
    date: "15/05/25",
    attendees: 8,
    clickable: false,
    timeframe: 'upcoming'
  },
  {
    id: 3,
    title: "backyard potluck",
    date: "03/03/25",
    attendees: 15,
    clickable: false,
    timeframe: 'past'
  }
]; 