import React, { useEffect, useRef, useState } from 'react';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import * as d3 from 'd3';

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function SankeyGraph({ data }) {
  const containerRef = useRef();
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(throttle((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height: width * 9 / 16 });
      }
    }, 200));

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;
    if (data.some(row => !row.from || !row.to || !row.value) || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 清除之前的圖形

    const { width, height } = dimensions;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    // 處理數據
    const nodeSet = new Set();
    data.forEach(d => {
      nodeSet.add(d.from);
      nodeSet.add(d.to);
    });
    const nodes = Array.from(nodeSet).map(name => ({ name }));

    const links = data.map(d => ({
      source: nodes.findIndex(node => node.name === d.from),
      target: nodes.findIndex(node => node.name === d.to),
      value: +d.value,
      color: d.color
    }));

    // 創建桑基圖佈局
    const sankeyLayout = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyLayout({
      nodes: nodes,
      links: links
    });

    // 計算節點顏色
    sankeyNodes.forEach(node => {
      const nodeLinks = sankeyLinks.filter(l => l.source.index === node.index || l.target.index === node.index);
      const colors = nodeLinks.map(l => l.color || '#000000');
      console.log(colors)
      node.color = d3.interpolateRgbBasisClosed(colors)(0.5);
    });

    // 繪製連接線
    svg.append("g")
      .selectAll("path")
      .data(sankeyLinks)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("fill", "none")
      .attr("stroke", d => d.color || "#000")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", d => Math.max(1, d.width));

    // 繪製節點
    svg.append("g")
      .selectAll("rect")
      .data(sankeyNodes)
      .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => d.color);

    // 添加節點標籤
    const label = svg.append("g")
      .selectAll("text")
      .data(sankeyNodes)
      .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "-0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name);

    // 添加值標籤
    label.append("tspan")
      .attr("fill-opacity", 0.7)
      .attr("font-size", "0.8em")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("dy", "1.5em")
      .text(d => `${d.value}`);

  }, [data, dimensions]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
    </div>
  );
}

export default SankeyGraph;
