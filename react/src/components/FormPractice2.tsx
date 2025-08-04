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
  const defaultValues = {
    templatekey: currentData?.templatekey,
    topic: currentData?.topic,
  };
  const [paragraphs, setParagraphs] = useState<number>(
    Number(currentData?.template?.paragraphs)
  );
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedTemplate, setSelectedTemplate] = useState<InputsTemplate>();
  const [resaveTemplate, setResaveTemplate] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>({
    defaultValues,
    mode: "onChange",
  });

  const onsubmit: SubmitHandler<Inputs> = (values) => {
    if (currentData) {
      if (resaveTemplate) {
        currentData.template = selectedTemplate;
      }
      currentData.texts = values.texts;
      data.set(currentKey, currentData);
      localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
    }
    if (onUpdate) {
      onUpdate(values.status, currentKey);
    }
  };

  const onerror: SubmitErrorHandler<Inputs> = (err) => {
    if (err.topic === undefined) {
      const templateKey = err.templatekey;
      const newlySelectedTemplate = templateData.get(Number(templateKey));
      setParagraphs(Number(newlySelectedTemplate?.paragraphs));
      setSelectedTemplate(newlySelectedTemplate);
      setResaveTemplate(true);
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
      <Form id="mainForm" onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        <Row className="px-2 py-3 mb-4 bg-secondary-subtle">
          <Col>設定</Col>
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
                <Button
                  variant="primary"
                  name="modalBtn"
                  type="submit"
                  form="mainForm"
                >
                  保存する
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
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
                  <Form.Control
                    id={name}
                    as="textarea"
                    rows={8}
                    className="my-2"
                    {...register(`texts.${index}`, {
                      required: "必須です",
                    })}
                  />
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
            校正する
          </Button>
        </div>
      </Form>
    </>
  );
}
