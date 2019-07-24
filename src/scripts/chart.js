import {scaleLinear, scaleTime, scaleOrdinal } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { format } from 'd3-format'
import { max } from 'd3-array'
import { timeFormat } from 'd3-time-format'
import { line, curveCardinal } from 'd3-shape'
import {legendColor } from 'd3-svg-legend'
import 'd3-transition'

export default function(data, svg) {
    const margin = {
        top: 70,
        bottom: 50,
        left: 50,
        right: 10
    }

    const colors = {
        teal: '#009FB7',
        purple: '#8332AC',
        red: '#F61067'
    }

    const height = svg.attr('height') - margin.top - margin.bottom
    const width = svg.attr('width') - margin.left - margin.right

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    const numericalValues = data.reduce((a, b) => {
        return a.concat([b.value.sends, b.value.views, b.value.clickBacks])
    }, [])

    const maxValue = max(numericalValues)

    const vertScale = scaleLinear()
        .domain([0, maxValue])
        .range([height, 0])
        .nice()
    
    const horScale = scaleTime()
        .domain([new Date(2019, 0, 1), new Date(2019, 11, 31)])
        .range([0, width])
        .nice()
    
    const horAxis = axisBottom(horScale)
        .tickFormat(timeFormat('%b'))

    const horAxisG = svg.append('g')
        .call(horAxis)
        .attr('transform', `translate(${margin.left}, ${height + margin.top})`)

    const vertAxis = axisLeft(vertScale)
        
    const vertAxisG = svg.append('g')
        .call(vertAxis)
        .attr('transform', `translate(${margin.left - 3}, ${margin.top})`)

    const lineGenerator = line()
        .x(d => horScale(d.week))

    lineGenerator.y(d => vertScale(d.value.sends))

    g.append('path')
        .datum(data)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', colors.teal)
        .attr('stroke-width', 2)

    lineGenerator.y(d => vertScale(d.value.views))

    g.append('path')
        .datum(data)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', colors.purple)
        .attr('stroke-width', 2)

    lineGenerator.y(d => vertScale(d.value.clickBacks))

    g.append('path')
        .datum(data)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', colors.red)
        .attr('stroke-width', 2)
    
    const colorScale = scaleOrdinal()
        .domain(['Total Sends', 'Opens', 'Click Backs'])
        .range([colors.teal, colors.purple, colors.red])

    const colorLegend = legendColor()
        .scale(colorScale)
        .shapeHeight(10)
        .shapeWidth(10)
        .shapePadding(0)
    
    svg.append('g').call(colorLegend)
        .attr('font-size', 9)
        .attr('transform', `translate(10, 10)`)

}