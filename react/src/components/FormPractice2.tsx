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
  templateData: Map<number, InputsTemplate>;
  topicData: InputsTopic;
  status: number;
  onUpdate?: (value: number) => void;
};

export default function FormPractice2({
  templateData,
  topicData,
  status,
  onUpdate,
}: FormPractice2Props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>({
    mode: "onChange",
  });

  const pharagraphLength: number = 4; //仮

  const onsubmit: SubmitHandler<Inputs> = (values) => {
    // data.set(1, values);
    // localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
    // setData(data);
    console.log(values);
    const newStatus = status + 1;
    if (onUpdate) {
      onUpdate(newStatus);
    }
  };

  const onerror: SubmitErrorHandler<Inputs> = (err) => {
    if (err.topic === undefined) {
      // テンプレート名を保存し直す
      // localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
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
          {Array(pharagraphLength)
            .fill(0)
            .map((_, index) => {
              const name = "texts" + index;
              return (
                <>
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
                </>
              );
            })}
        </Form.Group>
        <div className="text-end">合計0語/200-240語</div>

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
