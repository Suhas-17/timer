export interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  startTime: string | null;
  remainingDuration: number;
  paused?: boolean;
}
