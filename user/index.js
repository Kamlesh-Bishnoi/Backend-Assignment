var fetchRouter=require("router");
var router=fetchRouter();

router.post("/",require("./user.controller").sendUserDetails);// For SignUp
router.post("/verifyDetail",require("./user.controller").verifyDetail);//For Login
router.post("/verifyToken",require("./user.controller").VerifyToken);// For Token Verification
router.get("/verificationEmail/:emailToken" ,require("./user.controller").verificationEmail) // For email Verification 

module.exports=router;