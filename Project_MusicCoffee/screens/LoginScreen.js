import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
    const [ipAddress, setIpAddress] = useState(null);
    const [showButton, setShowButton] = useState(false); // State để quản lý việc hiển thị nút Go

    useEffect(() => {
        // Lấy địa chỉ IP công cộng từ ipify API
        axios.get('https://api.ipify.org?format=json')
            .then(response => {
                const ip = response.data.ip;
                setIpAddress(ip);
                // So sánh với IP bạn mong muốn
                if (ip === '103.118.28.92') {
                    setShowButton(true); // Nếu IP khớp, hiển thị nút Go
                } else {
                    Alert.alert('Lỗi', 'Không thể kết nối với địa chỉ IP phù hợp. Vui lòng thử lại...');
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy địa chỉ IP:', error);
            });
    }, []);
    const handleGo = () => {
        if (navigation) {
            navigation.navigate('Main');  // Điều hướng thay vì thay thế stack
        } else {
            console.error('Navigation không tồn tại.');
        }
    };

    return (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text category="h1">Đăng Nhập</Text>
            <Text category="s1">Địa chỉ IP của bạn: {ipAddress || 'Đang lấy IP...'}</Text>
            {showButton && ( // Hiển thị nút Go nếu IP khớp
                <Button onPress={handleGo} style={{ marginTop: 20 }}>
                    Go
                </Button>
            )}
        </Layout>
    );
}
