import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import type { Inputs } from "../types/inputs.type";
import type { InputsTemplate } from "../types/inputsTemplate.type";
import type { InputsTopic } from "../types/inputsTopic.type";
import FormSelectTemplateAndTopic from "./FormSelectTemplateAndTopic";

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
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const handleTriggerTopic = () => {
    const values = getValues();
    let isChanged = false;
    if (currentData && currentData?.templatekey !== values.templatekey) {
      const templateKey = Number(values.templatekey);
      const newlySelectedTemplate = templateData.get(templateKey);
      currentData.templatekey = templateKey;
      currentData.template = newlySelectedTemplate;
      isChanged = true;
    }
    if (currentData && currentData?.topic !== values.topic) {
      currentData.topic = values.topic;
      isChanged = true;
    }
    if (currentData && isChanged) {
      data.set(currentKey, currentData);
      localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
    }
    trigger("topic");
    setShow(false);
  };

  const onsubmit: SubmitHandler<Inputs> = (values) => {
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

  const onerror: SubmitErrorHandler<Inputs> = (err) => {
    if (err.topic === undefined) {
      setShow(false);
    }
    console.log(err);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        <Row className="px-2 py-3 mb-4 bg-secondary-subtle">
          <Col>
            テンプレート：{currentData?.template?.templatename}
            <br />
            トピック：{currentData?.topic}
          </Col>
          <Col className="text-end">
            <Button variant="secondary" onClick={handleShow}>
              変更
            </Button>
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <FormSelectTemplateAndTopic
                  templateData={templateData}
                  topicData={topicData}
                  register={register}
                  errors={errors}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  保存せずに閉じる
                </Button>
                <Button variant="primary" onClick={() => handleTriggerTopic()}>
                  保存する
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
        <p>
          まず、方向性、構成を決めます。
          <br />
          方向性・構成を決める残り時間「0秒」です。
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
