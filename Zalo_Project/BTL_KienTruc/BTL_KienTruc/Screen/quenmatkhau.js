import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function ForgotPasswordScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [otp, setotp] = useState("");

  const [message, setMessage] = useState("");
  const handleSendOTP = async () => {
    if (!phoneNumber || !newPassword || !confirmpassword) {
      setMessage("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (newPassword !== confirmpassword) {
      setMessage("Confirm Password không đúng");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber }),
      });
      const data = await response.json;
      if (response.ok) {
        setMessage("Đã gửi OTP qua số điện thoại!");
      } else {
        setMessage(data.error || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      setMessage("Lỗi kết nối" + error.message);
    }
    
  };
  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage('Vui lòng nhập mã OTP');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber:phoneNumber,otp}),
        // body: JSON.stringify({ phoneNumber,otp}),

      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        // Có thể thêm logic chuyển sang bước đặt lại mật khẩu
        

      } else {
        setMessage(data.error || 'Đã có lỗi xảy ra');
      }
    } catch (err) {
      setMessage('Lỗi kết nối: ' + err.message);
    }
  };
  const handleResetPassword =async () => {
    try {
      const response = await fetch('http://localhost:3000/resetpassword',{
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({phoneNumber:phoneNumber,newpassword:newPassword})
      
      });
      const data = await response.json();
      
      if(response.ok)
      {
          setMessage('Cập nhật thành công');
          setTimeout(() => {
            navigation.navigate("Login");
            }, 2000);
      } else{
          setMessage(data.error || 'Cập nhật thất bài!'  );
      }
  } catch (error) {
      setMessage('Lỗi kết nối: ' + error.message);
  }
    // // Logic để reset mật khẩu
    // Alert.alert("Thành công", "Mật khẩu đã được đặt lại thành công.");
  };

  return (
    <View style={styles.mainForgot}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <View style={styles.cardForgot}>
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
          <Text style={styles.label}>Mật khẩu mới:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.textField}>
          <Text style={styles.label}>Xác nhận mật khẩu:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu mới"
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
              value={otp}
              onChangeText={setotp}
            />
          </View>
          <TouchableOpacity style={styles.sendCodeBtn} onPress={handleSendOTP}>
            <Text style={styles.sendCodeText}>Gửi mã </Text>
            <FontAwesome name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendCodeBtn} onPress={handleVerifyOTP}>
            <Text style={styles.sendCodeText}>Xác nhận OTP </Text>
            <FontAwesome name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
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
        <TouchableOpacity style={styles.btnReset} onPress={handleResetPassword}>
          <Text style={styles.btnText}>ĐẶT LẠI MẬT KHẨU</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainForgot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
  },
  title: {
    fontSize: 32,
    color: "#0078FF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardForgot: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
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
    width: "100%",
    marginBottom: 15,
  },
  textFieldVerificationContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  textFieldVerification: {
    width: "60%",
  },
  label: {
    color: "#0078FF",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "#E0F7FF",
    borderRadius: 10,
    padding: 15,
    color: "#0078FF",
    borderWidth: 1,
    borderColor: "#0078FF",
  },
  inputVerification: {
    width: "100%",
    backgroundColor: "#E0F7FF",
    borderRadius: 10,
    padding: 15,
    color: "#0078FF",
    borderWidth: 1,
    borderColor: "#0078FF",
  },
  sendCodeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  sendCodeText: {
    color: "#0078FF",
    marginRight: 5,
  },
  btnReset: {
    backgroundColor: "#0078FF",
    borderRadius: 10,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#0078FF",
    marginTop: 10,
  },
});
