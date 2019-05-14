import React, { Component, CSSProperties } from "react";
import isEqual from "lodash/isEqual";
import echarts, {
  EChartOption,
  EChartsResponsiveOption,
  ECharts,
  EChartsLoadingOption
} from "echarts";
import { pipeline } from "stream";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";
export type OptionType = EChartOption | EChartsResponsiveOption;

export enum SeriesTypes {
  LINE = "line",
  BAR = "bar",
  pie = "pie",
  scatter = "scatter",
  EFFECT_SCATTER = "effectScatter",
  RADAR = "radar",
  TREE = "tree",
  TREEMAP = "treemap",
  SUNBURST = "sunburst",
  BOXPLOT = "boxplot",
  CANDLESTICK = "candlestick",
  HEATMAP = "heatmap",
  MAP = "map",
  PARALLEL = "parallel",
  LINES = "lines",
  GRAPH = "graph",
  SANKEY = "sankey",
  FUNNEL = "funnel",
  GAUGE = "gauge",
  PICTORIAL_BAR = "pictorialBar",
  THEME_RIVER = "themeRiver",
  custom = "custom"
}

export type DimensionElementType =
  | string
  | {
      name: string;
      type: "string" | "number" | "ordinal" | "float" | "int" | "time";
      displayName: string;
    };
export type DataSet = {
  id?: string;
  source:
    | Array<Array<any>>
    | Array<object>
    | { [dimension: string]: Array<any> };
  dimensions?: Array<DimensionElementType>;
  sourceHeader?: boolean;
};
type DimensionRef = number | string;
type DimensionRefs = DimensionRef | Array<DimensionRef>;
export type Encode = {
  tooltip?: DimensionRefs;
  seriesName?: DimensionRefs;
  itemId?: DimensionRefs;
  itemName?: DimensionRefs;
  x?: DimensionRefs;
  y?: DimensionRefs;
  single?: DimensionRefs;
  radius?: DimensionRefs;
  angle?: DimensionRefs;
  value?: DimensionRefs;
};

export interface MouseListener {
  eventName: MouseEventName;
  handler: (params: MouseEventParam) => void;
}

export interface ActionListener {
  eventName: ActionTypeName;
  handler: (params: object) => void;
}

export interface MouseEventParam {
  // 当前点击的图形元素所属的组件名称，
  // 其值如 'series'、'markLine'、'markPoint'、'timeLine' 等。
  componentType: string;
  // 系列类型。值可能为：'line'、'bar'、'pie' 等。当 componentType 为 'series' 时有意义。
  seriesType: string;
  // 系列在传入的 option.series 中的 index。当 componentType 为 'series' 时有意义。
  seriesIndex: number;
  // 系列名称。当 componentType 为 'series' 时有意义。
  seriesName: string;
  // 数据名，类目名
  name: string;
  // 数据在传入的 data 数组中的 index
  dataIndex: number;
  // 传入的原始数据项
  data: Object;
  // sankey、graph 等图表同时含有 nodeData 和 edgeData 两种 data，
  // dataType 的值会是 'node' 或者 'edge'，表示当前点击在 node 还是 edge 上。
  // 其他大部分图表中只有一种 data，dataType 无意义。
  dataType: string;
  // 传入的数据值
  value: number | Array<number>;
  // 数据图形的颜色。当 componentType 为 'series' 时有意义。
  color: string;
  // 用户自定义的数据。只在 graphic component 和自定义系列（custom series）
  // 中生效，如果节点定义上设置了如：{type: 'circle', info: {some: 123}}。
  info: any;

  [extra: string]: any;
}
export type MouseEventName =
  | "click"
  | "dblclick"
  | "mousedown"
  | "mousemove"
  | "mouseup"
  | "mouseover"
  | "mouseout"
  | "globalout"
  | "contextmenu";

export type ActionTypeName =
  | "legendselectchanged"
  | "legendselected"
  | "legendunselected"
  | "legendscroll"
  | "datazoom"
  | "datarangeselected"
  | "timelinechanged"
  | "timelineplaychanged"
  | "restore"
  | "magictypechanged"
  | "geoselectchanged"
  | "geoselected"
  | "geounselected"
  | "pieselectchanged"
  | "pieselected"
  | "pieunselected"
  | "mapselectchanged"
  | "mapselected"
  | "mapunselected"
  | "axisareaselected"
  | "focusnodeadjacency"
  | "unfocusnodeadjacency"
  | "brush"
  | "rushselected"
  | "globalCursorTaken"
  | "rendered "
  | "finished";

