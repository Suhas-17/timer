export interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  startTime: Date;
  remainingDuration: number;
  paused: boolean;
}
