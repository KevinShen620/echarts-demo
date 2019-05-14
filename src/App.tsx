import React from "react";
import "./App.css";
import { SimpleChart } from "./echart";
import { ChartController } from "./ChartController";

const App: React.FC = () => {
  return (
    <div className="App">
      <ChartController />
    </div>
  );
};

export default App;
