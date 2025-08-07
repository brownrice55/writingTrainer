import type { InputsTemplate } from "./inputsTemplate.type";
export type Inputs = {
  status: number;
  templatekey: number;
  template?: InputsTemplate;
  topic: string;
  notes: string;
  texts: string[];
  time: number[];
  timeForDisplay: string[];
  words: number[];
  startTime: number;
  startTimeArray: number[];
  implementationDate: string;
};
