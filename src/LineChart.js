
import * as d3 from "d3";
import {useRef, useEffect} from "react";

const testData = [
    {date:new Date("2025-08-11"), weight: 83.5},
    {date:new Date("2025-08-15"), weight: 84.5},
    {date:new Date("2025-08-18"), weight: 87.1},
    {date:new Date("2025-08-19"), weight: 86.4},
    {date:new Date("2025-08-23"), weight: 85.7},
    {date:new Date("2025-08-25"), weight: 84.3},
];

export default function LineChart({
  data = testData,
  width = 640,
  height = 400,
  marginTop = 30,
  marginRight = 30,
  marginBottom = 30,
  marginLeft =  100
}) { 
    
    const gx = useRef();
    const gy = useRef();
     const x = d3.scaleUtc(d3.extent(data, (d)=>d.date), [marginLeft, width - marginRight]).clamp(true);
     const y = d3.scaleLinear(d3.extent(data, (d)=>d.weight), [height - marginBottom, marginTop]);
     const line = d3.line().x((d)=>x(d.date)).y((d)=>y(d.weight));
     const yAxis = d3.axisLeft(y).tickFormat((d)=>{
      const oz = d % 16;
      const lbs = Math.floor(d / 16);
      return lbs +"lbs " + oz + "oz";
    });
     useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
    useEffect(() => void d3.select(gy.current).call(yAxis), [gy, yAxis]);
  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="steelblue" strokeWidth="1.5" d={line(data)} />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (<circle key={i} cx={x(d.date)} cy={y(d.weight)} r="2.5" />))}
      </g>
    </svg>
  );
}