import { DailyGoalItem } from './DailyGoalItem';
import { DailyGoalTotals } from './DailyGoalTotals';
export interface DailyGoalsReport {
    items: DailyGoalItem[];
    totals: DailyGoalTotals;
}