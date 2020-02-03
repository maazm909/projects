#This game consists of a player starting in the center trying to get to a red gate before slimes touch and catch him or her.
#The player is moved with the arrow keys, make sure to get both feet on the red gate!
#Caution: The moment the program is initiated, the game starts immediately, so be ready.

from tkinter import *
import tkinter as tk
import random
import sys
# global constants to set the size of the screen
SCREEN_WIDTH = 480
SCREEN_HEIGHT = 480

class Player:
    def __init__(self,x_pos,y_pos):
        # character images from: https://lionheart963.itch.io/4-directional-character


        self.idle_photos = []
        for i in range(4): # 4 idle sprites
            self.idle_photos += [tk.PhotoImage(file="sprites/main_character/idle/"+str(i)+".gif")] # load each sprite and save in a list

        self.move_up_photos = []
        for i in range(5): # 5 moving up sprites
            self.move_up_photos += [tk.PhotoImage(file="sprites/main_character/move_up/"+str(i)+".gif")]
            
        self.move_down_photos = []
        for i in range(5):
            self.move_down_photos += [tk.PhotoImage(file="sprites/main_character/move_down/"+str(i)+".gif")]

        self.move_right_photos = []
        for i in range(6):
            self.move_right_photos += [tk.PhotoImage(file="sprites/main_character/move_right/"+str(i)+".gif")]

        self.move_left_photos = []
        for i in range(6):
            self.move_left_photos += [tk.PhotoImage(file="sprites/main_character/move_left/"+str(i)+".gif")]


        # dictionary to map current "action" to images
        self.action_images = {
            "idle":self.idle_photos,
            "move up":self.move_up_photos,
            "move down": self.move_down_photos,
            "move right": self.move_right_photos,
            "move left": self.move_left_photos,
        }


        # keep track of current and previous action state
        self.action_state = "idle"
        self.last_state   = "idle"

        self.current_photo = 0 # start at the first photo

        # bind up and release keys
        win.bind('<Up>',self.move_up)
        win.bind('<Down>', self.move_down)
        win.bind('<Right>', self.move_right)
        win.bind('<Left>', self.move_left)
        ##

        win.bind('<KeyRelease>',self.release) # checking for any key release, not quite right but will work for us

        # first image
        self.imageID = canvas.create_image(x_pos,y_pos,image=self.action_images[self.action_state][self.current_photo])

        # start looping through sprites
        self.update_image()

    # used to move sprite and rotate through sprites to create animation
    def update_image(self):
        # move sprite on the screen according to current state (if "idle", doesn't have to move)

        if self.action_state == "move up": # moves the character up if state is "move up"
            if self.get_feet_coords()[1] <= 20:
                canvas.move(self.imageID,0,0)
            else:
                canvas.move(self.imageID,0,-10)


        elif self.action_state == 'move down':
            if self.get_feet_coords()[1] >= SCREEN_HEIGHT:
                canvas.move(self.imageID,0,0)

            else:
                canvas.move(self.imageID, 0, 10)

        elif self.action_state == 'move right':
            if self.get_feet_coords()[0] >= SCREEN_WIDTH:
                canvas.move(self.imageID,0,0)
            else:
                canvas.move(self.imageID, 10, 0)

        elif self.action_state == 'move left':
            if self.get_feet_coords()[0] <= 0:
                canvas.move(self.imageID,0,0)
            else:
                canvas.move(self.imageID, -10, 0)

        # rotates through photos to animate, resets animation on state change
        if self.action_state != self.last_state:
            self.last_state = self.action_state
            self.current_photo = 0 # go back to beginning of animation

        self.current_photo = (self.current_photo+1) % len(self.action_images[self.action_state]) # go to the next photo, wrap back to 0 if at end
        canvas.itemconfig(self.imageID, image=self.action_images[self.action_state][self.current_photo]) # update photo
        win.after(150, self.update_image) # automatically calls itself every 150ms


    # set the state to the up action state, "move up"
    def move_up(self,event):
        self.action_state = "move up"

    def move_down(self, event):
        self.action_state = "move down"

    def move_right(self, event):
        self.action_state = "move right"

    def move_left(self, event):
        self.action_state = "move left"


    # when a button is released, go back to idle action state, "idle"
    def release(self, event):
        self.action_state = "idle"

    # returns the x,y of the center of the feet as a list
    def get_feet_coords(self):
        points = canvas.coords(self.imageID) # gets x and y position of the center of the image
        feet_x = points[0]
        feet_y = points[1] + 84/2 - 6 # image is 84 pixels tall but the feet don't reach the bottom so there's an offset
        return [feet_x,feet_y]

    # takes in an x and y position and returns True if that point
    # is in the Player feet area, otherwise returns False - also not being used yet!
    def is_in(self, x_pos, y_pos):
        # get center of bottom of feet
        feet_point = self.get_feet_coords()

        # remove x and y positions for easy access
        feet_x = feet_point[0]
        feet_y = feet_point[1]

        # determine size of player feet rectangle, finetuned to what felt right
        # feel free to adjust once you're using this!
        feet_width = 50
        feet_height = 15

        # determine actual collision
        return feet_x - feet_width/2 < x_pos < feet_x + feet_width/2 and feet_y - feet_height/2 < y_pos < feet_y + feet_height/2

