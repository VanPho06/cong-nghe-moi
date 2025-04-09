import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [yourPhoneNumber, setYourPhoneNumber] = useState("");
  const [yourPassword, setYourPassword] = useState("");
  const [message,setMessage] = useState('')
 

  const handleLogin = async () => {
    if (!yourPhoneNumber || !yourPassword) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: yourPhoneNumber, password: yourPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        navigation.navigate("MainApp"); // Chuyển đến màn hình chính
      } else {
        setMessage(data.error || "Đăng nhập thất bài!");
      }
    } catch (error) {
      setMessage("Lỗi kết nối: " + error.message);
    }
  };

  return (
    <View style={styles.mainLogin}>
      <Text style={styles.title}>ZaLo</Text>

      <View style={styles.cardLogin}>
        <Text style={styles.loginTitle}>Đăng nhập</Text>

        <View style={styles.textField}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#a0a0a0"
            keyboardType="phone-pad"
            value={yourPhoneNumber}
            onChangeText={setYourPhoneNumber}
          />
        </View>

        <View style={styles.textField}>
          <Text style={styles.label}>Mật khẩu:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#a0a0a0"
            secureTextEntry={true}
            value={yourPassword}
            onChangeText={setYourPassword}
          />
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
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.forgotPasswordBtn}
        >
          <Text style={styles.link}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.btnLogin}>
          <Text style={styles.btnText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.registerBtn}
        >
          <Text style={styles.link}>Đăng ký tài khoản mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainLogin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 20,
  },
  title: {
    fontSize: 40,
    color: "#0078FF",
    fontWeight: "bold",
    marginBottom: 30,
    letterSpacing: 2,
    fontStyle: "italic",
  },
  cardLogin: {
    width: "100%",
    maxWidth: 400,
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
  loginTitle: {
    color: "#0078FF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 30,
  },
  textField: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "#0078FF",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#E0F7FF",
    borderRadius: 10,
    padding: 15,
    color: "#0078FF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#0078FF",
  },
  forgotPasswordBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  link: {
    color: "#0078FF",
    fontSize: 16,
  },
  btnLogin: {
    backgroundColor: "#0078FF",
    borderRadius: 10,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerBtn: {
    padding: 10,
  },
});
