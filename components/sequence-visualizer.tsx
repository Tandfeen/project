"use client";

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';
import { Sequence, StagedRelay } from "@/lib/types";
import { Zap, Clock, Activity } from 'lucide-react';

interface SequenceVisualizerProps {
  sequence: Sequence;
  isRunning: boolean;
  currentStep: number;
}

export function SequenceVisualizer({ sequence, isRunning, currentStep }: SequenceVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const stagedRelays: StagedRelay[] = useMemo(() => sequence.steps.map((step, index) => ({
    id: `${step.nodeId}-${step.relayId}`,
    relayId: step.relayId,
    nodeId: step.nodeId,
    delay: step.delay,
    status: index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending'
  })), [sequence.steps, currentStep]);

  const totalDuration = useMemo(() => {
    return stagedRelays.reduce((acc, relay) => acc + relay.delay, 0);
  }, [stagedRelays]);

  const elapsedTime = useMemo(() => {
    return stagedRelays.slice(0, currentStep).reduce((acc, relay) => acc + relay.delay, 0);
  }, [stagedRelays, currentStep]);

  const progress = useMemo(() => {
    return isRunning ? (elapsedTime / totalDuration) * 100 : 0;
  }, [isRunning, elapsedTime, totalDuration]);

  useEffect(() => {
    if (!svgRef.current || stagedRelays.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = 250;
    const nodeRadius = 40;
    const padding = 60;

    svg.selectAll("*").remove();

    const xScale = d3.scaleLinear()
      .domain([0, stagedRelays.length - 1])
      .range([padding, width - padding]);

    const linkGroup = svg.append("g");
    const nodeGroup = svg.append("g");

    // Create links
    linkGroup
      .selectAll("line")
      .data(stagedRelays.slice(0, -1))
      .enter()
      .append("line")
      .attr("x1", (d, i) => xScale(i))
      .attr("y1", height / 2)
      .attr("x2", (d, i) => xScale(i + 1))
      .attr("y2", height / 2)
      .attr("stroke", "rgba(180, 0, 255, 0.3)")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "5,5");

    // Create nodes
    const nodes = nodeGroup
      .selectAll("g")
      .data(stagedRelays)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${xScale(i)},${height / 2})`);

    // Add circles
    nodes
      .append("circle")
      .attr("r", nodeRadius)
      .attr("fill", (d, i) => {
        if (i < currentStep) return "rgba(0, 255, 0, 0.2)";
        if (i === currentStep) return "rgba(255, 165, 0, 0.5)";
        return "rgba(180, 0, 255, 0.1)";
      })
      .attr("stroke", (d, i) => {
        if (i < currentStep) return '#00ff00';
        if (i === currentStep) return '#ffa500';
        return '#b400ff';
      })
      .attr("stroke-width", 3)
      .attr("class", (d, i) => 
        i === currentStep ? "animate-pulse" : ""
      );

    // Add relay numbers
    nodes
      .append("text")
      .text((d) => `N${d.nodeId}R${d.relayId}`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("fill", "#fff")
      .attr("font-size", "14px")
      .attr("font-weight", "bold");

    // Add delay labels
    nodes
      .append("text")
      .text((d) => `${d.delay}s`)
      .attr("text-anchor", "middle")
      .attr("dy", -50)
      .attr("fill", "rgba(255, 255, 255, 0.8)")
      .attr("font-size", "12px");

    // Add status icons
    nodes
      .append("use")
      .attr("xlink:href", (d, i) => {
        if (i < currentStep) return "#icon-check";
        if (i === currentStep) return "#icon-zap";
        return "#icon-circle";
      })
      .attr("x", -8)
      .attr("y", 30)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", (d, i) => {
        if (i < currentStep) return "#00ff00";
        if (i === currentStep) return "#ffa500";
        return "#b400ff";
      });

    // Define icons
    svg
      .append("defs")
      .html(`
        <symbol id="icon-check" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </symbol>
        <symbol id="icon-zap" viewBox="0 0 24 24">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </symbol>
        <symbol id="icon-circle" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
        </symbol>
      `);

  }, [stagedRelays, currentStep]);

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900 to-indigo-900">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Sequence Timeline: {sequence.name}</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg">
            <Activity className="w-4 h-4 mr-2" />
            {stagedRelays.length} Steps
          </Badge>
          <Badge variant="secondary" className="text-lg">
            <Clock className="w-4 h-4 mr-2" />
            Total: {totalDuration.toFixed(1)}s
          </Badge>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="250"
          className="overflow-visible"
          aria-label="Sequence visualization"
        />
      </motion.div>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">Overall Progress</span>
          <span className="text-sm font-medium text-white">{progress.toFixed(1)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <AnimatePresence>
        {isRunning && currentStep !== -1 && currentStep < stagedRelays.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg"
          >
            <h4 className="text-xl font-semibold text-white mb-2">Current Step</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">Node</p>
                <p className="text-lg font-bold text-white">{stagedRelays[currentStep].nodeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Relay</p>
                <p className="text-lg font-bold text-white">{stagedRelays[currentStep].relayId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Delay</p>
                <p className="text-lg font-bold text-white">{stagedRelays[currentStep].delay}s</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Status</p>
                <p className="text-lg font-bold text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Active
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
