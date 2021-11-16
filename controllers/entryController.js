const Entry = require("../models/Entry");
const TodoTask = require("../models/TodoTask");

module.exports = function(app){

    app.get("/entry/add", (req, res) => {
        res.render("entry.ejs", {todoTasks: 0, entry:0});
    });

    app.get("/", async (req, res) => {        
        Entry.find({user:req.session.userid}).sort({ date: 'desc'}).lean().exec(function(err, entries) {  
            Promise.all(
                entries.map((item) => {
                    return new Promise((resolve) => {
                        TodoTask.countDocuments({user:item.user, date:item.date,completed:1}, function (err, count) {
                            TodoTask.countDocuments({user:item.user, date:item.date}, function (err, data) {
                                resolve({     
                                    _id:item._id,
                                    date:item.date,
                                    gratitude:item.gratitude,
                                    achievement:item.achievement,                   
                                    completed: count,
                                    all: data
                                });
                            });   
                        });
                    });
                })
            ).then((entries) => {
                res.render("entries.ejs", {entries: entries});
            });           
        });
    });

    app.get("/entry/:id", (req, res) => {
        Entry.findById(req.params.id,(err, entry) => {
            TodoTask.find({date:entry.date,user:req.session.userid}, (err, tasks) => {
                res.render("entry.ejs", {entry:entry, todoTasks: tasks});
            });   
        });
    });

    app.post("/entry/edit", async (req, res) => {

        const db_entry= await Entry.findById(req.body.id).exec();
        const old_date= db_entry.date.getFullYear()+'/'+(db_entry.date.getMonth()+1)+'/'+db_entry.date.getDate();
        
        if(old_date!=req.body.date){
            const date_exists = await Entry.find({ date: req.body.date, user: req.session.userid });
            if (date_exists.length){   
                let error = "An entry with this date already exists!";
                res.status(480).json(error);
                return;
            }
            
            TodoTask.updateMany({date:db_entry.date,user:req.session.userid},{date:req.body.date},(err, data)=>{           
                console.log(data);
            });
            db_entry.updateOne({date: req.body.date, gratitude:req.body.gratitude, achievement: req.body.achievement},(err,data)=>{
                if(err) throw err;
                res.status(200).json(data);
            });
        }
        else{
            db_entry.updateOne({date: req.body.date, gratitude:req.body.gratitude, achievement: req.body.achievement},(err,data)=>{
                if(err) throw err;
                res.status(200).json(data);
            });
        }
    });

    app.post('/entry/add', async function(req,res){
        const entry = await Entry.find({ date: req.body.date, user: req.session.userid });
        if (entry.length){   
            let error = "An entry with this date already exists!";
            res.status(480).json(error);
            return;
        }

        const item = Entry({user:req.session.userid,gratitude:req.body.gratitude,achievement:req.body.achievement,date:req.body.date}).save((err,data)=>{
            if(err) throw err;
            res.status(200).json(data);
        });

    });

    app.delete('/entry/:entry', async function(req,res){
        //find entry and get date and user id
        const db_entry= await Entry.findById(req.params.entry).exec();
        const tasks = await TodoTask.find({ date: db_entry.date, user: db_entry.user });

        if(tasks.length){         
            var del =await TodoTask.deleteMany({ date: db_entry.date, user: db_entry.user });
        }

        db_entry.deleteOne(function(err,data){
            if(err) throw err;
            res.status(200).json(data)
        });
    });


};