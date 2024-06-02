#!/bin/python3

import curses
from curses import wrapper
import curses.textpad as textpad

def create_window(height, width, start_y, start_x, border_config, standout_text=None, standout_pos=None):
    win = curses.newwin(height, width, start_y, start_x)
    # Apply border configuration
    win.border(*border_config)
    # Add standout text if provided
    if standout_text and standout_pos:
        win.addstr(standout_pos[0], standout_pos[1], standout_text, curses.A_STANDOUT)
    win.refresh()
    return win

def add_text(text, win, start_y=0, start_x=0, attribute=curses.A_NORMAL):
    string = win.addstr(start_y,start_x,text,attribute)
    win.refresh()

def loop_names(names):
    for i, name in enumerate(names):
        return i,name
    

def main(stdscr):
    stdscr.clear()
    stdscr.refresh()
    #curses.nocbreak()
    curses.curs_set(1)
    # Create the top window
    twin = create_window(
        height=2, 
        width=curses.COLS, 
        start_y=0, 
        start_x=0, 
        border_config=(1, 1, 1, 1, 1, 1, 1, 1),
        standout_text="Kan du inte läsa eller?", 
        standout_pos=(0, curses.COLS // 2 - 10)
    )
    
    # Create the right window
    rwin = create_window(
        height=curses.LINES - 1, 
        width=curses.COLS // 2, 
        start_y=1, 
        start_x=curses.COLS // 2, 
        border_config=(0, 1, 1, 1, 1, 1, 1, 1)
    )
    
    # Create the left window
    lwin = create_window(
        height=curses.LINES - 1, 
        width=curses.COLS // 2, 
        start_y=1, 
        start_x=0, 
        border_config=(1, 0, 1, 1, 1, 1, 1, 1)
    )

    lwin.nodelay(True)

    names = ["Klas", "Olof", "Sten", "Åke", "Bängan", "Per", "Jolle"]
    y = 0
    lwin.idcok(False)
    lwin.idlok(False)
    while True:
        try:
            key = stdscr.getkey()
        except: 
            key = None

        match key:
            case "KEY_DOWN":
                if not y >= curses.LINES - 2: # varför 2??
                    y += 1
            case "KEY_UP":
                if not y <= 0:
                    y -= 1
            case "KEY_LEFT":
                break
        lwin.erase() 
        for i,name in enumerate(names): # Kom på något mer effektivt här
            add_text(f"Hejsan {name}", lwin, i,10)
        add_text(f"({y+1}) > ", lwin, y, 2)

wrapper(main)
