import React from 'react'
import CellularAutomaton from '../models/CellularAutomaton'
import Canvas from './Canvas'

export default function CellularAutomata({frequency=10, paused=false, drawing=false}) {
  const area = React.useRef({x:0, y:0, w:0, h:0})
  const automaton = React.useRef(new CellularAutomaton())
  const elapsedTime = React.useRef(0)
  
  const cellSize = React.useMemo(() => 50, [])
  const loopTime = React.useMemo(() => 1/frequency, [frequency])

  React.useEffect(() => {
    console.log("mounted")
    automaton.current.addCell(-1, 0, "black")
    automaton.current.addCell(0, 0, "black")
    automaton.current.addCell(1, 0, "black")
  }, [])

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  const render = React.useCallback((context) => {
    const [l,t] = [area.current.x, area.current.y].map(value => Math.floor(value/cellSize))
    const [r,b] = [area.current.x+area.current.w, area.current.y+area.current.h].map(value => Math.ceil(value/cellSize))

    context.strokeStyle = "black"
    for (let x=l; x<=r; x++) {
      for (let y=t; y<=b; y++) {
        context.strokeRect(x*cellSize, y*cellSize, cellSize, cellSize)
      }
    }

    for (const cell of automaton.current.cells) {
      context.fillStyle = cell.c
      
      context.fillRect(
        (cell.x+0.1)*cellSize,
        (cell.y+0.1)*cellSize,
        cellSize*0.8,
        cellSize*0.8
      )
    }
  }, [cellSize])

  const update = React.useCallback((deltaTime) => {
    if (paused) {
      return
    }
    elapsedTime.current += deltaTime
    if (elapsedTime.current > loopTime) {
      elapsedTime.current -= loopTime
      automaton.current.evolute()
    }
  }, [loopTime, paused])

  const handleTransform = React.useCallback((newArea) => {
    area.current = newArea
  }, [])

  const handleDraw = React.useCallback((pos) => {
    automaton.current.addCell(
      Math.floor(pos.x/cellSize),
      Math.floor(pos.y/cellSize),
      "black"
    )
  }, [cellSize])

  window.automaton = automaton.current

  return (
    <Canvas drawing={drawing} update={update} render={render} onTransform={handleTransform} onDraw={handleDraw}/>
  )
}
