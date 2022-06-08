import React from 'react'

import styled from '@mui/material/styles/styled'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import ToolBar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close';

const RotatingIconButton = styled(IconButton)(({theme}) => ({
  transition: "transform 150ms ease-in-out",
  '&.open': {
    transform: "rotate(180deg)"
  }
}))

export default function DesktopMenu({ children, HeaderJSX=(<></>), ListJSX=(<></>) }) {
  const [open, setOpen] = React.useState(false)

  const toggleOpen = (state) => (event) => {
    if (event.type === "keydown" && event.key !== "Escape") {
      return
    }

    if (state === undefined) {
      setOpen(!open)
    } else {
      setOpen(state)
    }
  }
  
  return (
    <>
      <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <ToolBar>
          <RotatingIconButton
            className={open && "open"}
            color="inherit"
            aria-label='open side menu'
            edge="start"
            size="large"
            onClick={toggleOpen()}
          >
            { open ? <CloseIcon fontSize='large' /> : <MenuIcon fontSize='large' /> }
          </RotatingIconButton>
          <Typography variant='h4' noWrap component="div"> SIM </Typography>
          {HeaderJSX}
        </ToolBar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleOpen(false)}
        onKeyDown={toggleOpen()}
      >
        <Box sx={{overflowX: "hidden", width: 350}}>
          <ToolBar />
          {ListJSX}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0"
        }}
      >
        <ToolBar />
        <Box sx={{position: "relative", flexGrow:1}}>
          {children}
        </Box>
      </Box>
    </>
  )
}
