import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import type { Inputs } from "../types/inputs.type";
import type { InputsTemplate } from "../types/inputsTemplate.type";
import type { InputsTopic } from "../types/inputsTopic.type";
import { getData } from "../utils/common";
import FormSelectTemplateAndTopic from "./FormSelectTemplateAndTopic";

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

        <FormSelectTemplateAndTopic
          templateData={templateData}
          topicData={topicData}
          register={register}
          errors={errors}
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
