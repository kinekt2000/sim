import React from 'react'

import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import AddRoundedIcon from '@mui/icons-material/AddRounded'

import ListItemState from './ListItemState'


export default function StateList() {
  const [states, setStates] = React.useState({})
  const [emptyState, setEmptyState] = React.useState({
    name: `Dead Cell`,
    color: `#FFFFFF`,
    conv: [...Array(9).keys()].reduce((acc, val) => ({...acc, [val]:"empty"}), {})
  })
  const [selected, setSelected] = React.useState("empty")
  const [nextStateNumber, setNextStateNumber] = React.useState(1)

  const createState = React.useCallback(() => {
    const id = Date.now()
    const state = {
      name: `State ${nextStateNumber}`,
      color: `#${Math.floor(Math.random() * 14540253).toString(16)}`,
      conv: [...Array(9).keys()].reduce((acc, val) => ({...acc, [val]:"empty"}), {})
    }
    setNextStateNumber(state => state + 1)
    setStates(states => ({ ...states, [id]: state }))
  }, [nextStateNumber])

  const deleteState = (id) => {
    const { [id]: _, ...rest } = states
    setStates(rest)
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={createState}>
          <ListItemIcon>
            <AddRoundedIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: "h6" }} primary="Add New State" />
        </ListItemButton>
      </ListItem>
      <Divider />

      <ListItemState
        deletable={false}
        value={emptyState}
        availableStates={{...states, empty: emptyState}}
        selected={selected === "empty"}
        onSelect={() => {setSelected("empty")}}
        onChange={(state) => setEmptyState(state)}
      />

      {Object.keys(states).map(id => (
        <ListItemState
          key={id}
          value={states[id]}
          availableStates={{...states, empty: emptyState}}
          selected = {id === selected}
          onDelete={() => deleteState(id)}
          onSelect={() => setSelected(id)}
          onChange={(state) => setStates({...states, [id]: state})}
        />
      ))}

    </>
  )
}
