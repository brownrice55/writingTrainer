import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import type { InputsTemplate } from "../types/inputsTemplate.type";
import type { InputsTopic } from "../types/inputsTopic.type";

type FormSelectTemplateAndTopicProps = {
  templateData: Map<number, InputsTemplate>;
  topicData: InputsTopic;
  register: any;
  errors: any;
};

export default function FormSelectTemplateAndTopic({
  templateData,
  topicData,
  register,
  errors,
}: FormSelectTemplateAndTopicProps) {
  return (
    <>
      <Form.Group className="my-4">
        <Row className="py-3">
          <Col sm={3}>
            <Form.Label htmlFor="template">設定</Form.Label>
          </Col>
          <Col sm={9} className="text-start">
            <Form.Select
              aria-label="template"
              id="template"
              {...register("templatekey")}
            >
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
    </>
  );
}
