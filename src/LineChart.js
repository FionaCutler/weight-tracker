
import * as d3 from "d3";
import {useRef, useEffect} from "react";
import DataPoint from "./DataPoint";
const testData = [
    {date:new Date("2025-08-11"), weight: 83.5},
    {date:new Date("2025-08-15"), weight: 84.5},
    {date:new Date("2025-08-18"), weight: 87.1},
    {date:new Date("2025-08-19"), weight: 86.4},
    {date:new Date("2025-08-23"), weight: 85.7},
    {date:new Date("2025-08-25"), weight: 84.3},
];

function tooltip(d){
   d3.select("#tooltip").text(""+ d.date + ": " + d.lbs + "lbs " + d.oz + "oz" )
}

export default function LineChart({
  data = testData,
  width = 640,
  height = 400,
  marginTop = 30,
  marginRight = 30,
  marginBottom = 30,
  marginLeft =  100
}) { 
    const mean = d3.mean(data, (d)=> d.weight);
    data.forEach((d)=>{
      d.percent  = ((d.weight-mean)/mean)*100;      
      d.oz = d.weight % 16;
      d.lbs = Math.floor(d.weight / 16);
    });
    const gx = useRef();
    const gy = useRef();
    const x = d3.scaleUtc(d3.extent(data, (d)=>d.date), [marginLeft, width - marginRight]).clamp(true);
    const y = d3.scaleLinear(d3.extent(data, (d)=>d.weight), [height - marginBottom, marginTop]);
    const line = d3.line().x((d)=>x(d.date)).y((d)=>y(d.weight));
    const avgLine = d3.line().x((d)=>x(d.date)).y((d)=>y(mean));
    const yAxis = d3.axisLeft(y).tickFormat((d)=>{
      const oz = d % 16;
      const lbs = Math.floor(d / 16);
      return lbs +"lbs " + oz + "oz";
    });
     useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
    useEffect(() => void d3.select(gy.current).call(yAxis), [gy, yAxis]);
  return (
    <div>
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="black" strokeWidth="1.5" d={avgLine(data)} />
      <path fill="none" stroke="steelblue" strokeWidth="2" d={line(data)} />
      <g  fill="steelblue" stroke="none" strokeWidth="2">
        {data.map((d, i) => (<DataPoint key={i} cx={x(d.date)} cy={y(d.weight)} r="5" data={d} click={tooltip}/>))}
      </g>
    </svg>
    <div><p id="tooltip"></p></div></div>
  );
}

