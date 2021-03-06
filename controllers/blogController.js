const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
//initialize admin SDK using serciceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    });
const firestore = admin.firestore();
const Blog = require('../models/blogModel');
module.exports = function(app){

    app.post('/createBlog',async function(req,res){
        try {
            const data = req.body;
            await firestore.collection('blogs').doc().set(data);
            res.send('Record saved successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }
        

    });

    app.get('/getBlogs',async (req,res)=>{
        try {
            const blogs = await firestore.collection('blogs');
            const data = await blogs.get();
            const blogsArray = [];
            if(data.empty) {
                res.status(404).send('No student record found');
            }else {
                data.forEach(doc => {
                    const blog = new Blog(
                        doc.id,
                        doc.data().userId,
                        doc.data().title,
                        doc.data().content,
                        doc.data().createdAt
                    );
                    blogsArray.push(blog);
                });
                res.send(blogsArray);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
        
     });

    app.delete('/deleteBlog/:id',async (req,res)=>{
        try {
            const id = req.params.id;
            await firestore.collection('blogs').doc(id).delete();
            res.send('Record deleted successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }   
    });
    app.get('/getBlog/:id',async (req,res)=>{
        try {
        const id = req.params.id;
        const blogs = await firestore.collection('blogs').doc(id);
        const data = await blogs.get();
        //console.log(blogs)
        console.log(data.data())
            if(data.empty) {
                res.status(404).send('No student record found');
            }else {
                res.send(data.data());
            }
     }catch (error) {
        res.status(400).send(error.message);
        }
    });

    app.put("/updateBlog/:id", async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const blog =  await firestore.collection('blogs').doc(id);
            await blog.update(data);
            res.send('Blog record updated successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }
    });
    app.get('/getBlogsByUser/:id',async (req,res)=>{
        try {
        const id = req.params.id;
        const blogs = firestore.collection('blogs');
        const data = await blogs.where('userId', '==', id).get();
        const blogsArray = [];
        if(data.empty) {
            res.status(404).send('No student record found');
        }else {
            data.forEach(doc => {
                const blog = new Blog(
                    doc.id,
                    doc.data().userId,
                    doc.data().title,
                    doc.data().content,
                    doc.data().createdAt
                );
                blogsArray.push(blog);
            });
            res.send(blogsArray);
        }
        } catch (error) {
            res.status(400).send(error.message);
        }
    });



};