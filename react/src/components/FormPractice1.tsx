import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type { Inputs } from "../types/inputs.type";
import type { InputsTemplate } from "../types/inputsTemplate.type";
import type { InputsTopic } from "../types/inputsTopic.type";
import ModalForSelectingTemplateAndTopic from "./ModalForSelectingTemplateAndTopic";

type FormPractice1Props = {
  data: Map<number, Inputs>;
  templateData: Map<number, InputsTemplate>;
  topicData: InputsTopic;
  status: number;
  currentKey: number;
  onUpdate?: (value1: number, value2: number) => void;
};

export default function FormPractice1({
  data,
  templateData,
  topicData,
  status,
  currentKey,
  onUpdate,
}: FormPractice1Props) {
  const currentData = data.get(currentKey);
  const defaultValues = {
    templatekey: currentData?.templatekey,
    topic: currentData?.topic,
    notes: currentData?.notes ?? "",
  };

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>({
    defaultValues,
    mode: "onChange",
  });

  const [displayRemainingTime, setDisplayRemainingTime] = useState<string>("");
  const [timerId, setTimerId] = useState<number>(0);

  const onsubmit: SubmitHandler<Inputs> = (values) => {
    clearTimeout(timerId);
    const currentData = data.get(currentKey);
    if (currentData) {
      currentData.notes = values.notes;
      currentData.status = values.status;
      data.set(currentKey, currentData);
      localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
      if (onUpdate) {
        onUpdate(values.status, currentKey);
      }
    }
  };

  const onerror: SubmitErrorHandler<Inputs> = (err) => console.log(err);

  const getRemainingTime = (aCurrentData: Inputs) => {
    if (!aCurrentData) {
      return;
    }
    let isPlus = true;
    let startTime = aCurrentData.startTime;
    const settingTime =
      Number(aCurrentData?.template?.time[aCurrentData.status]) * 60000;

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
    setDisplayRemainingTime(displayDiff);
    setTimerId(setTimeout(getRemainingTime, 1000));
    startTime = Date.now();
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (currentData) {
      getRemainingTime(currentData);
    }
  }, [timerId]);

  return (
    <>
      <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        <ModalForSelectingTemplateAndTopic
          data={data}
          currentData={currentData}
          templateData={templateData}
          topicData={topicData}
          currentKey={currentKey}
          register={register}
          errors={errors}
          getValues={getValues}
          trigger={trigger}
        />
        <p>
          まず、方向性、構成を決めます。
          <br />
          {displayRemainingTime}
        </p>
        <Form.Group className="py-3">
          <Form.Label htmlFor="notes">メモ</Form.Label>
          <Form.Control
            id="notes"
            as="textarea"
            rows={5}
            {...register("notes", {
              required: "必須です",
            })}
          />
          <div className="text-danger pt-2">{errors.notes?.message}</div>
        </Form.Group>

        <Form.Control
          type="hidden"
          {...register("status", {
            valueAsNumber: true,
          })}
          value={status + 1}
        />

        <div className="text-center">
          <Button
            variant="primary"
            type="submit"
            className="py-3 px-5"
            name="btn"
          >
            書き始める
          </Button>
        </div>
      </Form>
    </>
  );
}
