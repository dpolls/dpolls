/**
 * Interface for wallet connection state
 */
export interface PollState {
  subject: string;
  options: string[];
  duration: number;
  rewardPerResponse: number;
  maxResponses: number;
}