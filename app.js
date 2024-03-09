const { get } = require("http");
const express = require("express");
const app= express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const { privateDecrypt } = require("crypto");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate"); 
main()
.then(res =>console.log("conn sucessful to db"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderway');

}
app.get("/", (req, res)=>{
    res.send("working");
})

// app.get("/listingcheck",async (req,res)=>{
//   const samplelisting= new Listing({
//     title:"hotel danny",
//     description:"hotel by the sea",
//     price:1200,
//     image:"",
//     location:"Goa",
//     country:"india"
//   })
//   await samplelisting.save();
//   console.log("saved in db");
//   res.send("sample is saved");

// })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate); 

app.use(express.static(path.join(__dirname, 'public')));




//index route which display all listings
app.get("/listings",async(req, res)=>{
const alllistings = await Listing.find();
  res.render("listings/index.ejs", {alllistings});  
});

//new route from index.js add new button
app.get("/listings/new",(req, res)=>{
  res.render("listings/new.ejs");
});
//create new route from new.ejs
app.post("/listings",async(req,res)=>{
  //adding directy in listing model
  const newlist = new Listing(req.body.listing);

  await newlist.save();
  res.redirect("/listings");
});

//delete route 
app.delete("/listings/:id",async (req,res)=>{
  let{id}= req.params;
  let deletedListing= await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}); 

//edit page route
app.get("/listings/:id/edit", async(req,res)=>{
  let {id} =req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
});

//update route
// app.put("/listings/:id", async(req,res)=>{
//   let {id}=req.params;
//   await Listing.findByIdAndUpdate(id,{...req.body.listing});
//   res.redirect(`listings/${id}`);
// });
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//show route
app.get("/listings/:id",async(req,res)=>{
let{id}= req.params;
const listing =await Listing.findById(id);
console.log(listing);
res.render("listings/show.ejs",{listing})
});


app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})
            