import React from 'react'

import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import SettingsIcon from '@mui/icons-material/Settings'

import DesktopMenu from './components/DesktopMenu'
import MobileMenu from './components/MobileMenu'
import CellularAutomata from './components/CellularAutomata'
import StateList from './components/StateList'


function App() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
  
  const [states, setStates] = React.useState({})
  const [pause, setPause] = React.useState(false)
  const [drawing, setDrawing] = React.useState(false)
  const [freq, setFreq] = React.useState(2)

  const Menu = mobile ? MobileMenu : DesktopMenu

  return (
    <>
      <Menu
        HeaderJSX={<>
          <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
            <Button color="inherit" onClick={() => { setPause(state => !state) }}>
              <Typography variant="h4">
                {pause ? "Run" : "Pause"}
              </Typography>
            </Button>
          </Box>
          {pause ? <PauseCircleOutlineIcon fontSize="large" />
            : <SettingsIcon fontSize="large" sx={{
              animation: "spin 3s linear infinite",
              "@keyframes spin": {
                "0%": { transform: "rotate(360deg)" },
                "100%": { transform: "rotate(0deg)" }
              }
            }} />}
        </>}

        ListJSX={
          <List sx={{width: "100%", overflowX: "hidden"}}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { setDrawing(state => !state)}}>
                <ListItemText primaryTypographyProps={{variant: "h6"}} id="drawing-mode" primary="Drawing Mode"/>
                <ListItemIcon>
                  <Checkbox size='medium' edge="end" checked={drawing} disableRipple inputProps={{'aria-labelledby': 'drawing-mode'}}/>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{paddingX: 2, paddingY: 1}}>
                <Typography sx={{marginRight: 2}} variant="h6"> Frequency </Typography>
                <Slider value={freq} onChange={(_, val)=>setFreq(val)} step={0.1} valueLabelDisplay="auto" min={1} max={10} sx={{marginX: 1}}/> 
            </ListItem>
            <Divider />
            <StateList />
          </List>
        }
      >
        <CellularAutomata frequency={freq} paused={pause} drawing={drawing}/>
      </Menu>
    </>
  )
}

export default App
