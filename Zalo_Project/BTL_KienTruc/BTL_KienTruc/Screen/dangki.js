import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState("");
  
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState("");
  const handleSendOTP = async () => {
    // Kiểm tra dữ liệu trước khi gửi
    if (!phoneNumber || !fullName || !password || !confirmpassword) {
      setMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmpassword) {
      setMessage('Mật khẩu không khớp');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, fullName, password }),
      });

      const data = await response.json();
      console.log(data.phoneNumber)
      if (response.ok) {
        // navigate('/verifyotpresgiter',{state :{phoneNumber: data.phoneNumber}});
        setMessage("OTP đã được gửi về điện thoại!")
      } else {
        setMessage(data.error || 'Đã có lỗi xảy ra');
      }
    } catch (err) {
      setMessage('Lỗi kết nối: ' + err.message);
    }
    
  };
  const handleVerifyOTP = async () => {
    if (!verificationCode) {
      setMessage('Vui lòng nhập mã OTP');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber:phoneNumber,otp:verificationCode}),
        // body: JSON.stringify({ phoneNumber,otp}),

      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        navigation.navigate("Login");        

      } else {
        setMessage(data.error || 'Đã có lỗi xảy ra');
      }
    } catch (err) {
      setMessage('Lỗi kết nối: ' + err.message);
    }
  };
 

  return (
    <View style={styles.mainRegister}>
      <Text style={styles.title}>Đăng ký</Text>
      <View style={styles.cardRegister}>
        <View style={styles.textField}>
          <Text style={styles.label}>Họ và tên:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.textField}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.textField}>
          <Text style={styles.label}>Mật khẩu:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.textField}>
          <Text style={styles.label}>Xác nhận lại mật khẩu:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry={true}
            value={confirmpassword}
            onChangeText={setconfirmPassword}
          />
        </View>
        <View style={styles.textFieldVerificationContainer}>
          <View style={styles.textFieldVerification}>
            <Text style={styles.label}>Mã xác nhận:</Text>
            <TextInput
              style={styles.inputVerification}
              placeholder="Nhập mã xác nhận"
              keyboardType="numeric"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
          </View>
          <TouchableOpacity style={styles.sendCodeBtn} onPress={handleSendOTP} >
            <Text style={styles.sendCodeText}>Gửi mã </Text>
            <FontAwesome name="refresh" size={20} color="#0078FF" />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.sendCodeBtn} onPress={handleVerifyOTP}>
            <Text style={styles.sendCodeText}>Xác nhận OTP </Text>
            <FontAwesome name="refresh" size={20} color="#0078FF" />
          </TouchableOpacity> */}
        </View>
        {message && (
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 10,
                      fontSize: 14,
                      color: message.includes("thành công") ? "green" : "red",
                    }}
                  >
                    {message}
                  </Text>
                )}
        <TouchableOpacity style={styles.btnRegister} onPress={handleVerifyOTP}>
          <Text style={styles.btnText}>ĐĂNG KÝ</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainRegister: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1'
  },
  title: {
    fontSize: 32,
    color: '#0078FF',
    fontWeight: 'bold',
    marginBottom: 20
  },
  cardRegister: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textField: {
    width: '100%',
    marginBottom: 15
  },
  textFieldVerificationContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  textFieldVerification: {
    width: '60%'
  },
  label: {
    color: '#0078FF',
    marginBottom: 5
  },
  input: {
    width: '100%',
    backgroundColor: '#E0F7FF',
    borderRadius: 10,
    padding: 15,
    color: '#0078FF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#0078FF'
  },
  inputVerification: {
    width: '100%',
    backgroundColor: '#E0F7FF',
    borderRadius: 10,
    padding: 15,
    color: '#0078FF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#0078FF'
  },
  sendCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  sendCodeText: {
    color: '#0078FF',
    marginRight: 5
  },
  btnRegister: {
    backgroundColor: '#0078FF',
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  link: {
    color: '#0078FF',
    marginTop: 10
  },
});