export interface SimpleChartProps {
  theme?: object | string;
  option?: OptionType;
  // loading?: {
  //   loading: boolean;
  //   type?: string;
  //   option?: {
  //     text?: string;
  //     color?: string;
  //     textColor?: string;
  //     maskColor?: string;
  //     zlevel?: number;
  //   };
  // };
  showloading?: boolean;
  loading?: {
    type?: string;
    loadingOption?: EChartsLoadingOption;
  };
  mouseListeners?: MouseListener[];
  actionListeners?: ActionListener[];
  initOption?: {
    devicePixelRatio?: number;
    renderer?: "canvas" | "svg";
    width?: number | string;
    height?: number | string;
  };
  style?: CSSProperties;
}
/**
 * 一个简单的 echart 封装，不支持动态数据
 */
export class SimpleChart extends Component<SimpleChartProps> {
  private divRef: React.RefObject<any>;

  private chart: ECharts | undefined;
  private containerDom: HTMLDivElement | undefined;

  constructor(props: SimpleChartProps) {
    super(props);
    this.divRef = React.createRef();
  }

  private getChart(): ECharts {
    return this.chart as ECharts;
  }

  public dispatchAction(action: object) {
    const chart = this.getChart();
    chart.dispatchAction(action);
  }

  private getContainer(): HTMLDivElement {
    return this.containerDom as HTMLDivElement;
  }

  componentDidMount() {
    const containerDom = this.divRef.current;
    this.chart = echarts.init(
      containerDom,
      this.props.theme,
      this.props.initOption
    );
    this.containerDom = containerDom;
    if (this.props.option) {
      this.chart.setOption(this.props.option);
    } else if (this.props.showloading) {
      if (this.props.loading) {
        this.chart.showLoading(
          this.props.loading.type,
          this.props.loading.loadingOption
        );
      } else {
        this.chart.showLoading();
      }
    }
  }

  private initChart(): ECharts {
    return echarts.init(
      this.getContainer(),
      this.props.theme,
      this.props.initOption
    );
  }

  componentDidUpdate(preProps: Readonly<SimpleChartProps>) {
    let chart = this.getChart();
    if (
      this.props.theme !== preProps.theme ||
      !isEqual(this.props.initOption, preProps.initOption) ||
      !isEqual(this.props.option, preProps.option) ||
      !isEqual(this.props.mouseListeners, preProps.mouseListeners) ||
      !isEqual(this.props.actionListeners, preProps.actionListeners)
    ) {
      chart.dispose();
      this.chart = chart = this.initChart();
      if (this.props.mouseListeners) {
        this.props.mouseListeners.forEach(lis => {
          chart.on(lis.eventName, lis.handler);
        });
      }
      if (this.props.actionListeners) {
        this.props.actionListeners.forEach(lis => {
          chart.on(lis.eventName, lis.handler);
        });
      }
    }
    if (this.props.option) {
      chart.setOption(this.props.option);
      chart.hideLoading();
    }
    if (!isEqual(this.props.style, preProps.style)) {
      chart.resize();
    }
  }

  render() {
    const style = this.props.style;
    const div = <div ref={this.divRef} style={this.props.style} />;
    return div;
  }
}

interface EchartProps {
  style?: CSSProperties;
  theme?: object | string;
  initOption?: {
    devicePixelRatio?: number;
    renderer?: "canvas" | "svg";
    width?: number | string;
    height?: number | string;
  };
}

/**
 * echart 的封装，如果要控制 echart 的一些行为，必须使用 ref，
 * 然后通过 getChart 方法来获取 echart 实例。
 *
 *主要是应付一些动态数据的展示，如传感器数据展示
 */
export class Echart extends Component<EchartProps> {
  private containerRef: React.RefObject<any>;

  private echart: ECharts | undefined;

  constructor(props: any) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidUpdate(preProps: Readonly<EchartProps>) {
    if (
      isEqual(this.props.theme, preProps.theme) ||
      isEqual(this.props.initOption, preProps.initOption)
    ) {
      const chart = this.getChart();
      chart.dispose();
      this.echart = echarts.init(
        this.containerRef.current,
        this.props.theme,
        this.props.initOption
      );
    }
  }

  componentDidMount() {
    this.echart = echarts.init(
      this.containerRef.current,
      this.props.theme,
      this.props.initOption
    );
  }

  public getChart(): ECharts {
    return this.echart as ECharts;
  }

  render() {
    return <div ref={this.containerRef} style={this.props.style} />;
  }
}
