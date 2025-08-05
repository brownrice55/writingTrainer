import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import type { Inputs } from "../types/inputs.type";
import PracticeResult from "../components/PracticeResult";

type PracticeListDetailProps = {
  data: Map<number, Inputs>;
  currentKey: number;
  onUpdate: (value: boolean) => void;
};
export default function PracticeListDetail({
  data,
  currentKey,
  onUpdate,
}: PracticeListDetailProps) {
  const currentData = data.get(currentKey);
  const handleDeleteThisPractice = () => {
    data.delete(currentKey);
    localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
    onUpdate(true);
  };

  const navigate = useNavigate();
  const handleGoToPractice = () => {
    navigate("/");
  };

  const handleGoToList = () => {
    onUpdate(true);
  };

  return (
    <>
      <Button variant="secondary" className="mb-4" onClick={handleGoToList}>
        一覧に戻る
      </Button>
      <PracticeResult currentData={currentData} />
      <div className="text-center">
        <Button
          variant="primary"
          className="py-3 px-5 me-4"
          onClick={handleGoToList}
        >
          一覧に戻る
        </Button>
        <Button
          variant="primary"
          className="py-3 px-5"
          onClick={handleGoToPractice}
        >
          練習をする
        </Button>
      </div>
      <div className="text-center mt-4">
        <Button
          variant="primary"
          className="py-3 px-5"
          onClick={handleDeleteThisPractice}
        >
          この練習データを削除する
        </Button>
      </div>
    </>
  );
}
