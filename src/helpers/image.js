import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import React from 'react';
import { Image } from 'react-native';

export const CachedImage = (props) => {
  const { uri } = props;
  const [cachedSource, setCachedSource] = useState(null);

  useEffect(() => {
    const getCachedImage = async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri);

        if (cachedImageData) {
          setCachedSource({ uri: cachedImageData });
        } else {
          const response = await fetch(uri);
          const imageBlob = await response.blob();
          const base64Data = await blobToBase64(imageBlob);
          await AsyncStorage.setItem(uri, base64Data);
          setCachedSource({ uri: base64Data });
        }
      } catch (error) {
        console.error('Error caching image:', error);
        setCachedSource({ uri });
      }
    };

    getCachedImage();
  }, [uri]);

  const blobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  return <Image source={cachedSource} {...props} />;
};
