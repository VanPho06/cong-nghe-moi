require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const cors = require('cors');
// Cấu hình AWS để kết nối DynamoDB thực
AWS.config.update({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: process.env.AWSREGION,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
app.use(express.json());
app.use(cors());


// Hàm tạo OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
//Hàm tạo Date otp
function generateDate() {
return new Date(Date.now() + 5 * 60 * 1000).toISOString();
}
// Reset password
app.post('/resetpassword', async(req,res) =>{
  // const {phoneNumber: {phoneNumber},newpassword} = req.body;
    const {phoneNumber,newpassword} = req.body;

  console.log(phoneNumber)
  console.log(newpassword)
  console.log( req.body)
  const params = {
    TableName:'User',
    Key:{
      phoneNumber
    }
  }
    if(newpassword.length < 8 )
    {
      return res.status(400).json({ error: 'Mật khẩu phải từ 8 ký tự ' });
    }
    
 
  try {
    const result = await dynamodb.get(params).promise();
    if(result.Item.otp)
      {
        return res.status(401).json({error : "Số điện thoại chưa xác thực OTP để đặt lại mật khẩu"});
    
      }
      const updateParams = {
        TableName: 'User',
        Key: { phoneNumber },
        UpdateExpression: 'set password = :newPassword  ',
        ExpressionAttributeValues: {
              ':newPassword' : newpassword,
            },
      };
      
      
    
      await dynamodb.update(updateParams).promise();
      res.json({ message: 'Đổi mật khẩu thành công', phoneNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quên mật khẩu
app.post('/forgot-password', async(req,res) =>{
  const {phoneNumber} = req.body;
  console.log(req.body);
  console.log(phoneNumber);
  const params = {
    TableName:'User',
    Key:{
      phoneNumber
    }
  }
  try {
    const result = await dynamodb.get(params).promise();
    console.log(result);
    if(!result.Item)
      {
        return res.status(401).json({error : "Số điện thoại không tồn tại"});
    
      }
      const otp = generateOTP()
      const otpExp = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const updateParams = {
        TableName: 'User',
        Key : {phoneNumber},
        UpdateExpression: 'set otp = :otp, otpExp = :expiry',
        ExpressionAttributeValues: {
          ':otp': otp,
          ':expiry' : otpExp,
        },
      };
      await dynamodb.update(updateParams).promise();
      // const snsParams = {
      //   Message: `Mã OTP của bạn là: ${otp}. Hiệu lực trong 5 phút.`,
      //   PhoneNumber: phoneNumber,
      // }; ==>Gửi qua SNS aws
     
      console.log(`OTP cho ${phoneNumber}: ${otp}`); // in ra console
      res.json({message:'OTP đã gửi qua số điện thoại'})                     
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//verify-otp
app.post('/verify-otp', async(req,res) =>{
  // const {phoneNumber: {phoneNumber},otp} = req.body;
  const {phoneNumber,otp} = req.body;
  console.log(phoneNumber)
  console.log(req.body)
  if(otp.length < 6 )
  {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ OTP ' });
  }
  const params = {
    TableName:'User',
    Key:{
      phoneNumber
    }
  }
  try {
    const result = await dynamodb.get(params).promise();
    
    if(result.Item.otp !== otp)
      {
        return res.status(401).json({error : "OTP không đúng"});
    
      }
      if(!result.Item.otpExp ||  Date.now() > new Date(result.Item.otpExpiry) )
      {
        return res.status(401).json({ error: 'OTP đã hết hạn' });
      }
      const updateParams = {
        TableName: 'User',
        Key: { phoneNumber },
        UpdateExpression: 'set verifyotp = :verified remove otp, otpExp',
        ExpressionAttributeValues: {
          ':verified': true, // Giá trị mới cho verifyotp
        },
      };
      res.json({ message: 'Xác nhận OTP thành công', phoneNumber });
      await dynamodb.update(updateParams).promise();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Endpoint đăng ký
app.post('/register', async (req, res) => {
  const { phoneNumber, fullName, password } = req.body;
  if (!phoneNumber || !fullName || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Mật khẩu phải ít nhất 8 ký tự' });
  }
  const otp = generateOTP();
  const otpExp = generateDate()
  const param = { // kiểm tra đã tồn tại chưa
    TableName:'User',
    Key:{
      phoneNumber
    }
  }
  try {
    const result = await dynamodb.get(param).promise();
    if(result.Item)
    {
      if(result.Item.verifyotp === true)
    {
      return res.status(400).json({ error: 'Tài khoản đã tồn tại' });
    }
    if(result.Item.verifyotp === false)
    {
      const deleteParams = {
        TableName: 'User',
        Key: { phoneNumber },
      };
      await dynamodb.delete(deleteParams).promise();
    }
    }
    const params = {
    TableName: 'User',
    Item: {
      phoneNumber,
      password,
      fullName,
      otp,
      otpExp,
      verifyotp:false
    },
  };
    await dynamodb.put(params).promise();
    console.log(`OTP cho ${phoneNumber}: ${otp}`); // In OTP ra console
    res.json({ phoneNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//Đăng nhập
app.post('/login', async(req,res) =>{
  const {phoneNumber,password} = req.body;
  
  if (!phoneNumber || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
  }
  const params = {
    TableName:'User',
    Key:{
      phoneNumber
    }
  }
  try {
    const result = await dynamodb.get(params).promise();
    if(!result.Item)
    {
      return res.status(401).json({error : "Số điện thoại không tồn tại"});
  
    }
    if(result.Item.verifyotp == false)
    {
      return res.status(401).json({error: "Số điện thoại chưa xác thực"})
    }
    if(result.Item.password != password)
    {
     
      return  res.status(401).json({error: "Mật khẩu không đúng"});
    }
    res.json({
      message : 'Đăng nhập thành công',
      user: {
        phoneNumber: result.Item.phoneNumber,
        fullName: result.Item.fullName,
      },
    });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
  } )
// Endpoint kiểm tra (lấy thông tin người dùng)
app.get('/user/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;
  const params = {
    TableName: 'Users',
    Key: { phoneNumber },
  };

  try {
    const result = await dynamodb.get(params).promise();
    res.json(result.Item || { message: 'Không tìm thấy người dùng' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy trên port ${PORT}`));