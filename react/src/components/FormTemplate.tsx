import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import type { InputsTemplate } from "../types/inputsTemplate.type";

type FormTemplateProps = {
  keyNumber: number;
  isEditing?: boolean;
  onUpdate?: (value: boolean) => void;
  originalTemplateData: Map<number, InputsTemplate>;
};

export default function FormTemplate({
  keyNumber,
  isEditing,
  onUpdate,
  originalTemplateData,
}: FormTemplateProps) {
  const [templateData, setTemplateData] =
    useState<Map<number, InputsTemplate>>(originalTemplateData);
  let selectedTemplateData: InputsTemplate | undefined;
  if (keyNumber) {
    selectedTemplateData = templateData.get(keyNumber);
  }

  const defaultValues = {
    templatename: "",
    paragraphs: 1,
    wordcount: [],
    time: [],
    timeForDisplay: [""],
  };

  const keysArray: number[] = templateData.size
    ? Array.from(templateData.keys())
    : [];
  let nextId: number = keyNumber
    ? keyNumber
    : templateData.size
    ? keysArray[keysArray.length - 1]
    : 0;

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm<InputsTemplate>({
    defaultValues,
    mode: "onChange",
  });

  const onsubmit: SubmitHandler<InputsTemplate> = (values) => {
    if (!keyNumber) {
      ++nextId;
    }
    templateData.set(nextId, values);
    localStorage.setItem(
      "WritingTrainerTemplate",
      JSON.stringify([...templateData])
    );
    setTemplateData(templateData);

    if (keyNumber && onUpdate) {
      onUpdate(!isEditing);
    } else {
      reset();
    }
  };

  const onerror: SubmitErrorHandler<InputsTemplate> = (err) => console.log(err);

  const handleCancel = () => {
    if (keyNumber && onUpdate) {
      onUpdate(!isEditing);
    } else {
      reset();
    }
  };

  useEffect(() => {
    if (keyNumber) {
      const selectedTemplateData = templateData.get(keyNumber);
      if (selectedTemplateData) {
        reset(selectedTemplateData);
      }
    } else {
      reset({
        templatename: "",
        paragraphs: 1,
        wordcount: [],
        time: [],
        timeForDisplay: [""],
      });
    }
  }, [keyNumber, selectedTemplateData, reset]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      {keyNumber ? (
        <Button className="my-3" variant="secondary" onClick={handleCancel}>
          一覧に戻る
        </Button>
      ) : (
        ""
      )}
      <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        <Form.Group className="py-3">
          <Form.Label htmlFor="templatename">設定名</Form.Label>
          <Form.Control
            id="templatename"
            as="input"
            {...register("templatename", {
              required: "必須です",
            })}
          />
          <div className="text-danger pt-2">{errors.templatename?.message}</div>
        </Form.Group>

        <Form.Group className="my-4">
          <p>書式設定</p>
          <Row className="py-3">
            <Col sm={3}>
              <Form.Label htmlFor="paragraphs">段落数</Form.Label>
            </Col>
            <Col sm={9} className="text-start">
              <Form.Select
                aria-label="paragraphs"
                id="paragraphs"
                {...register("paragraphs")}
              >
                {Array(10)
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <option value={index + 1} key={index}>
                        {index + 1}
                      </option>
                    );
                  })}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>文字数</p>
            </Col>
            <Col>
              <Form.Control
                id="wordcount1"
                as="input"
                {...register("wordcount.0", {
                  required: "必須です",
                })}
              />
              <div className="text-danger pt-2">
                {errors.wordcount?.[0]?.message}
              </div>
            </Col>
            <Col className="text-center">〜</Col>
            <Col className="text-end">
              <Form.Control
                id="wordcount2"
                as="input"
                {...register("wordcount.1", {
                  required: "必須です",
                })}
              />
              <div className="text-danger pt-2 text-start">
                {errors.wordcount?.[1]?.message}
              </div>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="my-4">
          <p>時間制限・配分</p>
          <Row className="py-3">
            <Col sm={3}>
              <Form.Label htmlFor="time1">合計</Form.Label>
            </Col>
            <Col sm={9} className="text-start">
              <Form.Select
                aria-label="time1"
                id="time1"
                {...register("time.0", {
                  required: true,
                  validate: (val) => {
                    const { time } = getValues();
                    const sum = [time?.[1], time?.[2], time?.[3]]
                      .map(Number)
                      .reduce((a, b) => a + b, 0);
                    return Number(val) === sum || "合計が合いません";
                  },
                })}
              >
                {Array(60)
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <option value={index + 1} key={index}>
                        {index + 1}
                      </option>
                    );
                  })}
              </Form.Select>
              <div className="text-danger pt-2 text-start">
                {errors.time?.[0]?.message}
              </div>
            </Col>
          </Row>
          <Row className="py-3">
            <Col sm={3}>
              <Form.Label htmlFor="time2">方向性・構成を決める時間</Form.Label>
            </Col>
            <Col sm={9} className="text-start">
              <Form.Select
                aria-label="time2"
                id="time2"
                {...register("time.1")}
              >
                {Array(61)
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <option value={index} key={index}>
                        {index}
                      </option>
                    );
                  })}
              </Form.Select>
            </Col>
          </Row>
          <Row className="py-3">
            <Col sm={3}>
              <Form.Label htmlFor="time3">文章を書く時間</Form.Label>
            </Col>
            <Col sm={9} className="text-start">
              <Form.Select
                aria-label="category"
                id="time3"
                {...register("time.2")}
              >
                {Array(61)
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <option value={index} key={index}>
                        {index}
                      </option>
                    );
                  })}
              </Form.Select>
            </Col>
          </Row>
          <Row className="py-3">
            <Col sm={3}>
              <Form.Label htmlFor="time4">校正する時間</Form.Label>
            </Col>
            <Col sm={9} className="text-start">
              <Form.Select
                aria-label="category"
                id="time4"
                {...register("time.3")}
              >
                {Array(61)
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <option value={index} key={index}>
                        {index}
                      </option>
                    );
                  })}
              </Form.Select>
            </Col>
          </Row>

          <div className="text-danger pt-2">{errors.time?.message}</div>
        </Form.Group>

        <div className="text-center">
          {keyNumber ? (
            <Button
              variant="secondary"
              type="button"
              className="py-3 px-4 me-4"
              onClick={handleCancel}
            >
              キャンセルする
            </Button>
          ) : (
            ""
          )}
          <Button variant="primary" type="submit" className="py-3 px-5">
            {keyNumber ? "上書き保存する" : "追加する"}
          </Button>
        </div>
      </Form>
    </>
  );
}