class Room:
    def __init__(self):
        self.tiles = []
        for i in range(4):
            a = [tk.PhotoImage(file="sprites/background/ground_brown/"+str(i)+".gif")]
            self.tiles += a
        for j in range(16):
            for k in range(16):
                canvas.create_image(32*j,32*k, image=random.choice(self.tiles))
        self.slimelist = []
        for i in range(5):
            x1 = random.randint(1, SCREEN_WIDTH/2 - 60)
            y1 = random.randint(1, SCREEN_HEIGHT/2 - 60)
            x2 = random.randint(300, SCREEN_WIDTH)
            y2 = random.randint(300, SCREEN_HEIGHT)
            x = random.choice([x1,x2])
            y = random.choice([y1,y2])
            self.slimelist += [Slime(x, y)]

    def get_slimelist(self):
        return self.slimelist

    def make_arch(self):
        self.arch_pic = tk.PhotoImage(file='sprites/background/target/'+str(0)+'.png')
        left_side = [30, random.randint(0, SCREEN_HEIGHT)]
        right_side = [SCREEN_WIDTH-30, random.randint(0, SCREEN_HEIGHT)]
        top_side = [random.randint(0, SCREEN_WIDTH), 20]
        bottom_side = [random.randint(0, SCREEN_WIDTH), SCREEN_HEIGHT - 40]
        all_sides = [left_side, right_side, top_side, bottom_side]
        choose_side = random.choice(all_sides)
        self.arch_id = canvas.create_image(choose_side[0], choose_side[1], image=self.arch_pic)


class Slime:
    def __init__(self, x_pos, y_pos):
        self.x_pos = x_pos
        self.y_pos = y_pos
        self.speed = random.randint(5, 9)
        self.blackslime = []
        self.blueslime = []
        self.goldslime = []
        for i in range(7):
            self.blackslime += [tk.PhotoImage(file="sprites/slimes/black/move/"+str(i)+".gif")]
            self.blueslime += [tk.PhotoImage(file="sprites/slimes/blue/move/"+str(i)+".gif")]
            self.goldslime += [tk.PhotoImage(file="sprites/slimes/gold/move/"+str(i)+".gif")]
        self.totalslimes = [self.blackslime, self.blueslime, self.goldslime]
        self.chosen = random.choice(self.totalslimes)
        self.slimeimage = canvas.create_image(self.x_pos, self.y_pos, image=self.chosen[0])
        self.current_slime = 0
        self.update_image()

    def update_image(self):
        self.current_slime = (self.current_slime+1) % 7
        canvas.itemconfig(self.slimeimage, image=self.chosen[self.current_slime])
        win.after(150, self.update_image)

    def move(self, x_pos, y_pos):
        self.current_xpos = canvas.coords(self.slimeimage)[0]
        self.current_ypos = canvas.coords(self.slimeimage)[1]
        if (self.current_xpos == x_pos) and (self.current_ypos == y_pos):
            return
        else:
            self.totaldistance = ((x_pos - self.current_xpos)**2 + (y_pos - self.current_ypos)**2)**.5
            self.x_distance = ((x_pos - self.current_xpos)/self.totaldistance)*self.speed
            self.y_distance = ((y_pos - self.current_ypos)/self.totaldistance)*self.speed
        canvas.move(self.slimeimage, self.x_distance, self.y_distance)


class Game:
    def __init__(self):
        # create player
        self.room = Room()
        self.room.make_arch()
        self.player = Player(SCREEN_WIDTH/2,SCREEN_HEIGHT/2)
        self.k = False
        self.abc = self.update()

    def update(self):
        self.gate_loc_x = canvas.coords(self.room.arch_id)[0]
        self.gate_loc_y = canvas.coords(self.room.arch_id)[1]
        if self.player.is_in(self.gate_loc_x, self.gate_loc_y):
            self.game_win()
            return

        for slime in self.room.slimelist:
            self.current_xpos = canvas.coords(slime.slimeimage)[0]
            self.current_ypos = canvas.coords(slime.slimeimage)[1]
            if self.player.is_in(self.current_xpos, self.current_ypos) == True:
                self.game_loss()
                return
        self.player_loc = self.player.get_feet_coords()
        for slime in self.room.slimelist:
            slime.move(self.player_loc[0], self.player_loc[1])
        self.abc = win.after(150, self.update)

    def game_win(self):
        print("You win")
        canvas.delete('all')
        canvas.create_text(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, text='Congratulations, you made it to the gate')

    def game_loss(self):
        print("You Lose")

        canvas.delete('all')
        canvas.create_text(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, text='Welp, you were caught by the slimes')


win = tk.Tk()
win.minsize(width=SCREEN_WIDTH, height=SCREEN_HEIGHT)
win.maxsize(width=SCREEN_WIDTH, height=SCREEN_HEIGHT)

win.title("My awesome game!")
canvas = tk.Canvas(win, width=SCREEN_WIDTH, height=SCREEN_HEIGHT)
canvas.pack()

g = Game()

tk.mainloop()
