const User = require("./../model/userdatamodel")
const Design = require('./../model/designmodel')

exports.getadmincontrol = async(req,res)=>{
    res.render("admin")
   const admin = await User.create({phone_number : 9811005038 , Name :"avin" ,email:"avigupta2001ad@gmail.com",address :"banglore yalankha"})
   if(admin){
    console.log("data sent successfully")
   }
}



exports.postuploadcontrol = async(req,res)=>{
    if (req.file) {
        const design_name = req.body.design_name;
        const category = req.body.category;
        const design_image = req.file.filename;
  
        if (!design_name) {
            return res.status(400).send('Design name is required.');
        }
  
        const newDesign = new Design({
            design_name,
            category,
            design_image,
        });
  
        newDesign.save()
            .then(() => {
                res.send('Design uploaded and saved to the database.');
            })
            .catch(err => {
                res.status(500).send(err);
            });
    } else {
        res.send('No image selected.');
    }
}


