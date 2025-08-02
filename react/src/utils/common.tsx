import type { Inputs } from "../types/inputs.type";
export function getData() {
  let data = new Map<number, Inputs>();
  const dataFromLocalStorage: string | null =
    localStorage.getItem("WritingTrainer");
  if (dataFromLocalStorage !== "undefined") {
    if (typeof dataFromLocalStorage === "string") {
      const dataJson = JSON.parse(dataFromLocalStorage);
      data = new Map(dataJson);
    } else {
      data = new Map(null);
    }
  }
  return data;
}

import type { InputsTemplate } from "../types/inputsTemplate.type";
export function getTemplateData() {
  let data = new Map<number, InputsTemplate>();
  const dataFromLocalStorage: string | null = localStorage.getItem(
    "WritingTrainerTemplate"
  );
  if (dataFromLocalStorage !== "undefined") {
    if (typeof dataFromLocalStorage === "string") {
      const dataJson = JSON.parse(dataFromLocalStorage);
      data = new Map(dataJson);
    } else {
      data = new Map(null);
    }
  }
  return data;
}

import type { InputsTopic } from "../types/inputsTopic.type";
export function getTopics(): InputsTopic {
  const raw = localStorage.getItem("WritingTrainerTopic");
  const data: { topic: string; topicId: number }[] = raw
    ? JSON.parse(raw)
    : [{ topic: "", topicId: 0 }];
  return { topics: data };
}
