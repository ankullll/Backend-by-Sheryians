const express = require('express')
const app = express();

app.use(express.json())
let notes=[]

app.get('/',(req,res)=>{
    res.send("Homepage")
})
app.post('/notes',(req,res)=>{
    notes.push(req.body)
    console.log(req.body)
    res.json({
        message:"notes created successfully"
    })
   
})
app.delete('/notes/:index',(req,res)=>{
    const index = req.params.index;
    delete notes[index]
    res.json({
        message:"Note deleted successfully"
    })
})

app.patch('/notes/:index',(req,res)=>{
    const index = req.params.index;
    const {title} = req.body;

    notes[index].title = title;
    res.json({
        message:"Note updated Successfully"
    })
})
app.get('/notes',(req,res)=>{
   res.json(notes)
})

app.listen(3000,()=>{
    console.log("working on port 3000")
})
