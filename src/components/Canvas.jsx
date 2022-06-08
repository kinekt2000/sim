import React from 'react'
import Display from '../Core/Display'
import Engine from '../Core/Engine'


export default function Canvas({time_step=1000/60, drawing=false, update, render, onTransform=()=>{}, onDraw=()=>{}}) {
  const [engine, setEngine] = React.useState(null)
  const [display, setDisplay] = React.useState(null)

  const canvasRef = React.useRef()
  const pointerPosRef = React.useRef({x:0, y:0})
  const pointerDownRef = React.useRef(null)

  // setup engine
  React.useLayoutEffect(() => {
    if (display && update && render) {
      setEngine(new Engine(1000/60, update, () => {
        display.clear()
        render(display.buffer)
        display.render()
      }))
    }
  }, [setEngine, update, render, display])

  // setup display
  React.useLayoutEffect(() => {
    setDisplay(new Display(canvasRef.current))
  }, [setDisplay])

  // start engine
  React.useEffect(() => {
    if (display && engine) {
      engine.start()
      return () => {engine.stop()}
    }
  }, [engine, display])

  // add events to display
  React.useEffect(() => {
    if (display === null) {
      return
    }
    const resize = () => {
      display.resize(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight)
    }

    const pointerdown = ({offsetX, offsetY}) => {
      pointerDownRef.current = pointerPosRef.current = {x:offsetX, y:offsetY}
    }

    const pointermove = ({offsetX, offsetY}) => {
      if (pointerDownRef.current) {
        if (drawing) {
          onDraw({
            x: (offsetX - display.canvas.width/2 - display.offsetX) / display.scale,
            y: (offsetY - display.canvas.height/2 - display.offsetY) / display.scale
          })
        } else {
          display.translate(offsetX - pointerPosRef.current.x, offsetY - pointerPosRef.current.y)
        }
        pointerPosRef.current = {x:offsetX, y:offsetY}
      }
    }

    const pointerup   = ({offsetX, offsetY}) => {
      if (pointerDownRef.current === null) return
      
      const {x, y} = pointerDownRef.current
      if (Math.abs(offsetX - x) < 5 && Math.abs(offsetY - y) < 5) {
        onDraw({
          x: (offsetX - display.canvas.width/2 - display.offsetX) / display.scale,
          y: (offsetY - display.canvas.height/2 - display.offsetY) / display.scale
        })
      }
      pointerDownRef.current = null
    }

    const pointerout = () => {
      pointerDownRef.current = null
    }

    const wheel = ({deltaY}) => {
      display.zoom(deltaY*0.001)
    }

    
    window.addEventListener("resize", resize)
    display.canvas.addEventListener("pointerdown", pointerdown)
    display.canvas.addEventListener("pointermove", pointermove)
    display.canvas.addEventListener("pointerup", pointerup)
    display.canvas.addEventListener("pointerout", pointerout)
    display.canvas.addEventListener("wheel", wheel)
    
    display.addOnTransform((area) => {
      onTransform(area)
    })
    
    resize()
    return () => {
      window.removeEventListener("resize", resize)
      display.canvas.removeEventListener("pointerdown", pointerdown)
      display.canvas.removeEventListener("pointermove", pointermove)
      display.canvas.removeEventListener("pointerup", pointerup)
      display.canvas.removeEventListener("pointerout", pointerout)
      display.canvas.removeEventListener("wheel", wheel)
    }
  }, [display, onTransform, onDraw, drawing])

  window.display = display

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%"
      }}
    />
  )
}
