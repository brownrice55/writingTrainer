import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import type { Inputs } from "../types/inputs.type";
import PracticeResult from "./PracticeResult";

type FormPracticeResultProps = {
  data: Map<number, Inputs>;
  currentKey: number;
};

export default function FormPracticeResult({
  data,
  currentKey,
}: FormPracticeResultProps) {
  const currentData = data.get(currentKey);

  const handleDeleteThisPractice = () => {
    data.delete(currentKey);
    localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
  };

  const navigate = useNavigate();
  const handleGoToList = () => {
    navigate("/practiceList");
  };

  return (
    <>
      <p>
        お疲れ様でした。今回の練習を保存しました。
        <br />
        今回の練習を保存しない場合は、一番下の「保存しない」ボタンを押してください。
      </p>
      <PracticeResult currentData={currentData} />

      <div className="text-center">
        <Button
          variant="primary"
          className="py-3 px-4 me-4"
          onClick={handleGoToList}
        >
          過去の練習一覧へ
        </Button>
        <Button
          variant="primary"
          className="py-3 px-4"
          onClick={handleDeleteThisPractice}
        >
          今回の練習を保存しない
        </Button>
      </div>
    </>
  );
}
