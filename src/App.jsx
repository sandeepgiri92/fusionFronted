import { SpeedInsights } from "@vercel/speed-insights/react";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <AppRoutes />
      <SpeedInsights />
    </>
  );
};

export default App;
