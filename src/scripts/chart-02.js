
import * as d3 from 'd3'

const margin = { top: 30, left: 50, right: 30, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 680 - margin.left - margin.right

const svg = d3
  .select('#chart-02')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .range([0, width])
  .domain([2000, 2009])
const yPositionScale = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, 15])
const colorScale = d3
  .scaleOrdinal()
  .range(['lightblue', 'green', 'grey', 'purple', 'orange', 'black'])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.TIME)
  })
  .y(function(d) {
    return yPositionScale(d.Value)
  })

d3.csv(require('../data/alcohol-consumption.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('cx', function(d) {
      return xPositionScale(d.TIME)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.Value)
    })
    .attr('fill', function(d) {
      return colorScale(d.LOCATION)
    })

  const nested = d3
    .nest()
    .key(function(d) {
      return d.LOCATION
    })
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .lower()

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()
}
