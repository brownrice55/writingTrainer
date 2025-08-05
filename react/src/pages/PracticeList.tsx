import { useState } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getData } from "../utils/common";
import Header from "../components/Header";
import PracticeListDetail from "../components/PracticeListDetail";

export default function PracticeList() {
  const data = getData();
  const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
  const [currentKey, setCurrentKey] = useState<number>(0);
  const handleReview = (key: number) => {
    setIsFirstPage(false);
    setCurrentKey(key);
  };
  const handleUpdate = (value: boolean) => {
    setIsFirstPage(value);
  };

  return (
    <>
      <Header
        title="過去の練習一覧"
        description="過去の練習一覧のページです"
        keywords="過去の練習一覧"
      />
      <h1 className="fs-6 py-3">過去の練習内容の一覧</h1>
      {isFirstPage ? (
        [...data].map(([key, val]) => (
          <div key={key}>
            {val.status === 4 ? (
              <Row className="bg-secondary-subtle mt-3 p-4" key={key}>
                <Col>
                  設定：{val?.template?.templatename}
                  <br />
                  トピック：{val?.topic}
                  <br />
                  実施日時：2025/8/3 14:07
                </Col>
                <Col className="text-end">
                  <Button
                    variant="primary"
                    className="align-text-bottom"
                    onClick={() => handleReview(key)}
                  >
                    確認する
                  </Button>
                </Col>
              </Row>
            ) : (
              ""
            )}
          </div>
        ))
      ) : (
        <PracticeListDetail
          data={data}
          currentKey={currentKey}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
