import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CachedImage } from '../helpers/image';

export default function Categories({ categories, activeCategory, handleChangeCategory }) {
  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(500).springify()}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat, index) => {
          const isActive = cat.strCategory === activeCategory;
          const activeButtonStyle = isActive ? styles.activeButton : styles.inactiveButton;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleChangeCategory(cat.strCategory)}
              style={styles.categoryButton}
            >
              <View style={[styles.categoryIcon, activeButtonStyle]}>
                <CachedImage
                  uri={cat.strCategoryThumb}
                  style={styles.categoryImage}
                />
              </View>
              <Text style={styles.categoryText}>
                {cat.strCategory}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    marginRight: hp(2),
  },
  categoryIcon: {
    width: hp(8),
    height: hp(8),
    borderRadius: hp(3),
    padding: hp(1),
  },
  activeButton: {
    backgroundColor: 'lightblue',
  },
  inactiveButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: hp(3),
  },
  categoryText: {
    fontSize: hp(1.6),
    color: 'black',
    fontWeight: 'bold',
    marginTop: hp(1),
  },
});
