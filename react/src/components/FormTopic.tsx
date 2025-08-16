import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import type { InputsTopic } from "../types/inputsTopic.type";
import { getTopics } from "../utils/common";

export default function FormTopic() {
  const originalTopics = getTopics();
  const [topicData, setTopicData] = useState<InputsTopic>(originalTopics);
  const defaultValues = topicData;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<InputsTopic>({
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray<InputsTopic>({
    control,
    name: "topics",
    keyName: "id",
  });

  const onsubmit: SubmitHandler<InputsTopic> = (values) => {
    const inputData = values.topics
      .filter((val) => val.topic)
      .map((val) => ({ ...val, topicId: val.topicId }));
    localStorage.setItem("WritingTrainerTopic", JSON.stringify(inputData));
    setTopicData({ topics: inputData });
  };

  const onerror: SubmitErrorHandler<InputsTopic> = (err) => console.log(err);

  const handleCancel = () => {
    reset();
  };

  const handleAddField = () => {
    const lastId = topicData.topics.length
      ? Math.max(...topicData.topics.map((val) => val.topicId || 0))
      : 0;
    const nextId = lastId + 1;
    append({ topicId: nextId, topic: "" });
  };

  useEffect(() => {
    reset(topicData);
  }, [topicData]);

  return (
    <>
      <Form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        {fields.map((field: any, index: number) => (
          <Form.Group className="my-4" key={index}>
            <Row>
              <Col>
                <Form.Control
                  id={`topic${index}`}
                  as="input"
                  {...register(`topics.${index}.topic`)}
                  defaultValue={field.topic}
                />
                <Form.Control
                  type="hidden"
                  {...register(`topics.${index}.topicId`, {
                    valueAsNumber: true,
                  })}
                  value={field.topicId ?? 0}
                />
                <div className="text-danger pt-2">
                  {!index && errors.topics?.[index]?.topic?.message}
                </div>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className="py-1 px-2"
                  onClick={() => remove(index)}
                >
                  削除
                </Button>
              </Col>
            </Row>
          </Form.Group>
        ))}

        <div className="text-end">
          <Button
            variant="primary"
            className="py-2 px-4 me-3"
            onClick={handleAddField}
          >
            トピック名を追加する
          </Button>
        </div>
        <div className="text-center mt-5">
          <Button
            variant="primary"
            className="py-3 px-5 me-3"
            onClick={handleCancel}
          >
            キャンセルする
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="py-3 px-5"
            disabled={!isDirty || !isValid}
          >
            保存する
          </Button>
        </div>
      </Form>
    </>
  );
}
