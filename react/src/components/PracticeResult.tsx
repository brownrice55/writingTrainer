import Stack from "react-bootstrap/Stack";
import type { Inputs } from "../types/inputs.type";
import { getDisplayRemainingTimeOrTimeTaken } from "../utils/common";

type PracticeResultProps = {
  currentData?: Inputs;
};

export default function PracticeResult({ currentData }: PracticeResultProps) {
  const displayTimeTaken = getDisplayRemainingTimeOrTimeTaken(
    currentData?.timeTaken,
    0,
    "timeTaken"
  );
  return (
    <>
      <Stack gap={3}>
        <div className="bg-secondary-subtle pt-4 pb-2 px-4">
          <p>
            設定：
            {currentData?.template?.templatename}
          </p>
          <p>
            トピック：
            {currentData?.topic}
          </p>
          <p>実施日時：{currentData?.implementationDate}</p>
          <p>所要時間：{displayTimeTaken}</p>
        </div>
        <div className="p-2">{currentData?.notes}</div>
        {currentData?.texts.map((val, index) => {
          return (
            <div key={index}>
              <div className="p-2">{val}</div>
            </div>
          );
        })}
      </Stack>
    </>
  );
}
