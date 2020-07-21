import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

class Donut extends React.Component {
    constructor(props) {
        super(props);
 
    }
  render() {
    const { DataView } = DataSet;
    const { Html } = Guide;
    
    const dv = new DataView();
    dv.source(this.props.data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          console.log(val,'percent')
          val = val * 100 + "%";
          return val;
        }
      }
    };
    return (
      <div>
        <Chart
          height={250}
          data={dv}
          scale={cols}
          padding={[-30, 0, 0, 0]}
          forceFit
        >
          <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend
            position="bottom"
            offsetY={-50}
            offsetX={0}
          />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Guide>
            <Html
              position={["50%", "50%"]}
              html={"<div style=&quot;color:#8c8c8c;font-size:1rem;text-align: center;width: 10em;&quot;>"+this.props.title+"</div>"}
              alignX="middle"
              alignY="middle"
            />
          </Guide>
          <Geom
            type="intervalStack"
            position="percent"
            color={[
              'item',
              item => {
                //some code
                console.log(item);
                switch (item) {
                  case '男':
                    return '#FF7C3B';
                    case '安卓':
                    return '#FF7C3B';
                    case '移动':
                    return '#FF7C3B';
                  case '女':
                    return '#2674FD';
                    case '苹果':
                      return '#2674FD';
                      case '联通':
                    return '#2674FD';
                    case '其他':
                    return '#FCD829';
                    case '电信':
                    return '#FCD829';
                    case '未知':
                    return '#4BD82A';
                }
              },
            ]}
            size="20"

            tooltip={[
              "item*percent*count",
              (item, percent,count) => {
                console.log(item,'tootip')
                // percent = (percent * 100).toFixed(2) + "%";

                return {
                  name: item,
                  value: count
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            
          </Geom>
        </Chart>
      </div>
    );
  }
}
export default Donut
