var Detail = require("./user.model");
const bcrypt = require("bcrypt");
const saltRounds = 5;
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
exports.sendUserDetails = async (req, res) => {
  if (req.body) {
    try {
      let newDetail = await Detail.findOne({ email: req.body.email });
      console.log(newDetail)
      if (newDetail) {
        return res.json({ success: true, message: " User already exists" })
      }
      else {
        let hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        console.log("password after hashing ", hashedPassword);
        req.body.password = hashedPassword;
        let details = new Detail(req.body);
        
        let emailToken;
        try {
          emailToken = await sendToken(details);
        } catch (error) {
          console.error(error);
        }
        details.emailToken=emailToken;
        console.log("details are ", emailToken, details)
        let Userdoc = await details.save();
          
        if (true) {
          let msg = "http://localhost:8080/app/user/verificationEmail/"+emailToken;
          await sendEmail(msg);

          let updatedUserDetail = await Detail.findByIdAndUpdate(
            Userdoc._id,
            { $set: { password: hashedPassword, isActive: true } },
            { new: true }
          );
          await updatedUserDetail.save();
          return res.json({
            sucess: true,
            data: updatedUserDetail,
            message: "detail submiited"
          });
        }
      }
    } catch (err) {
      return res.json({ success: false, data: "", message: err })
    }
  }
  else {
    return res.json({ success: false, data: "", message: "Parameter missing" })
  }
}

exports.verifyDetail = async (req, res) => {
  if (req.body.username && req.body.email && req.body.password) {
    try {
      let findUserDetail = await Detail.findOne({ email: req.body.email, isActive: true });
      let verifyToken= await sendToken(findUserDetail);
      console.log("verifyToken is",verifyToken)
      console.log("findUser detail", findUserDetail);
      if (findUserDetail) {
        let comparedPassword = await bcrypt.compare(
          req.body.password,
          findUserDetail.password
        );
        console.log("comapre password status", comparedPassword);
        if (comparedPassword) {
          findUserDetail.token = verifyToken;
          await findUserDetail.save();
          return res.json({
            success: true,
            data: verifyToken,
            message: "Details matched successfully!!!"
          });
        } else {
          return res.json({
            success: false,
            data: "",
            message: "Incorrect paassword entered..."
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Invalid Credentials",
          data: ""
        });
      }
    } catch (err) {
      console.log("error", err);
      return res.json({ status: false, message: err, data: "" });
    }
  } else {
    return res.json({
      success: false,
      message: "Missing parameters",
      data: ""
    });
  }
};

exports.VerifyToken = (req, res) => {
  if(req.body.token){
  jwt.verify(req.body.token, 'AssignmentFirst', async function (err, decoded) {
    console.log("decode details is", decoded)
    if (err) {
      return res.json({ success: false, message: "Incorrect token" })
    }
    let verifyToken = await Detail.findOne({ _id: decoded._id, token: req.body.token })
    if (verifyToken) {
      return res.json({ success: true, message: "token verified" })
    }
    else {
      return res.json({ success: false, message: "token not verified" })
    }
  });}
  else{
    return res.json({success:false,message:"parameter missing"})
  }
}

exports.verificationEmail = async (req, res) => {
  if (req.params.emailToken) {
    let findUserDetail = await Detail.findOne({ emailToken:req.params.emailToken })
    console.log("finduserdetail hhhhhhh",findUserDetail)
    if (findUserDetail) {
      findUserDetail.isActive=true;
      await findUserDetail.save();

      let msg = "Your account is verified and now you can login";
      await sendEmail(msg);
      return res.json({ success: true, data: findUserDetail, message: "User Activated" })
    } else {
      return res.json({ success: false, data: " ", message: "Invalid Code" })
    }
  }
}

async function sendEmail(msg) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "amanbishnoi569@gmail.com", // generated ethereal user
      pass: "amanbishnoi1234567890029" // generated ethereal password
    }
  });
  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: '<amanbishnoi569@gmail.com>',
      to: "kamleshbishnoi812@gmail.com",
      subject: "Hello ✔",
      text: msg,
    });
    console.log("Message sent: %s", info.messageId);

  } catch (error) {
    console.log(error)
  }
}

async function sendToken(findUserDetail){
  let token = await jwt.sign({ _id: findUserDetail._id }, "AssignmentFirst", {
    algorithm: "HS256", expiresIn: '1h' });
  console.log( "token is ",token);
   await Detail.findByIdAndUpdate(
    findUserDetail._id,
    { $set: { token: token } },
    { new: true }
  );
  return token;
}