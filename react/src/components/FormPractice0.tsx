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
import { getData } from "../utils/common";

type FormPractice0Props = {
  templateData: Map<number, InputsTemplate>;
  topicData: InputsTopic;
  status: number;
  onUpdate?: (value: number) => void;
};
export default function FormPractice0({
  templateData,
  topicData,
  status,
  onUpdate,
}: FormPractice0Props) {
  const defaultValues = {
    template: "",
    topic: "",
  };

  const originalData = getData();
  const [data, setData] = useState<Map<number, Inputs>>(originalData);

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
    data.set(1, values); // 仮　templateDataも全て追加する
    localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
    setData(data);
    const newStatus = status + 1;
    if (onUpdate) {
      onUpdate(newStatus);
    }
  };

  const onerror: SubmitErrorHandler<InputsTemplate> = (err) => console.log(err);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        <p>設定とトピックを選んで「スタート」を押してください。</p>

        <Form.Group className="my-4">
          <Row className="py-3">
            <Col sm={3}>
              <Form.Label htmlFor="template">設定</Form.Label>
            </Col>
            <Col sm={9} className="text-start">
              <Form.Select aria-label="template" id="template">
                {[...templateData].map(([key, val]) => {
                  return (
                    <option value={key} key={key}>
                      {val.templatename}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
          </Row>
          <Row className="py-3">
            <Col sm={3}>
              <Form.Label htmlFor="topic">トピック</Form.Label>
            </Col>
            <Col sm={9} className="text-start">
              <Form.Control
                id="topic"
                as="input"
                list="topics"
                {...register("topic", {
                  required: "必須です",
                })}
              />
              <datalist id="topics">
                {topicData.topics.map((val, index) => (
                  <option value={val.topic} key={index} />
                ))}
              </datalist>
              <div className="text-danger pt-2">{errors.topic?.message}</div>
            </Col>
          </Row>
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit" className="py-3 px-5">
            次へ
          </Button>
        </div>
      </Form>
    </>
  );
}
