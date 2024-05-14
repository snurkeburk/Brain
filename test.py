#!/bin/python3
import random
import uuid
import datetime

#DONE: Make these into Objects instead of seperate arrays
#DONE: Change the date to random instead of date.now() - 
#TODO: Add more names
#TODO: Make it playable with the following:
#       Add timer
#       Add select functionality
#       Add correction system
# For the menu: ability to cycle UP & DOWN and mark TRUE with SPACE

names = open("/home/snurkeburk/tfhs/names").read().splitlines()

class Person:
    def __init__(this, firstname, surname, uuid, date):
        this.firstname = firstname
        this.surname   = surname
        this.uuid      = uuid
        this.date      = date
    def __str__(self):
        return f"{self.firstname} {self.surname}    {self.uuid}     {self.date}"

def genName():
    random_int = random.randrange(1,len(names))
    name = names[random_int]
    names.remove(name) # Remove it from the OG list to prevent duplicates
    return name

uuids = []

def genUuid():
    return uuid.uuid4()

def genDate():
    formats=['A','B','Y','f','x','X']
    year = random.randint(1970,2024)
    month = random.randint(1,12)
    day = random.randint(1,30)
    hour = random.randint(0,23)
    minute = random.randint(1,59)
    seconds = random.randint(1,59)
    while month == 2 and day >= 29:
        day-=1
        
    format = formats[random.randint(1,len(formats)-1)]
    return datetime.datetime(year,month,day,hour,minute,seconds).strftime("%"+format)


def main():
    for i in range(49):
        #print(Person(genName(), genName(),genUuid(),genDate()))
        

if __name__ == '__main__':
    main()
