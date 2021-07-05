import Vue from "vue";
import { db } from "../main";
import firebase from "firebase";

export const blockData = [
  {
    Id: 1,
    Subject: "Explosion of Betelgeuse Star",
    StartTime: new Date(2021,6,5,11,0),
    EndTime: new Date(2021,6,5,12,0),
    IsBlock: true,
  },
  {
    Id: 2,
    Subject: "Thule Air Crash Report",
    StartTime: new Date(2018, 1, 12, 12, 0),
    EndTime: new Date(2018, 1, 12, 14, 0),
  },
  {
    Id: 3,
    Subject: "Blue Moon Eclipse",
    StartTime: new Date(2018, 1, 13, 9, 30),
    EndTime: new Date(2018, 1, 13, 11, 0),
  },
  
];




export const getBlockedTimeSlot = async () => {
    console.log(await db)
    const array = await db.collection('meeting').doc("dAngynKjopYVkqH6YGfc").get()
    const timeslot = await array.get('timeslot')
    let pushTimeSlot = [{
        Id: 1,
    Subject: "Explosion of Betelgeuse Star",
    StartTime: new Date(2021,6,5,12,0),
    EndTime: new Date(2021,6,5,13,0),
    IsBlock: true,
    }];
    let counter = 0;
    console.log(timeslot)
    for(let i=0; i<timeslot.length; i++){
        console.log(timeslot[i].start.toDate().toLocaleDateString())
        console.log(new Date(timeslot[i].start.seconds))
        console.log(new Date(2018, 1, 13, 9, 30))
        const currStart = timeslot[i].start.toDate().toLocaleDateString()
        const currStartYear = parseInt(currStart.substr(6,4))
        const currStartMonth = parseInt(currStart.substr(3,2)) -1
        const currStartDate = parseInt(currStart.substr(0,2))

        const currEnd = timeslot[i].end.toDate().toLocaleDateString()
        const currEndYear = parseInt(currEnd.substr(6,4))
        const currEndMonth = parseInt(currEnd.substr(3,2)) -1
        const currEndDate = parseInt(currEnd.substr(0,2))
        pushTimeSlot.push({
            Id: counter,
            Subject: "",
            StartTime: new Date(timeslot[i].start.toDate()),
            EndTime: new Date(timeslot[i].end.toDate()),
            IsBlock:true
        })
        counter += 1
    }
    console.log("hello !" + JSON.stringify(pushTimeSlot))
    console.log(pushTimeSlot)
    return pushTimeSlot

}

