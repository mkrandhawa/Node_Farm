const fs = require("fs"); //requiring file system module
const http = require("http"); //requiring http module
const url = require("url"); //requiring url module
const slugify = require("slugify"); //requiring slugify module will be used to get the last part of the URL

const replaceTemplate = require("./modules/replaceTemplate"); //requiring the function that we exported




const template_overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,"utf-8");
const template_card = fs.readFileSync(`${__dirname}/templates/template-card.html`,"utf-8");
const template_product = fs.readFileSync(`${__dirname}/templates/template-product.html`,"utf-8");


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8"); //this will be executed once when the program will be started
const dataObj = JSON.parse(data);


const slugs = dataObj.map((el) => slugify(el.productName, { lower: true })); //will change to lower case all the product names inside the data.jason file
console.log(slugs);



const server = http.createServer((req, res) => {
  //res will deal with sending req will deal with getting the data given by the user

  const { query, pathname } = url.parse(req.url, true); //using ES6 destructring: create two variable: query and pathName
  //these values will be retrieved from the Url object that has all the info
  //the name given to the varible must be same os the object name that are used in the result

  //Overview Page

  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const card_html = dataObj.map((el) => replaceTemplate(template_card, el)).join("");
    const output = template_overview.replace("{%product_card%}", card_html);
    res.end(output);



    //Product Page
  } else if (pathname === "/product") {
    //console.log(query);
    const product = dataObj[query.id]; // the object that we need will be at the position query.id (dataObj is an array)
    const output = replaceTemplate(template_product, product); //replacing the data using the replaceTemplace function:
    //product is the variable that will pass the id of the product
    res.writeHead(200, { "Content-type": "text/html" });

    res.end(output);



    //NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text.html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not FOUND! </h1>");
  }
});



server.listen("3000", "127.0.0.1", () => {
  console.log("Server has started succesfully!");
}); //will run on localhost port number 3000
