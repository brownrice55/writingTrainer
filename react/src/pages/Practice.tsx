import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DoesDataExistContext } from "../contexts/context";
import { getTemplateData, getTopics } from "../utils/common";
import Header from "../components/Header";
import FormPractice0 from "../components/FormPractice0";
import FormPractice1 from "../components/FormPractice1";

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
  const handleUpdate = (aStatus: number) => {
    setStatus(aStatus);
  };

  const originalTemplateData = getTemplateData();
  const originalTopicData = getTopics();
  const page = () => {
    switch (status) {
      case 0:
        return (
          <FormPractice0
            templateData={originalTemplateData}
            topicData={originalTopicData}
            status={status}
            onUpdate={handleUpdate}
          />
        );
      case 1:
        return (
          <FormPractice1
            templateData={originalTemplateData}
            topicData={originalTopicData}
            status={status}
            onUpdate={handleUpdate}
          />
        );
      // case 2:
      //   return (
      //     <FormPractice2
      //       templateData={originalTemplateData}
      //       topicData={originalTopicData}
      //       status={status}
      //       onUpdate={handleUpdate}
      //     />
      //   );
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
