const express = require('express');
const app = express();
const noteModel = require('./src/models/note.model')
const connectToDB = require('./src/db/db')

connectToDB()

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Hello World")
})
app.post('/notes',async (req,res)=>{
    const {title,content} = req.body;

    console.log(title,content)
    await noteModel.create({
        title,content
    })

    res.json({
        message:"note added successfully    "
    }
    )
})

app.get('/notes',async (req,res)=>{

    const notes = await noteModel.find()

    res.json({
        message:"Notes,fetched successfull",
        notes:notes
    })
})

app.delete('/notes/:id',async(req,res)=>{
    const noteId = req.params.id;

    await noteModel.findOneAndDelete({
        _id:noteId
    })

    res.json({
        message:"Note deleted successfully"
    })

})

app.patch('/notes/:id', async(req,res)=>{
    const noteId = req.params.id;
    const {title} = req.body;

    await noteModel.findOneAndUpdate({
        _id:noteId
    },{
        title:title
    })

    res.json({
        message:"node updated successfully"
    })
})
app.listen(3000,()=>{
    console.log("Server running on port 3000");

})