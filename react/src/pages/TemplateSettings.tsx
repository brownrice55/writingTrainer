import { useState } from "react";
import Header from "../components/Header";
import FormTemplate from "../components/FormTemplate";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";
import { getTemplateData } from "../utils/common";
import type { InputsTemplate } from "../types/inputsTemplate.type";

export default function TemplateSettings() {
  const originalTemplateData = getTemplateData();
  const [templateData, setTemplateData] =
    useState<Map<number, InputsTemplate>>(originalTemplateData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [keyNumber, setKeyNumber] = useState<number>(0);

  const handleStartEdit = (aKey: number) => {
    setKeyNumber(aKey);
    setIsEditing(true);
  };

  const handleUpdate = (isEditing: boolean) => {
    if (!isEditing) {
      setIsEditing(false);
      const originalTemplateData = getTemplateData();
      setTemplateData(originalTemplateData);
    }
  };

  return (
    <>
      <Header
        title="テンプレート設定"
        description="テンプレート設定のページです"
        keywords="テンプレート設定"
      />
      <h1 className="fs-6 py-3">テンプレート設定</h1>

      {templateData.size ? (
        <Tabs fill defaultActiveKey="list" id="tab" className="mb-3">
          <Tab eventKey="list" title="一覧">
            {isEditing ? (
              <FormTemplate
                keyNumber={keyNumber}
                originalTemplateData={templateData}
                onUpdate={handleUpdate}
                isEditing={isEditing}
              />
            ) : (
              <ListGroup>
                {[...templateData].map(([key, val]) => (
                  <ListGroup.Item
                    key={key}
                    onClick={() => handleStartEdit(key)}
                    className="my-3"
                  >
                    {val.templatename}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Tab>
          <Tab eventKey="add" title="テンプレート追加">
            <FormTemplate keyNumber={0} originalTemplateData={templateData} />
          </Tab>
        </Tabs>
      ) : (
        <FormTemplate keyNumber={0} originalTemplateData={templateData} />
      )}
    </>
  );
}
