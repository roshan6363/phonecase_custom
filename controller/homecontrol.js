const Design = require('./../model/designmodel')
exports.gethomecontrol = (req,res)=>{
    Design.find({}, (err, designs) => {
        if (err) {
            console.error(err);
        } else {
 /*         
            designs.forEach(design => {
                console.log(`Image Name: ${design.design_image}`);
                console.log(`Design Name: ${design.design_name}`);
                console.log(`Category: ${design.category}`);
            });
            */
           res.render('home' , {des : designs})
        }
    });

}
exports.getcontactcontrol = (req,res)=>{
    res.render("Contact")
}

