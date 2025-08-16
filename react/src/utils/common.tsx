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

export const getTime = (aTime: number) => {
  const date = new Date(aTime);
  const dateY = date.getFullYear();
  const dateM = date.getMonth() + 1;
  const dateD = date.getDate();
  const dateH = date.getHours();
  const dateMi = date.getMinutes();
  return [dateY, dateM, dateD, dateH, dateMi];
};

export const getImplementationDate = (
  aStartTimeArray: number[],
  aEndTimeArray?: number[]
) => {
  const displayStartTime = `${aStartTimeArray[0]}年${aStartTimeArray[1]}月${aStartTimeArray[2]}日${aStartTimeArray[3]}時${aStartTimeArray[4]}分`;

  let displayEndTime = "";
  if (aEndTimeArray) {
    const getDisplayEndTime = (aIndex: number, aUnit: string) => {
      return aStartTimeArray[aIndex] == aEndTimeArray[aIndex]
        ? ""
        : aEndTimeArray[aIndex] + aUnit;
    };
    const unitArray = ["年", "月", "日", "時"];
    unitArray.forEach((val, index) => {
      displayEndTime += getDisplayEndTime(index, val);
    });
    displayEndTime += displayEndTime += `${aEndTimeArray[4]}分`;
  }
  return aEndTimeArray
    ? `${displayStartTime}〜${displayEndTime}`
    : displayStartTime;
};

export const getDisplayRemainingTimeOrTimeTaken = (
  aSeconds: number | number[] | undefined,
  aStatus: number,
  aRequiredValue: string
) => {
  const getDisplayTime = (aTargetSeconds: number) => {
    const seconds = Math.abs(aTargetSeconds);
    return seconds < 60
      ? `${seconds}秒`
      : seconds % 60
      ? Math.floor(seconds / 60) + "分" + (seconds % 60) + "秒"
      : Math.floor(seconds / 60) + "分";
  };
  if (aRequiredValue === "remainingTime" && typeof aSeconds === "number") {
    const plusTextArray = ["方向性・構成を決める", "内容を書く", "校正をする"];
    if (typeof aSeconds === "number" && aSeconds > 0) {
      return `${plusTextArray[aStatus - 1]}残り時間「${getDisplayTime(
        aSeconds
      )}」です。`;
    }
    return `時間が予定より「${getDisplayTime(aSeconds)}」オーバーしています。`;
  }
  if (aRequiredValue === "timeTaken" && Array.isArray(aSeconds)) {
    return `メモ${getDisplayTime(aSeconds[0])}、ライティング${getDisplayTime(
      aSeconds[1]
    )}、校正${getDisplayTime(aSeconds[2])}`;
  }
};
