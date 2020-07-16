var express=require('express')
var app=express();
var mongoose=require('mongoose');
var methodOverride=require('method-override');
var bodyParser=require('body-parser');
mongoose.connect('mongodb://localhost:27017/blog',{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
//Schema
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date, default:Date.now}
});
var Blog=mongoose.model('Blog',blogSchema);


//RESTful Routing
app.get('/',(req,res)=>{
	res.redirect('/blogs');
});
app.get('/blogs',(req,res)=>{
	Blog.find({},(err,bg)=>{
		if(err)console.log('ERROR');
		else{
			res.render('index',{bg:bg});
		}
	});
});
//C of CRUX
app.get('/blogs/new',(req,res)=>{
	res.render('new')
});
app.post('/blogs',(req,res)=>{
	Blog.create(req.body.blog,(err,newBlog)=>{
		if(err) res.redirect('/blogs/new')	;
		else res.redirect('/blogs');
	});
});
//R of CRUX
app.get('/blogs/:id',(req,res)=>{
	Blog.findById(req.params.id,(err,fblog)=>{
		if(err) {res.redirect('/');}
		else {
			res.render('show',{blog:fblog});}
	})
});
//Update U of CRUX
app.get('/blogs/:id/edit',(req,res)=>{
	Blog.findById(req.params.id,(err,fb)=>{
		if(err) res.redirect('/');
		else res.render('edit',{blog:fb});
	})
});
app.put('/blogs/:id',(req,res)=>{
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedblog)=>{
		if(err) res.redirect('/');
		else{
			res.redirect('/blogs/'+req.params.id);
		}
	});
});
//D of CRUX
app.delete('/blogs/:id',(req,res)=>{
	Blog.findByIdAndRemove(req.params.id,(err)=>{
		if(err){res.redirect('/blogs');}
		else {res.redirect('/blogs');}
	})
});
//RESTful DONE!
app.listen(3000,process.env.IP,function(){
	console.log('Server has started!');
});