import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import App from "../App";
import Practice from "../pages/Practice";
import TopicSettings from "../pages/TopicSettings";
import TemplateSettings from "../pages/TemplateSettings";
import NotFound from "../pages/NotFound";

const routesLink = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/" element={<Practice />} />
      <Route path="/templateSettings" element={<TemplateSettings />} />
      <Route path="/topicSettings" element={<TopicSettings />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default routesLink;
