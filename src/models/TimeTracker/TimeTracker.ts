export interface TimeTracker {
  id: number;
  userId: number;
  uName: string;
  recordDate: Date;
  timeTrack: string;
  isWorking: boolean;
  workTimeInSeconds: number;
}
