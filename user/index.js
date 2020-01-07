var fetchRouter=require("router");
var router=fetchRouter();

router.post("/",require("./user.controller").sendUserDetails);
// router.post("/bcrypt",require("./user.controller").userDetail);
router.post("/verifyDetail",require("./user.controller").verifyDetail);
router.post("/verifyToken",require("./user.controller").VerifyToken);
router.get("/verificationEmail/:emailToken",require("./user.controller").verificationEmail)

module.exports=router;