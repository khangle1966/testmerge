// screens/SearchScreen.js
import React, { useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import axios from 'axios';

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const searchMusic = async () => {
        try {
            const response = await axios.get('http://192.168.0.106:3000/music/search', {
                params: { q: query },
            });
            setResults(response.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const addToQueue = async (videoId, title) => {
        try {
            await axios.post('http://192.168.0.106:3000/music/add', {
                videoId,
                title,
                addedBy: 'user',
            });
            alert('Đã thêm vào danh sách chờ');
        } catch (error) {
            console.error('Lỗi khi thêm vào danh sách chờ:', error);
        }
    };

    return (
        <Layout style={{ flex: 1 }}>
            <Input
                placeholder="Tìm kiếm bài hát..."
                value={query}
                onChangeText={setQuery}
                style={{ margin: 10 }}
            />
            <Button onPress={searchMusic}>Tìm kiếm</Button>
            <FlatList
                data={results}
                keyExtractor={(item) => item.videoId}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', margin: 10 }}>
                        <Image source={{ uri: item.thumbnail }} style={{ width: 50, height: 50 }} />
                        <Text style={{ marginLeft: 10, flex: 1 }}>{item.title}</Text>
                        <Button onPress={() => addToQueue(item.videoId, item.title)}>
                            Thêm
                        </Button>
                    </View>
                )}
            />
        </Layout>
    );
}
