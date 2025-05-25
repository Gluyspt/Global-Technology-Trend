
// Numerical Data: Internet user growth
const lineData = [
  { year: 2000, users: 416.2 },
  { year: 2005, users: 1030 },
  { year: 2010, users: 2020 },
  { year: 2015, users: 3001 },
  { year: 2020, users: 4700 },
  { year: 2021, users: 5020 },
];

const lineMargin = { top: 20, right: 30, bottom: 30, left: 50 };
const lineWidth = 600 - lineMargin.left - lineMargin.right;
const lineHeight = 300 - lineMargin.top - lineMargin.bottom;

const svgLine = d3.select("#numerical")
  .append("svg")
  .attr("width", lineWidth + lineMargin.left + lineMargin.right)
  .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
  .append("g")
  .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

const xLine = d3.scaleLinear()
  .domain(d3.extent(lineData, d => d.year))
  .range([0, lineWidth]);

const yLine = d3.scaleLinear()
  .domain([0, d3.max(lineData, d => d.users)])
  .range([lineHeight, 0]);

svgLine.append("g").call(d3.axisLeft(yLine));
svgLine.append("g")
  .attr("transform", `translate(0,${lineHeight})`)
  .call(d3.axisBottom(xLine).tickFormat(d3.format("d")));

const line = d3.line()
  .x(d => xLine(d.year))
  .y(d => yLine(d.users));

svgLine.append("path")
  .datum(lineData)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", line);


// Spatial Data: Internet user
const widthMap = 900, heightMap = 400;

const svgMap = d3.select("#spatial")
  .append("svg")
  .attr("width", widthMap)
  .attr("height", heightMap)
  .style("background", "#f9f9f9");

const projection = d3.geoMercator()
  .scale(100)
  .translate([widthMap / 2.5, heightMap / 1.5]);

const path = d3.geoPath().projection(projection);

const mapColor = d3.scaleSequential(d3.interpolateBlues)
  .domain([0, 100]);

Promise.all([
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
]).then(([world]) => {
  const penetration = {
    USA: 80, CHN: 100, IND: 90, BRA: 75, NGA: 40, DEU: 20, THA: 15
  };
  const penetrationText = {
    CHN: "1110M users",
    IND: "808M users",
    USA: "322M users",
    BRA: "183M users",
    NGA: "107M users",
    DEU: "78.9M users",   
    THA: "65.4M users"
};


  svgMap.selectAll("path")
    .data(world.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const code = d.id;
      return penetration[code] !== undefined ? mapColor(penetration[code]) : "#ccc";
    })
    .attr("stroke", "white");

  const countryInfo = Object.entries(penetrationText);

  const infoBoxX = widthMap - 250;
  const infoBoxY = heightMap - (countryInfo.length * 20) - 20;

  svgMap.selectAll("text.country-info")
    .data(countryInfo)
    .join("text")
    .attr("class", "country-info")
    .attr("x", infoBoxX)
    .attr("y", (_, i) => infoBoxY + i * 20)
    .text(d => `${d[0]}: ${d[1]}`)
    .attr("font-size", "14px")
    .attr("fill", "#333");
});




// Textual Data: Programming Languages
const langData = [
  { language: "JavaScript", users: 12.4 },
  { language: "Python", users: 9.0 },
  { language: "Java", users: 8.2 },
  { language: "C/C++", users: 6.3 },
  { language: "PHP", users: 6.1 },
  { language: "C#", users: 6.0 },
  { language: "Visual Dev Tools", users: 2.8 },
  { language: "Swift", users: 2.4 },
  { language: "Kotlin", users: 2.3 },
  { language: "Go", users: 1.5 },
  { language: "Ruby", users: 1.5 },
  { language: "Objective C", users: 1.4 },
];

// Bar chart for textual data
const barWidth = 600;
const barHeight = 400;
const marginBar = { top: 20, right: 20, bottom: 60, left: 120 };

const svgBar = d3.select("#textual")
  .append("svg")
  .attr("width", barWidth + marginBar.left + marginBar.right)
  .attr("height", barHeight + marginBar.top + marginBar.bottom)
  .append("g")
  .attr("transform", `translate(${marginBar.left},${marginBar.top})`);

const yScale = d3.scaleBand()
  .domain(langData.map(d => d.language))
  .range([0, barHeight])
  .padding(0.1);

const xScale = d3.scaleLinear()
  .domain([0, d3.max(langData, d => d.users)])
  .range([0, barWidth]);

svgBar.append("g")
  .call(d3.axisLeft(yScale));

svgBar.append("g")
  .attr("transform", `translate(0, ${barHeight})`)
  .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => `${d}M`));

svgBar.selectAll("rect")
  .data(langData)
  .enter()
  .append("rect")
  .attr("y", d => yScale(d.language))
  .attr("width", d => xScale(d.users))
  .attr("height", yScale.bandwidth())
  .attr("fill", "#1976d2");

svgBar.selectAll("text.label")
  .data(langData)
  .enter()
  .append("text")
  .attr("class", "label")
  .attr("x", d => xScale(d.users) + 5)
  .attr("y", d => yScale(d.language) + yScale.bandwidth() / 2 + 4)
  .text(d => `${d.users}M`);
