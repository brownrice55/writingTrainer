import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type { Inputs } from "../types/inputs.type";
import type { InputsTemplate } from "../types/inputsTemplate.type";
import type { InputsTopic } from "../types/inputsTopic.type";
import FormSelectTemplateAndTopic from "./FormSelectTemplateAndTopic";

type FormPractice0Props = {
  data: Map<number, Inputs>;
  templateData: Map<number, InputsTemplate>;
  topicData: InputsTopic;
  status: number;
  keyNumber: number;
  onUpdate?: (value1: number, value2: number) => void;
};
export default function FormPractice0({
  data,
  templateData,
  topicData,
  status,
  keyNumber,
  onUpdate,
}: FormPractice0Props) {
  const defaultValues = {
    templatekey: 1,
    topic: "",
  };

  const keysArray: number[] = data.size ? Array.from(data.keys()) : [];
  let nextId: number = keyNumber
    ? keyNumber
    : data.size
    ? keysArray[keysArray.length - 1] + 1
    : 1;

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
    const templateKey = Number(values.templatekey);
    const selectedTemplate = templateData.get(templateKey);
    values.template = selectedTemplate;
    data.set(nextId, values);
    localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
    if (onUpdate) {
      onUpdate(values.status, nextId);
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

        <FormSelectTemplateAndTopic
          templateData={templateData}
          topicData={topicData}
          register={register}
          errors={errors}
        />
        <Form.Control
          type="hidden"
          {...register("status", {
            valueAsNumber: true,
          })}
          value={status + 1}
        />
        <div className="text-center">
          <Button variant="primary" type="submit" className="py-3 px-5">
            次へ
          </Button>
        </div>
      </Form>
    </>
  );
}
