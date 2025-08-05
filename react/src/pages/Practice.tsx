import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DoesDataExistContext } from "../contexts/context";
import { getData, getTemplateData, getTopics } from "../utils/common";
import type { Inputs } from "../types/inputs.type";
import Header from "../components/Header";
import FormPractice0 from "../components/FormPractice0";
import FormPractice1 from "../components/FormPractice1";
import FormPractice2 from "../components/FormPractice2";
import FormPracticeResult from "../components/FormPracticeResult";

export default function Practice() {
  const context = useContext(DoesDataExistContext);
  if (!context) {
    throw new Error("Provider missing!");
  }
  const { doesDataExist } = context;

  const navigate = useNavigate();

  useEffect(() => {
    if (!doesDataExist) {
      navigate("/templateSettings");
    }
  }, [doesDataExist]);

  const [status, setStatus] = useState<number>(0);
  const [originalData, setOriginalData] = useState<Map<number, Inputs>>(
    getData()
  );
  const [currentKey, setCurrentKey] = useState<number>(0);
  const handleUpdate = (aStatus: number, aCurrentKey: number) => {
    setStatus(aStatus);
    setOriginalData(getData());
    setCurrentKey(aCurrentKey);
  };

  const originalTemplateData = getTemplateData();
  const originalTopicData = getTopics();
  const page = () => {
    switch (status) {
      case 0:
        return (
          <FormPractice0
            data={originalData}
            templateData={originalTemplateData}
            topicData={originalTopicData}
            status={status}
            onUpdate={handleUpdate}
            keyNumber={0}
          />
        );
      case 1:
        return (
          <FormPractice1
            data={originalData}
            templateData={originalTemplateData}
            topicData={originalTopicData}
            status={status}
            currentKey={currentKey}
            onUpdate={handleUpdate}
          />
        );
      case 4:
        return (
          <FormPracticeResult data={originalData} currentKey={currentKey} />
        );
      default:
        return (
          <FormPractice2
            data={originalData}
            templateData={originalTemplateData}
            topicData={originalTopicData}
            status={status}
            currentKey={currentKey}
            onUpdate={handleUpdate}
          />
        );
    }
  };

  return (
    <>
      <Header
        title="練習"
        description="練習のページです"
        keywords="英語ライティング, ライティング 練習"
      />
      <h1 className="fs-6 py-3">練習</h1>
      {page()}
    </>
  );
}
