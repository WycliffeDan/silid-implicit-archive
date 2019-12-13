import { Agent } from './Agent';

export interface Organization {
  id: number;
  name: string;
  creator: Agent;
}
