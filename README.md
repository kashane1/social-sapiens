# Social-Sapiens

## Assignment
My task was to build a Social Network API using MongoDB.

I also incorporated Express.js.

No starter code was given to me so this application was built from scratch.

No seed data was provided so everything seen in the walkthrouigh video was create using the API inside of Insomnia.

---
## Walkthrough Video
https://drive.google.com/file/d/15RPEjYpAZ8ZX6TmqefgP8veJYYcy8JNH/view?usp=sharing

---
## Acceptance Criteria
1. Build an API using a NoSQL database to handle large amounts of data
2. Data is formatted in JSON when running all the routes in Insomnia
3. Successful routes include GET, POST, PUT, DELETE for both Users and Thoughts

---
## Process
Some of the biggest challenges I faced were getting the controllers to work exactly as I wanted them to. Sometimes the JSON response object wasnt exactly what I wanted. Other times I got errors that I had to figure out. A common error I encountered boiled down to trying to pass a res.json(...) at the end of a .then statement, to another .then statement. And I had to realise why that wasn't possible, and then I could just use the (...) as the promise instead. 

I definitely feel good about this assingment and my level of completion with it. I feel like I learned the material much more as I put in the hours here. 