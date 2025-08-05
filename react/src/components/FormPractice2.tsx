import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

  const defaultValues = {
    templatekey: currentData?.templatekey,
    topic: currentData?.topic,
    texts: currentData?.texts ?? Array(originalParagraphs).fill(""),
  };
  const [paragraphs, setParagraphs] = useState<number>(originalParagraphs);
  const [isProofreadingArray, setIsProofreadingArray] = useState<boolean[]>(
    Array(paragraphs).fill(false)
  );

  const saveBtnText: string = status === 2 ? "校正をする" : "終了する";
  const {
    register,
    handleSubmit,
    reset,
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
    if (currentData) {
      currentData.texts = values.texts;
      currentData.status = values.status;
      data.set(currentKey, currentData);
      localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
    }
    if (onUpdate) {
      onUpdate(values.status, currentKey);
    }
  };

  const onerror: SubmitErrorHandler<Inputs> = (err) => console.log(err);

  const handleRevise = (index: number, event?: any) => {
    // const btnName = event?.currentTarget.name;
    const updatedIsProofreading = [...isProofreadingArray];
    updatedIsProofreading[index] = !updatedIsProofreading[index];
    setIsProofreadingArray(updatedIsProofreading);
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
        <p>時間が予定より「0秒」オーバーしています。</p>
        <p>メモ</p>
        <p>メモが入ります。</p>
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
                    <Col className="text-end">語</Col>
                  </Row>
                </div>
              );
            })}
        </Form.Group>
        <div className="text-end">
          合計0語/{currentData?.template?.wordcount[0]}-
          {currentData?.template?.wordcount[1]}語
        </div>

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
            {saveBtnText}
          </Button>
        </div>
      </Form>
    </>
  );
}
