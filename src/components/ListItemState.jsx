import React from 'react'

import { HexColorPicker } from 'react-colorful'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import MenuIcon from '@mui/icons-material/Menu'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'

function extractRanges(convObj) {
  const ranges = []
  let rangeSize = 1
  let i
  for (i = 1; i < 9; i++) {
    if (convObj[i] !== convObj[i - 1]) {
      if (convObj[i - 1] !== "empty") {
        ranges.push([i - rangeSize, i - 1, convObj[i - 1]])
      }
      rangeSize = 1
    } else {
      rangeSize++
    }
  }

  if (convObj[i - 1] !== "empty") {
    ranges.push([i - rangeSize, i - 1, convObj[i - 1]])
  }
  return ranges
}

function rangesToConvObj(ranges) {
  const conv = [...Array(9).keys()].reduce((acc, val) => ({ ...acc, [val]: "empty" }), {})

  for (const range of ranges) {
    for (let i = range[0]; i <= range[1]; i++) {
      conv[i] = range[2]
    }
  }

  return conv
}

export default function ListItemState({ value, selected = false, deletable = true, availableStates = null, onDelete = () => { }, onSelect = () => { }, onChange = () => { } }) {
  if (availableStates === null) availableStates = []
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [anchorColorEl, setAnchorColorEl] = React.useState(null)

  const [anchorRangeEl, setAnchorRangeEl] = React.useState(null)
  const [ranges, setRanges] = React.useState(extractRanges(value.conv))

  const [editName, setEditName] = React.useState(false)
  const [contextMenu, setContextMenu] = React.useState(null)

  const listItemRef = React.useRef()
  const nameEditorRef = React.useRef()
  const colorpickerRef = React.useRef()
  const currentColor = React.useRef(null)

  React.useEffect(() => {
    setRanges(extractRanges(value.conv))
  }, [value])

  const addRange = () => {
    setRanges([...ranges, [0, 0, "empty"]])
  }

  const deleteRange = (index) => {
    setRanges(ranges.filter((_, i) => i !== index))
  }

  const handleOpenPopup = () => {
    setAnchorEl(listItemRef.current)
  }

  const handleDelete = (event) => {
    event.stopPropagation()
    onDelete()
  }

  const handleClose = () => {
    setAnchorEl(null)
    onChange({ ...value, conv: rangesToConvObj(ranges) })
  }

  const handleRangeChange = (border, index) => (event) => {
    if (border === "left") border = 0
    if (border === "right") border = 1

    if (!event.target.value) return

    let value = parseInt(event.target.value)
    value = value > 8 ? 8 : value

    if (border === 0 && value > ranges[index][1]) value = ranges[index][1]
    if (border === 1 && value < ranges[index][0]) value = ranges[index][0]

    ranges[index][border] = value
    setRanges([...ranges])
  }

  const chooseRangeState = (index, state) => {
    setRanges(ranges.map((range, i) => i === parseInt(index) ? [range[0], range[1], state] : [...range]))
    setAnchorRangeEl(null)
  }

  const handleContextMenu = (event) => {
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
          x: event.clientX,
          y: event.clientY
        }
        : null
    )
  }

  const handleChangeName = () => {
    setEditName(true)
  }

  React.useEffect(() => {
    if (nameEditorRef.current) {
      const inputField = nameEditorRef.current
      inputField.value = value.name
      inputField.focus()

      const keydown = (event) => {
        switch (event.key) {
          case "Enter":
            event.preventDefault()
            event.stopPropagation()

            if (!inputField.value) {
              inputField.blur()
            } else {
              setEditName(false)
              onChange({ ...value, name: inputField.value })
            }
            break
          case "Escape":
            event.stopPropagation()
            inputField.blur()
            break
          default:
            if (/[^a-zA-Z0-9 ]/.test(event.key)) {
              event.preventDefault()
            }
            if (event.key === event.target.value.substr(-1)) {
              event.preventDefault()
            }
        }
      }

      const input = (event) => {
        event.target.value = event.target.value.trimStart()
      }

      const blur = () => {
        setEditName(false)
      }

      inputField.addEventListener("keydown", keydown)
      inputField.addEventListener("input", input)
      inputField.addEventListener("blur", blur)

      return () => {
        inputField.removeEventListener("keydown", keydown)
        inputField.removeEventListener("input", input)
        inputField.removeEventListener("blur", blur)
      }
    }
  }, [editName, value, onChange])

  const handleContextMenuClick = (func = () => { }) => (event) => {
    setContextMenu(null)
    func(event)
  }

  React.useEffect(() => {
    const handleColorChange = () => {
      if (currentColor.current){
        onChange({ ...value, color: currentColor.current })
        currentColor.current = null
      }
    }
    window.addEventListener("pointerup", handleColorChange)
    return () => {window.removeEventListener("pointerup", handleColorChange)}
  }, [onChange, value])

  return (
    <>
      <ListItem ref={listItemRef} onContextMenu={handleContextMenu} disablePadding>
        <ListItemButton onClick={() => onSelect()} selected={selected}>
          <Button sx={{ p: 0, minWidth: 32, width: 32, height: 32 }} ref={colorpickerRef} onClick={() => { setAnchorColorEl(colorpickerRef.current) }}>
            <Paper elevation={1} sx={{ backgroundColor: value.color, width: 24, height: 24, margin: 0 }} />
          </Button>
          <ListItemText disableTypography primary={
            editName ? (
              <TextField inputRef={nameEditorRef} inputProps={{ sx: { p: 0.5 } }} />
            ) : (
              <Typography sx={{ p: 0.5 }}>
                {value.name}
              </Typography>
            )
          } />
          <ListItemIcon>
            <IconButton onClick={handleOpenPopup}><MenuIcon /></IconButton>
          </ListItemIcon>
          <ListItemIcon>
            {deletable ? (
              <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
            ) : null}
          </ListItemIcon>
        </ListItemButton>
        <Menu
          open={contextMenu !== null}
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={contextMenu !== null ? { top: contextMenu.y, left: contextMenu.x } : undefined}
        >
          <MenuItem onClick={handleContextMenuClick()}>Change Color</MenuItem>
          <MenuItem onClick={handleContextMenuClick(handleChangeName)}>Change Name</MenuItem>
          <MenuItem onClick={handleContextMenuClick(handleOpenPopup)}>Evolution Rules</MenuItem>
          {deletable ? (
            <MenuItem onClick={handleContextMenuClick(handleDelete)}>Remove</MenuItem>
          ) : null}
        </Menu>
      </ListItem>

      <Popover
        PaperProps={{ sx: { overflow: "visible", borderRadius: 4 } }}
        open={Boolean(anchorColorEl)}
        anchorEl={anchorColorEl}
        onClose={() => { setAnchorColorEl(null) }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <Box sx={{
          overflow: "visible",
          "& .react-colorful__saturation": { borderRadius: "0 4 0 4" },
          "& .react-colorful__hue": { borderRadius: "4 0 4 0" }
        }}>
          <HexColorPicker
            color={value.color.toLowerCase()}
            onChange={color => { currentColor.current = color }}
          />
        </Box>
      </Popover>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <Paper>
          <List disablePadding>
            <ListItem disablePadding disableGutters>
              <ListItemButton onClick={addRange}>
                <ListItemIcon><AddRoundedIcon /></ListItemIcon>
                <ListItemText primary="Add Evolution Rule" />
              </ListItemButton>
            </ListItem>
            <Divider />
            {ranges.map((range, index) => (
              <ListItem sx={{ paddingX: 2 }} key={index} disablePadding disableGutters>
                <TextField value={range[0]} onChange={handleRangeChange("left", index)} sx={{ p: 0.5 }} type="number" InputProps={{ inputProps: { min: 0, max: 8, sx: { p: 0.5, width: 40 } } }} />
                <TextField value={range[1]} onChange={handleRangeChange("right", index)} sx={{ p: 0.5 }} type="number" InputProps={{ inputProps: { min: 0, max: 8, sx: { p: 0.5, width: 40 } } }} />
                <ListItemIcon sx={{ justifyContent: "center" }}>
                  <ArrowRightAltRoundedIcon />
                </ListItemIcon>
                <Button sx={{ p: 0, minWidth: 32, width: 32, height: 32 }} onClick={(event) => { setAnchorRangeEl(event.target) }}>
                  <Paper data-index={index} elevation={1} sx={{ backgroundColor: availableStates[range[2]].color, width: 24, height: 24, "&:hover": { opacity: "75%" } }} />
                </Button>
                <IconButton onClick={() => { deleteRange(index) }}><DeleteIcon /></IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popover>

      <Popover
        open={Boolean(anchorRangeEl)}
        anchorEl={anchorRangeEl}
        onClose={() => { setAnchorRangeEl(null) }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <Paper>
          <List disablePadding>
            {Object.keys(availableStates).map(id => (
              <ListItem key={id} disablePadding>
                <ListItemButton onClick={() => chooseRangeState(anchorRangeEl.dataset.index, id)}>
                  <Paper elevation={1} sx={{ backgroundColor: availableStates[id].color, width: 24, height: 24, marginRight: 1 }} />
                  <ListItemText primary={availableStates[id].name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popover>
    </>
  )
}
