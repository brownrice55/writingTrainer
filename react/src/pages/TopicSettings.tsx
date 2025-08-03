import Header from "../components/Header";
import FormTopic from "../components/FormTopic";

export default function TopicSettings() {
  return (
    <>
      <Header
        title="トピック設定"
        description="トピック設定のページです"
        keywords="トピック設定"
      />
      <h1 className="fs-6 py-3">トピック設定</h1>
      <FormTopic />
    </>
  );
}
