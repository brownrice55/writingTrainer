import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { DoesDataExistContext } from "./contexts/context";

function App() {
  const context = useContext(DoesDataExistContext);
  if (!context) {
    throw new Error("Provider missing!");
  }
  const { doesDataExist } = context;

  const handleStopVoice = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  };
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Writing Trainer</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {doesDataExist ? (
                <Nav.Link href="/" onClick={handleStopVoice}>
                  練習
                </Nav.Link>
              ) : (
                ""
              )}
              {doesDataExist ? (
                <Nav.Link href="/practiceList" onClick={handleStopVoice}>
                  過去の練習一覧
                </Nav.Link>
              ) : (
                ""
              )}
              <Nav.Link href="/templateSettings" onClick={handleStopVoice}>
                テンプレート設定
              </Nav.Link>
              <Nav.Link href="/topicSettings" onClick={handleStopVoice}>
                トピック設定
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="pt-3">
        <Outlet />
      </Container>
    </>
  );
}

export default App;
