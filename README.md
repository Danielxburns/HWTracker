
# Homework Tracker

A vanilla JS homework tracker with an Express server using MongoDB

The objective of this app is to create a common interface for parents and children to keep track of what the student's homework assignments are and what has been completed.

It provides an incentive for completion by way of a point system.
Points can be redeemed for items added to a wish list.

![homework_tracker resized](https://user-images.githubusercontent.com/41316262/235381998-cac85ea9-a2d7-4025-aa41-e26c5641c489.png)

## Tech Stack

**Client:** Vanilla JS

**Server:** Node, Express

**Database:** MongoDB


## Deployment

You will need to install the Heroku CLI first

```
$ git push heroku master
```

* I updated the default branch on github from master to main.
* I did not yet configure heroku to work with this change 

### Development
To start in dev mode, in terminal type:
* npm install
* sudo service mongod start
* npm run dev
* in browser go to localhost:3000

### Production
push to master branch to deploy
production is deployed to heroku at https://booooooooom.herokuapp.com/

* currently not working due to lack of connection to database.
  The mLabs Mongodb addon for Heroku has been discontinued.
  See Roadmap section for ideas for fix.


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Roadmap

- Try to connect to Heroku to Mongo Atlas by following these [instructions](https://www.mongodb.com/developer/products/atlas/use-atlas-on-heroku/)
