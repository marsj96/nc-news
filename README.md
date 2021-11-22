# Northcoders News API - Reddit Clone

The goal of the project below was to create an API that responded in a similiar way to a reddit. You are able to make requests such as GET, POST, PATCH and DELETE. 

## Hosting and Installation

You can access the API here, which is currently being hosted on Heroku:

[nc-news-reddit](https://nc-news-reddit.herokuapp.com/api)

The API is currently being displayed in JSON format, I would recommend using this extension to make the site more readable:

[JSONviewer](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh)

If you would like to install the project on your local machine, please see the below:

```bash
git clone https://github.com/marsj96/nc-news
```
In order to install the relevant packages, please use

```bash
npm init
```

You will need to create two files within the project in order to tell our connection file where we are connecting to. We can use .env files for this.

```bash
echo PGDATABASE=nc_news >> env.development
echo PGDATABASE=nc_news_test >> env.test
```
Each of these files would need the following:

/api/topics (GET) - Responds with an array of objects containing the topics.

/api/articles (GET) - Responds with an array of objects contains all articles, including their respective properties.




- Write your README, including the following information:
  - [X] Link to hosted version
  - [ ] Write a summary of what the project is
  - [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
  - [ ] Include information about how to create the two `.env` files
  - [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project