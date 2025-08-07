import { useEffect, useState, useRef } from "react";
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

  const settingTime1 = Number(currentData?.template?.time[1]) * 60;
  const getDisplayRemainingTime = (aSeconds: number) => {
    const seconds = Math.abs(aSeconds);
    const displayTime =
      seconds < 60
        ? `${seconds}秒`
        : seconds % 60
        ? Math.floor(seconds / 60) + "分" + (seconds % 60) + "秒"
        : Math.floor(seconds / 60) + "分";
    if (aSeconds > 0) {
      return `方向性・構成を決める残り時間「${displayTime}」です。`;
    }
    return `時間が予定より「${displayTime}」オーバーしています。`;
  };

  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [displayRemainingTime, setDisplayRemainingTime] = useState<string>(
    getDisplayRemainingTime(settingTime1)
  );
  const timerId = useRef<number>(0);

  const onsubmit: SubmitHandler<Inputs> = (values) => {
    clearTimeout(timerId.current);
    const currentData = data.get(currentKey);
    if (currentData) {
      currentData.notes = values.notes;
      currentData.status = values.status;
      currentData.timeTaken[0] = timeTaken;
      data.set(currentKey, currentData);
      localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
      if (onUpdate) {
        onUpdate(values.status, currentKey);
      }
    }
  };

  const onerror: SubmitErrorHandler<Inputs> = (err) => console.log(err);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    timerId.current = setTimeout(() => {
      const newTimeTaken = timeTaken + 1;
      const newRemainingTime = settingTime1 - newTimeTaken;
      setTimeTaken(newTimeTaken);
      setDisplayRemainingTime(getDisplayRemainingTime(newRemainingTime));
    }, 1000);
    return () => {
      clearTimeout(timerId.current);
    };
  }, [timeTaken]);

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
