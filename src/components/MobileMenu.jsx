import React from 'react'

import { Global } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import styled from '@mui/material/styles/styled'


const Puller = styled(Box)(({theme}) => ({
  width: 30,
  height: 6,
  borderRadius: 3,
  position: 'absolute',
  backgroundColor: "#ccc",
  top: 8,
  left: 'calc(50% - 15px)',
}))

const drawerBleeding = 56

export default function MobileMenu({ children }) {
  const [open, setOpen] = React.useState(false)

  const toggleOpen = (state) => () => {
    if (state === undefined) {
      setOpen(!open)
    } else {
      setOpen(state)
    }
  }

  return (
    <div style={{height: "100%"}}>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      {children}
      <SwipeableDrawer
        anchor='bottom'
        open={open}
        onClose={toggleOpen(false)}
        onOpen={toggleOpen(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true
        }}
      >
        <Paper
          elevation={15}
          variant="elevation"
          sx={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            height: '200%',
            right: 0,
            left: 0
          }}
        >
          <Puller />
          <Paper
            square
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              pt: 2,
              pb: 1,
              width: '100%',
              height: drawerBleeding
            }}
          >
            <Typography
              align="center"
              variant='h6'
              sx={{color: (theme) => theme.palette.primary.contrastText }}
            >
              Parameters
            </Typography>
          </Paper>
          <Box sx={{height: '100%'}}>

          </Box>
        </Paper>
      </SwipeableDrawer>
    </div>
  )
}
