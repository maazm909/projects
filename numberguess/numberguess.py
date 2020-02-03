#In this game, a random number is chosen by the CPU between 1 and 99.
#You have to try to guess the number in the least amount of guesses as you can.
#Every time you guess, the game will tell you if you need to guess higher or lower.


import random
import tkinter as tk

# creates number guessing game using Tkinter GUI
class numberguess(tk.Frame):
    def __init__(self, master=None):
        self.target = random.randint(1,99)
        self.guess = 0
        self.turns = 0
        self.minRange = 0
        self.maxRange = 100
        tk.Frame.__init__(self, master)
        master.minsize(width = 275, height=200)
        master.maxsize(width = 475, height=400)
        master.title('Guess the number!')
        self.pack()
        self.createWidgets()

    # creates different text and parts of the GUI
    def createWidgets(self):
        # shows amount of guesses
        self.turnLabel = tk.Label(self, bg='white')
        self.turnLabel['text'] = 'Number of guesses: ' + str(self.turns)
        self.turnLabel.pack(padx=5, pady=10)

        # presents whether the guess given is high or low relative to target
        self.locationLabel = tk.Label(self, bg='white')
        self.locationLabel['text'] = 'Welcome to Guess a Number! Please enter \n your guess between 1 and 99 below'
        self.locationLabel.pack(padx=5, pady=5)

        # presents range where you can guess based on previous guesses
        self.rangeLabel = tk.Label(self)
        self.rangeLabel['text'] = 'Current Range: ' + str(self.minRange) + ' < target < ' + str(self.maxRange)
        self.rangeLabel.pack()

        # box where you enter your guess
        self.entryBox = tk.Entry(self)
        self.entryBox.pack()

        # button to submit guess
        self.submitButton = tk.Button(self)
        self.submitButton['text'] = 'Submit guess'
        self.submitButton['command'] = self.submitGuess
        self.submitButton.pack(pady=10)

    # determines whether guess is high/low/invalid and changes text accordingly, runs when submitButton is pressed
    def submitGuess(self):
        self.guess = int(self.entryBox.get())
        if self.guess < self.minRange or self.guess > self.maxRange:
            self.locationLabel['text'] = 'Guess is out of range, guess again!'
        elif self.guess == self.target:
            self.turns += 1
            self.endGame()
        else:
            # high branch
            if (self.guess > self.minRange) and (self.guess < self.target):
                self.locationLabel['text'] = 'Target is higher, guess again! \n'
                self.turns += 1
                self.turnLabel['text'] = 'Number of guesses: ' + str(self.turns)
                self.minRange = self.guess
            # low branch
            elif self.guess < self.maxRange and self.guess > self.target:
                self.locationLabel['text'] = 'Target is lower, guess again! \n'
                self.turns += 1
                self.turnLabel['text'] = 'Number of guesses: ' + str(self.turns)
                self.maxRange = self.guess
        self.rangeLabel['text'] = 'Current Range: ' + str(self.minRange) + ' < target < ' + str(self.maxRange)
        self.entryBox.delete(0, tk.END)

    # clears screen and creates end message when target is guessed
    def endGame(self):
        self.turnLabel.pack_forget()
        self.locationLabel.pack_forget()
        self.rangeLabel.pack_forget()
        self.entryBox.pack_forget()
        self.submitButton.pack_forget()
        self.finalMessage = tk.Label(self, bg='white')
        self.finalMessage['text'] = 'Congratulations! It took you ' + str(self.turns) + ' guesses to get ' + str(self.target)
        self.finalMessage.pack(pady=10)

app = numberguess(tk.Tk())
app.mainloop()
