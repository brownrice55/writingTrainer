import { useState } from "react";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
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

  const pageName = window.location.pathname.split("/").pop();

  const [voiceIconOn, setVoiceIconOn] = useState<boolean>(false);

  const voice = new SpeechSynthesisUtterance(currentData?.texts?.toString());
  voice.lang = "en-US";
  const handleVoice = () => {
    if (!speechSynthesis.speaking) {
      speechSynthesis.cancel();
      speechSynthesis.speak(voice);
      setVoiceIconOn(true);
    } else {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        setVoiceIconOn(true);
      } else {
        speechSynthesis.pause();
        setVoiceIconOn(false);
      }
    }
    voice.onend = () => {
      speechSynthesis.cancel();
      setVoiceIconOn(false);
    };
  };

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
        <Row className="px-2 pt-2">
          <Col sm={pageName === "practiceList" ? 10 : 12}>
            {currentData?.notes}
          </Col>
          {pageName === "practiceList" ? (
            <Col className="text-end">
              <Button variant="secondary" onClick={handleVoice}>
                {voiceIconOn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-volume-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z" />
                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z" />
                    <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-volume-off-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.717 3.55A.5.5 0 0 1 11 4v8a.5.5 0 0 1-.812.39L7.825 10.5H5.5A.5.5 0 0 1 5 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06" />
                  </svg>
                )}
              </Button>
            </Col>
          ) : (
            ""
          )}
        </Row>
        {currentData?.texts.map((val, index) => {
          return (
            <div key={index}>
              <div className="p-2">{val}</div>
            </div>
          );
        })}
        <div className="text-end my-3">
          合計{currentData?.totalWords}語/{currentData?.template?.wordcount[0]}-
          {currentData?.template?.wordcount[1]}語
        </div>
      </Stack>
    </>
  );
}
