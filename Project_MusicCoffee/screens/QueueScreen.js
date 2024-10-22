import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Modal, StyleSheet } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import axios from 'axios';
import { WebView } from 'react-native-webview';  // Sử dụng WebView để phát video YouTube
import io from 'socket.io-client';  // WebSocket

export default function QueueScreen() {
    const [queue, setQueue] = useState([]);
    const [videoId, setVideoId] = useState(null);  // Trạng thái để lưu video YouTube đang được phát
    const [modalVisible, setModalVisible] = useState(false);  // Điều khiển hiển thị modal WebView

    // Kết nối WebSocket
    useEffect(() => {
        const socket = io('http://192.168.0.106:3000');  // Địa chỉ của server

        // Lắng nghe sự kiện bài hát được thêm
        socket.on('songAdded', (newSong) => {
            setQueue((prevQueue) => [...prevQueue, newSong]);  // Thêm bài hát vào danh sách
        });

        // Lắng nghe sự kiện bài hát bị xóa
        socket.on('songDeleted', (deletedSong) => {
            setQueue((prevQueue) => prevQueue.filter(song => song._id !== deletedSong._id));  // Loại bỏ bài hát khỏi danh sách
        });

        return () => socket.disconnect();  // Ngắt kết nối khi component bị unmount
    }, []);

    // useEffect để load dữ liệu danh sách khi component được mount lần đầu
    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const response = await axios.get('http://192.168.0.106:3000/music/queue');
                setQueue(response.data);  // Cập nhật danh sách bài hát
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài hát:', error);
            }
        };
        fetchQueue();
    }, []);

    // Chức năng để phát nhạc
    const playMusic = (videoId) => {
        setVideoId(videoId);  // Lưu videoId của video được chọn
        setModalVisible(true);  // Hiển thị modal để phát video YouTube
    };

    const deleteMusic = async (videoId) => {
        try {
            await axios.delete(`http://192.168.0.106:3000/music/delete/${videoId}`);
        } catch (error) {
            console.error('Lỗi khi xóa bài hát:', error);
        }
    };

    return (
        <Layout style={{ flex: 1 }}>
            <Text category="h1" style={{ textAlign: 'center', marginVertical: 10 }}>
                Danh sách bài hát chờ
            </Text>
            <FlatList
                data={queue}
                keyExtractor={(item) => item.videoId}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', margin: 10 }}>
                        {/* Kiểm tra nếu thumbnail tồn tại trước khi thay thế */}
                        {item.thumbnail ? (
                            <Image
                                source={{ uri: item.thumbnail.replace('default.jpg', 'mqdefault.jpg') }}
                                style={{ width: 100, height: 100, marginRight: 10 }}
                            />
                        ) : (
                            <Text>Không có hình ảnh</Text>  // Hoặc hiển thị placeholder
                        )}
                        <Text style={{ flex: 1 }}>{item.title}</Text>
                        <Button onPress={() => playMusic(item.videoId)}>Phát</Button>
                        <Button onPress={() => deleteMusic(item.videoId)} status="danger">
                            Xóa
                        </Button>
                    </View>
                )}
            />

            {/* Modal để phát video YouTube */}
            {videoId && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <Button style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            Đóng
                        </Button>
                        <WebView
                            style={styles.webView}
                            source={{ uri: `https://www.youtube.com/watch?v=${videoId}?autoplay=1` }}  // Nhúng video YouTube với autoplay
                            javaScriptEnabled={true}  // Bật JavaScript
                            domStorageEnabled={true}  // Bật DOM storage
                        />
                    </View>
                </Modal>
            )}
        </Layout>
    );
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    closeButton: {
        marginBottom: 10,
    },
    webView: {
        width: '100%',
        height: '80%',
    },
});
