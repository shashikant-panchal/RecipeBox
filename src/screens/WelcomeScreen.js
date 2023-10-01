import React, { useEffect } from 'react';
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function WelcomeScreen() {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);
  const navigation = useNavigation();

  useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;

    setTimeout(() => {
      ring1padding.value = withSpring(ring1padding.value + hp(5));
      ring2padding.value = withSpring(ring2padding.value + hp(5.5));
    }, 100);

    setTimeout(() => navigation.navigate('Home'), 2500);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Logo image with rings */}
      <Animated.View style={[styles.ring, { padding: ring2padding }]}>
        <Animated.View style={[styles.ring, { padding: ring1padding }]}>
          <Image
            source={require('../../assets/images/welcome.png')}
            style={styles.logo}
          />
        </Animated.View>
      </Animated.View>

      {/* Title and punchline */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Foody</Text>
        <Text style={styles.subtitle}>Food is always right</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue', // You may need to replace 'amber' with your actual background color.
  },
  ring: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
  },
  logo: {
    width: hp(20),
    height: hp(20),
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: hp(7),
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: hp(2),
    fontWeight: 'medium', // Check if 'medium' is a valid font weight or use 'normal'.
    color: 'white',
    letterSpacing: 1,
  },
});
