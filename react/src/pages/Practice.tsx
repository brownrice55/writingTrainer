import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { DoesDataExistContext } from "../contexts/context";

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

  return (
    <>
      <Header
        title="練習"
        description="練習のページです"
        keywords="英語ライティング, ライティング 練習"
      />
      <p>練習</p>
    </>
  );
}
