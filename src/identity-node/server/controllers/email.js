const Invite = require("../controllers").invite;

module.exports = {
  sendEmail(req, res) {
    var nodemailer = require("nodemailer");

    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "siltranscriber@gmail.com", // Your email id
        pass: "L5uGta*JcV$6" // Your password
      }
    });
    console.log("Sending email to " + req.body.email);
    var test = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Demystifying Email Design</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body style="margin: 0; padding: 0;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="padding: 10px 0 30px 0;"><table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;"><tr><td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;"></td></tr><tr><td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;"> <b>You have been invited to ' + req.body.orgName + ' Transcriber!</b></td></tr><tr><td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">Please click the following link to accept the invitation.<br><br>https://login-qa.siltranscriber.org/?clientid=2akgdSV0JESkenag0xRyt6i9QyrRzYVn&callback=admin-qa.siltranscriber.org&nonce=test&state=tAdInit&screen=signUp&inviteId=' + req.body.inviteId + '</td></tr><tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td width="260" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td> <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/left.gif" alt="" width="100%" height="140" style="display: block;" /></td></tr><tr><td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;"><br><br></td></tr></table></td><td style="font-size: 0; line-height: 0;" width="20"> &nbsp;</td><td width="260" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td> <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/right.gif" alt="" width="100%" height="140" style="display: block;" /></td></tr><tr><td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;"><br><br></td></tr></table></td></tr></table></td></tr></table></td></tr><tr><td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%"> &reg; <a href=https://www.sil.org/>SIL International</a>  2019<br/></td><td align="right" width="25%"><table border="0" cellpadding="0" cellspacing="0"><tr><td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;"></td><td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td><td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;"></td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>';
    var mailOptions = {
      to: req.body.email, // list of receivers
      subject: "Invitation to SIL Transcriber", // Subject line
      html: test
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: " + info.response);
      }
    });
  }
};
