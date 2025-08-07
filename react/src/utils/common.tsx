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

import React from "react";
export const getRemainingTime = (
  aCurrentData: Inputs,
  aSetTimerId: React.Dispatch<React.SetStateAction<number>>,
  aSetDisplayRemainingTime: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!aCurrentData) {
    return;
  }
  let isPlus = true;
  let startTime = aCurrentData.startTime;
  const settingTime =
    Number(aCurrentData?.template?.time[aCurrentData.status - 1]) * 60000;

  let remainingTime;
  let timeTaken;
  if (settingTime >= Date.now() - startTime) {
    timeTaken = Date.now() - startTime;
    remainingTime = settingTime - timeTaken;
    isPlus = true;
  } else {
    remainingTime = Date.now() - startTime - settingTime;
    timeTaken = settingTime + remainingTime;
    isPlus = false;
  }

  const diff = new Date(remainingTime);
  const m = String(diff.getMinutes());
  const s = String(diff.getSeconds());
  let displayDiff = m != "0" ? m + "分" + s + "秒" : s + "秒";

  if (aCurrentData.status === 1) {
    displayDiff = isPlus
      ? "方向性・構成を決める残り時間「" + displayDiff + "」です。"
      : "時間が予定より「" + displayDiff + "」オーバーしています。";
  } else if (aCurrentData.status === 2) {
    displayDiff = isPlus
      ? "内容を書く残り時間「" + displayDiff + "」です。"
      : "時間が予定より「" + displayDiff + "」オーバーしています。";
  } else {
    displayDiff = isPlus
      ? "校正をする残り時間「" + displayDiff + "」です。"
      : "時間が予定より「" + displayDiff + "」オーバーしています。";
  }
  aSetDisplayRemainingTime(displayDiff);
  aSetTimerId(setTimeout(getRemainingTime, 1000));
  startTime = Date.now();
};
