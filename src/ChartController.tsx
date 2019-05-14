import React, { Component } from "react";
import {
  SimpleChart,
  OptionType,
  Echart,
  DataSet,
  Encode,
  SeriesTypes
} from "./echart";
import { EChartOption } from "echarts";

export class ChartController extends Component<{}, { option: OptionType }> {
  constructor(props: any) {
    super(props);

    const dataSet: DataSet = {
      // dimensions: ["班级", "语文", "数学", "英语", "颜色"],
      source: [
        ["班级", "语文", "数学", "英语", "颜色"],
        ["1班", 90, 80, 75, "红"],
        ["2班", 30, 20, 80, "黄"],
        ["3班", 50, 70, 99, "蓝"]
      ]
    };
    const series0: EChartOption.SeriesBar[] = [
      {
        type: SeriesTypes.BAR
      },
      {
        type: SeriesTypes.BAR
      },
      {
        type: SeriesTypes.BAR
      }
    ];

    const series1: EChartOption.SeriesBar[] = [
      {
        type: SeriesTypes.BAR,
        seriesLayoutBy: "row"
      },
      {
        type: SeriesTypes.BAR,
        seriesLayoutBy: "row"
      },
      {
        type: SeriesTypes.BAR,
        seriesLayoutBy: "row"
      }
    ];
    const series2: EChartOption.SeriesBar[] = [
      {
        type: "bar",
        encode: {
          x: "颜色",
          y: "语文",
          tooltip: ["班级", "语文"],
          seriesName: "语文"
        }
      },
      {
        type: "bar",
        encode: {
          x: "颜色",
          y: "数学",
          tooltip: ["班级", "数学"],
          seriesName: "数学"
        }
      }
    ];
    const option: EChartOption<EChartOption.SeriesBar> = {
      legend: {},
      tooltip: {},
      dataset: dataSet,
      // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
      xAxis: { type: "category" },
      // 声明一个 Y 轴，数值轴。
      yAxis: {},
      // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
      series: series1,
      title: {
        text: "标题"
      }
    };
    this.state = {
      option
    };
  }

  render() {
    return (
      <SimpleChart style={{ height: "30em" }} option={this.state.option} />
    );
  }
}
