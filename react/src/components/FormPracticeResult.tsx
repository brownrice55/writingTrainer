import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import type { Inputs } from "../types/inputs.type";

type FormPracticeResultProps = {
  data: Map<number, Inputs>;
  currentKey: number;
};

export default function FormPracticeResult({
  data,
  currentKey,
}: FormPracticeResultProps) {
  const currentData = data.get(currentKey);

  const deleteThisPractice = () => {
    data.delete(currentKey);
    localStorage.setItem("WritingTrainer", JSON.stringify([...data]));
  };

  return (
    <>
      <p>
        お疲れ様でした。今回の練習を保存しました。
        <br />
        今回の練習を保存しない場合は、一番下の「保存しない」ボタンを押してください。
      </p>
      <Stack gap={3}>
        <div className="bg-light pt-4 pb-2 px-4">
          <p>
            設定：
            {currentData?.template?.templatename}
          </p>
          <p>
            トピック：
            {currentData?.topic}
          </p>
          <p>実施日時：</p>
          <p>所要時間：</p>
        </div>
        <div className="p-2">{currentData?.notes}</div>
        {currentData?.texts.map((val) => {
          return (
            <>
              <div className="p-2">{val}</div>
            </>
          );
        })}
      </Stack>
      <div className="text-center">
        <Button variant="primary" className="py-3 px-4 me-4">
          過去の練習一覧へ
        </Button>
        <Button
          variant="primary"
          className="py-3 px-4"
          onClick={deleteThisPractice}
        >
          今回の練習を保存しない
        </Button>
      </div>
    </>
  );
}
