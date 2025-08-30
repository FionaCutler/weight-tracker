const data = [
    {date:new Date("2023-12-11"), weight: 7.0},
    {date:new Date("2024-01-16"), weight: 7.8},
    {date:new Date("2024-02-13"), weight: 7.6},
    {date:new Date("2024-04-09"), weight: 6.13},
    {date:new Date("2024-04-16"), weight: 7.7},
    {date:new Date("2024-05-21"), weight: 7.2},
    {date:new Date("2024-07-23"), weight: 7.2},
    {date:new Date("2024-08-27"), weight: 7.2},
    {date:new Date("2025-01-08"), weight: 6.2},
    {date:new Date("2025-03-26"), weight: 6.2},
    {date:new Date("2025-04-09"), weight: 5.1},
    {date:new Date("2025-04-17"), weight: 5.2},
    {date:new Date("2025-05-22"), weight: 5.2},
    {date:new Date("2025-05-30"), weight: 5.5},
    {date:new Date("2025-06-17"), weight: 5.7},
    {date:new Date("2025-08-05"), weight: 4.4},
    {date:new Date("2025-08-11"), weight: 5.2},
    {date:new Date("2025-08-15"), weight: 5.3},
    {date:new Date("2025-08-18"), weight: 5.4},
    {date:new Date("2025-08-19"), weight: 5.4},
    {date:new Date("2025-08-23"), weight: 5.36},
    {date:new Date("2025-08-25"), weight: 5.27},
    {date:new Date("2025-08-26"), weight: 5.3}
];

function tooltip(d){
   d3.select("#tooltip").text( d.date.toDateString() + ": " + d.weight + "lbs");
}
const width = 800;
const height = 450;
const marginTop = 30;
const marginRight = 30;
const marginBottom = 30;
const marginLeft =  100;
const mean = d3.mean(data, (d)=> d.weight);
data.forEach((d)=>{
  d.percent  = ((d.weight-mean)/mean)*100;     
});
const x = d3.scaleUtc(d3.extent(data, (d)=>d.date), [marginLeft, width - marginRight]).clamp(true);
const y = d3.scaleLinear([0,d3.max(data,(d)=>d.weight)], [height - marginBottom, marginTop]);
const line = (data, x) => d3.line().x((d)=>x(d.date)).y((d)=>y(d.weight))(data);
const avgLine = d3.line().x((d)=>x(d.date)).y((d)=>y(mean));
const xAxis = (g, x) => g
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
const yAxis = d3.axisLeft(y);
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height);
  
const gx = svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis, x);

svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

const path = svg.append("path")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke", "steelblue")
    .attr("d", line(data,x));

  const zoom = d3.zoom()
      .scaleExtent([1, 32])
      .extent([[marginLeft, 0], [width - marginRight, height]])
      .translateExtent([[marginLeft, -Infinity], [width - marginRight, Infinity]])
      .on("zoom", zoomed);


function zoomed(event) {
    const xz = event.transform.rescaleX(x);
    path.attr("d", line(data, xz));
    gx.call(xAxis, xz);
}

  // Initial zoom.
  svg.call(zoom)
    .transition()
      .duration(750)
      .call(zoom.scaleTo, 4, [x(Date.UTC(2001, 8, 1)), 0]);

container.append(svg.node());
