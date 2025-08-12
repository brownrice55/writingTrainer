import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  getTime,
  getImplementationDate,
  getDisplayRemainingTimeOrTimeTaken,
} from "../utils/common";
import type { Inputs } from "../types/inputs.type";
import type { InputsTemplate } from "../types/inputsTemplate.type";
import type { InputsTopic } from "../types/inputsTopic.type";
import ModalForSelectingTemplateAndTopic from "./ModalForSelectingTemplateAndTopic";

type FormPractice2Props = {
  data: Map<number, Inputs>;
  templateData: Map<number, InputsTemplate>;
  topicData: InputsTopic;
  status: number;
  currentKey: number;
  onUpdate?: (value1: number, value2: number) => void;
};

export default function FormPractice2({
  data,
  templateData,
  topicData,
  status,
  currentKey,
  onUpdate,
}: FormPractice2Props) {
  const currentData = data.get(currentKey);
  const originalParagraphs = Number(currentData?.template?.paragraphs);

  let settingTime = Number(currentData?.template?.time[status]) * 60;

  const [timeTaken, setTimeTaken] = useState<number>(0);
  const initialRemainingTime = getDisplayRemainingTimeOrTimeTaken(
    settingTime,
    status,
    "remainingTime"
  );
  const [displayRemainingTime, setDisplayRemainingTime] = useState<
    string | undefined
  >(initialRemainingTime);
  const timerId = useRef<number>(0);

  const defaultValues = {
    templatekey: currentData?.templatekey,
    topic: currentData?.topic,
    texts: currentData?.texts ?? Array(originalParagraphs).fill(""),
  };
  const [paragraphs, setParagraphs] = useState<number>(originalParagraphs);
  const [isProofreadingArray, setIsProofreadingArray] = useState<boolean[]>(
    Array(paragraphs).fill(false)
  );

  const [wordCountArray, setWordCountArray] = useState<number[]>(
    currentData && currentData.words
      ? currentData?.words
      : Array(paragraphs).fill(0)
  );
  const totalWordCount: number = wordCountArray.reduce((acc, val) => {
    return acc + val;
  });

  const saveBtnText: string = status === 2 ? "校正をする" : "終了する";
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    getValues,
    trigger,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>({
    defaultValues,
    mode: "onChange",
  });

  const handleUpdate = (paragraphsLength: number) => {
    setParagraphs(paragraphsLength);
  };

  const onsubmit: SubmitHandler<Inputs> = (values) => {
    clearTimeout(timerId.current);
    if (currentData) {
      currentData.texts = values.texts.filter((val) => val);
      currentData.status = values.status;
      currentData.totalWords = totalWordCount;
      currentData.words = wordCountArray;
      currentData.timeTaken[status - 1] = timeTaken;
      if (currentData.status === 4) {
        const endTime = Date.now();
        const endTimeArray = getTime(endTime);
        currentData.implementationDate = getImplementationDate(
          currentData.startTimeArray,
          endTimeArray
        );
      }
      data.set(currentKey, currentData);
      localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
    }
    setTimeTaken(0);
    settingTime = Number(currentData?.template?.time[status]) * 60;
    setDisplayRemainingTime(
      getDisplayRemainingTimeOrTimeTaken(settingTime, status, "remainingTime")
    );
    if (onUpdate) {
      onUpdate(values.status, currentKey);
    }
  };

  const onerror: SubmitErrorHandler<Inputs> = (err) => console.log(err);

  const handleRevise = (index: number, event?: any) => {
    const btnName = event?.currentTarget.name;
    if (btnName === "cancel") {
      resetField(`texts.${index}`);
      const values = getValues();
      const newWordCountArray = [...wordCountArray];
      newWordCountArray[index] = values?.texts[index].split(/\s+/).length;
      setWordCountArray(newWordCountArray);
    }
    const updatedIsProofreading = [...isProofreadingArray];
    updatedIsProofreading[index] = !updatedIsProofreading[index];
    setIsProofreadingArray(updatedIsProofreading);
    const doesFalseExist = updatedIsProofreading.filter((val) => val === false);
    setIsDisabled(doesFalseExist.length ? true : false);
  };

  const handleCountWordNum = (e: any, index: number) => {
    const valueArray = e.target.value ? e.target.value.split(/\s+/) : "";
    const newWordCountArray = [...wordCountArray];
    newWordCountArray[index] = valueArray ? valueArray.length : 0;
    setWordCountArray(newWordCountArray);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    reset(defaultValues);
    setIsProofreadingArray(
      Number(status) === 2
        ? Array(paragraphs).fill(false)
        : Array(paragraphs).fill(true)
    );
  }, [data, reset]);

  useEffect(() => {
    timerId.current = setTimeout(() => {
      const newTimeTaken = timeTaken + 1;
      const newRemainingTime = settingTime - newTimeTaken;
      setTimeTaken(newTimeTaken);
      setDisplayRemainingTime(
        getDisplayRemainingTimeOrTimeTaken(
          newRemainingTime,
          status,
          "remainingTime"
        )
      );
    }, 1000);
    return () => {
      clearTimeout(timerId.current);
    };
  }, [timeTaken, status]);

  const [alert, setAlert] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    const alertText =
      totalWordCount < Number(currentData?.template?.wordcount[0]) ||
      totalWordCount > Number(currentData?.template?.wordcount[1])
        ? `合計${currentData?.template?.wordcount[0]}〜${currentData?.template?.wordcount[1]}語以内で書いてください。`
        : "";
    setAlert(alertText);
    setIsDisabled(alertText ? true : false);
  }, [totalWordCount]);

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
          onUpdate={handleUpdate}
        />
        <p>{displayRemainingTime}</p>
        <p>メモ</p>
        <p>{currentData?.notes}</p>
        <Form.Group>
          {Array(paragraphs)
            .fill(0)
            .map((_, index) => {
              const name = "texts" + index;
              return (
                <div key={index}>
                  <div className="position-relative">
                    <Form.Control
                      id={name}
                      as="textarea"
                      rows={8}
                      className="my-2"
                      disabled={isProofreadingArray[index]}
                      {...register(`texts.${index}`, {
                        required: "必須です",
                        onChange: (e) => handleCountWordNum(e, index),
                      })}
                    />
                    {status === 3 && isProofreadingArray[index] ? (
                      <Button
                        onClick={() => handleRevise(index)}
                        className="position-absolute bottom-0 end-0 me-2 mb-2"
                      >
                        修正する
                      </Button>
                    ) : status === 3 && !isProofreadingArray[index] ? (
                      <div className="position-absolute bottom-0 end-0">
                        <Button
                          onClick={(e) => handleRevise(index, e)}
                          className="me-2 mb-2"
                          name="cancel"
                        >
                          キャンセル
                        </Button>
                        <Button
                          onClick={(e) => handleRevise(index, e)}
                          className="me-2 mb-2"
                          name="revise"
                          disabled={alert ? true : false}
                        >
                          修正完了
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <Row className="mb-4">
                    <Col className="text-danger">
                      {errors.texts?.[index]?.message}
                    </Col>
                    <Col className="text-end">{wordCountArray[index]}語</Col>
                  </Row>
                </div>
              );
            })}
        </Form.Group>
        <div className="text-end">
          合計{totalWordCount}語/{currentData?.template?.wordcount[0]}-
          {currentData?.template?.wordcount[1]}語
        </div>

        <Form.Control
          type="hidden"
          {...register("status", {
            valueAsNumber: true,
          })}
          value={status + 1}
        />

        <div className="text-danger mt-2 mb-4">{alert}</div>

        <div className="text-center">
          <Button
            variant="primary"
            type="submit"
            className="py-3 px-5"
            name="btn"
            disabled={isDisabled}
          >
            {saveBtnText}
          </Button>
        </div>
      </Form>
    </>
  );
}
