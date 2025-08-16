import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import type { Inputs } from "../types/inputs.type";
import type { InputsTemplate } from "../types/inputsTemplate.type";
import type { InputsTopic } from "../types/inputsTopic.type";
import FormSelectTemplateAndTopic from "./FormSelectTemplateAndTopic";

type ModalForSelectingTemplateAndTopicProps = {
  data: Map<number, Inputs>;
  currentData?: Inputs;
  templateData: Map<number, InputsTemplate>;
  topicData: InputsTopic;
  currentKey: number;
  register: any;
  errors: any;
  getValues: any;
  trigger: any;
  onUpdate?: (value: number) => void;
};

export default function ModalForSelectingTemplateAndTopic({
  data,
  currentData,
  templateData,
  topicData,
  currentKey,
  register,
  errors,
  getValues,
  trigger,
  onUpdate,
}: ModalForSelectingTemplateAndTopicProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleTriggerTopic = () => {
    const values = getValues();
    if (!values.topic) {
      return;
    }
    let isChanged = false;
    if (currentData && currentData?.templatekey !== values.templatekey) {
      const templateKey = Number(values.templatekey);
      const newlySelectedTemplate = templateData.get(templateKey);
      currentData.templatekey = templateKey;
      currentData.template = newlySelectedTemplate;
      if (onUpdate) {
        onUpdate(Number(newlySelectedTemplate?.paragraphs));
      }
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

  return (
    <>
      {" "}
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
    </>
  );
}
