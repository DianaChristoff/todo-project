const TodoTask = require("../models/TodoTask");
const Entry = require("../models/Entry");

module.exports = function(app){

    app.post('/task/add', async function(req,res){
        const check = await Entry.exists({date:req.body.date, user:req.session.userid});
        if (!check){
            const entry = await Entry({date:req.body.date, user:req.session.userid, gratitude: '', achievement:''}).save(function(err,ent){
                if(err) {
                let error = toastr.error(err);
                res.status(480).json(error);
                }
                const item = TodoTask({user:req.session.userid, content:req.body.content, date: req.body.date}).save(function(err, data){
                    if(err) throw err;
                    res.status(200).json({task:data,entry_id:ent._id});
                });
            })
        }else{
            const item = TodoTask({user:req.session.userid, content:req.body.content, date: req.body.date}).save(function(err, data){
                if(err) throw err;
                res.status(200).json({task:data});
            });
        }
        
    });

    app.post('/task/edit', function(req,res){
        const item=TodoTask.updateOne({_id:req.body.id}, {content: req.body.content}, function(err,data){
                if(err) throw err;
                res.status(200).json(data);
            });
    });

    app.post('/task/complete', function(req,res){
         TodoTask.updateOne({_id:req.body.task},{completed:req.body.value},(err,data)=>{
            if(err) throw err;
            res.status(200).json(data);
        });
    });

    app.delete('/task/:task', async function(req,res){
        const task = await TodoTask.findById(req.params.task);
        const entry = await Entry.find({ date: task.date, user:task.user,});
        const count = await TodoTask.countDocuments({ date: task.date, user:task.user,}); // { _id: ... }

        if(entry.gratitude!='' || entry.achievement!=''){

            TodoTask.deleteOne({_id:req.params.task},(err,data)=>{
                if(err) throw err;
                res.status(200).json(data)
            });

        }else if (count==1){
            var del_entry = Entry.deleteOne({_id:entry._id},(err,data)=>{
                if(err) throw err;
            });
            TodoTask.deleteOne({_id:req.params.task},(err,data)=>{
                if(err) throw err;
                res.status(200).json(data)
            });

        }
    });

};