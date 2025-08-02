import Header from "../components/Header";
import FormTemplate from "../components/FormTemplate";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

export default function TemplateSettings() {
  return (
    <>
      <Header
        title="テンプレート設定"
        description="テンプレート設定のページです"
        keywords="テンプレート設定"
      />
      <h1 className="fs-6 py-3">テンプレート設定</h1>
      <Tabs fill defaultActiveKey="list" id="tab" className="mb-3">
        <Tab eventKey="list" title="一覧"></Tab>
        <Tab eventKey="add" title="テンプレート追加">
          <FormTemplate keyNumber={0} />
        </Tab>
      </Tabs>
    </>
  );
}
