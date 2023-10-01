import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { CachedImage } from '../helpers/image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ClockIcon, FireIcon, HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loading from '../components/loading';
import YouTubeIframe from 'react-native-youtube-iframe';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RecipeDetailScreen(props) {
  const item = props.route.params;
  const [isFavourite, setIsFavourite] = useState(false);
  const navigation = useNavigation();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMealData(item.idMeal);
  }, []);

  const getMealData = async (id) => {
    try {
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      if (response && response.data) {
        setMeal(response.data.meals[0]);
        setLoading(false);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  }

  const ingredientsIndexes = (meal) => {
    if (!meal) return [];
    let indexes = [];
    for (let i = 1; i <= 20; i++) {
      if (meal['strIngredient' + i]) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  const getYoutubeVideoId = (url) => {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.recipeImageContainer}>
        <CachedImage
          uri={item.strMealThumb}
          sharedTransitionTag={item.strMeal}
          style={styles.recipeImage}
        />
      </View>
      <Animated.View
        style={styles.buttonsContainer}
        entering={FadeInDown.delay(200).duration(1000)}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsFavourite(!isFavourite)}
          style={styles.favouriteButton}
        >
          <HeartIcon
            size={hp(3.5)}
            strokeWidth={4.5}
            color={isFavourite ? "red" : "gray"}
          />
        </TouchableOpacity>
      </Animated.View>
      {loading ? (
        <Loading size="large" style={styles.loading} />
      ) : (
        <View style={styles.recipeDetailsContainer}>
          <Animated.View
            style={styles.nameAndAreaContainer}
            entering={FadeInDown.duration(700).springify().damping(12)}
          >
            <Text style={styles.recipeName}>{meal?.strMeal}</Text>
            <Text style={styles.recipeArea}>{meal?.strArea}</Text>
          </Animated.View>
          <Animated.View
            style={styles.miscContainer}
            entering={FadeInDown.delay(100).duration(700).springify().damping(12)}
          >
            <View style={styles.miscItem}>
              <View
                style={styles.miscIconBackground}
              >
                <ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              </View>
              <View style={styles.miscItemText}>
                <Text style={styles.miscItemValue}>35</Text>
                <Text style={styles.miscItemLabel}>Mins</Text>
              </View>
            </View>
            <View style={styles.miscItem}>
              <View style={styles.miscIconBackground}>
                <UsersIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              </View>
              <View style={styles.miscItemText}>
                <Text style={styles.miscItemValue}>03</Text>
                <Text style={styles.miscItemLabel}>Servings</Text>
              </View>
            </View>
            <View style={styles.miscItem}>
              <View style={styles.miscIconBackground}>
                <FireIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              </View>
              <View style={styles.miscItemText}>
                <Text style={styles.miscItemValue}>103</Text>
                <Text style={styles.miscItemLabel}>Cal</Text>
              </View>
            </View>
            <View style={styles.miscItem}>
              <View style={styles.miscIconBackground}>
                <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              </View>
              <View style={styles.miscItemText}>
                <Text style={styles.miscItemLabel}>Easy</Text>
              </View>
            </View>
          </Animated.View>
          <Animated.View
            style={styles.ingredientsContainer}
            entering={FadeInDown.delay(200).duration(700).springify().damping(12)}
          >
            <Text style={styles.ingredientsLabel}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {ingredientsIndexes(meal).map((i) => (
                <View key={i} style={styles.ingredientItem}>
                  <View style={styles.ingredientBullet} />
                  <View style={styles.ingredientText}>
                    <Text style={styles.ingredientMeasure}>
                      {meal['strMeasure' + i]}
                    </Text>
                    <Text style={styles.ingredientName}>
                      {meal['strIngredient' + i]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
          <Animated.View
            style={styles.instructionsContainer}
            entering={FadeInDown.delay(300).duration(700).springify().damping(12)}
          >
            <Text style={styles.instructionsLabel}>Instructions</Text>
            <Text style={styles.instructionsText}>
              {meal?.strInstructions}
            </Text>
          </Animated.View>
          {meal.strYoutube && (
            <Animated.View
              style={styles.videoContainer}
              entering={FadeInDown.delay(400).duration(700).springify().damping(12)}
            >
              <Text style={styles.videoLabel}>Recipe Video</Text>
              <View style={styles.youtubePlayer}>
                <YouTubeIframe
                  videoId={getYoutubeVideoId(meal.strYoutube)}
                  height={hp(30)}
                />
              </View>
            </Animated.View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  recipeImageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  recipeImage: {
    width: wp(98),
    height: hp(50),
    borderRadius: 53,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginTop: 4,
  },
  buttonsContainer: {
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
  },
  backButton: {
    padding: 12,
    borderRadius: 50,
    marginLeft: 16,
    backgroundColor: 'white',
  },
  favouriteButton: {
    padding: 12,
    borderRadius: 50,
    marginRight: 16,
    backgroundColor: 'white',
  },
  loading: {
    marginTop: 16,
  },
  recipeDetailsContainer: {
    paddingHorizontal: 16,
  },
  nameAndAreaContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  recipeName: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: '#333',
  },
  recipeArea: {
    fontSize: hp(2),
    fontWeight: '500',
    color: '#777',
  },
  miscContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  miscItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderRadius: 50,
    padding: 8,
    flex: 1,
  },
  miscIconBackground: {
    height: hp(6.5),
    width: hp(6.5),
    backgroundColor: 'white',
    borderRadius: hp(6.5) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miscItemText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  miscItemValue: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#333',
  },
  miscItemLabel: {
    fontSize: hp(1.3),
    fontWeight: 'bold',
    color: '#333',
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientsLabel: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: '#333',
  },
  ingredientsList: {
    marginLeft: 16,
    marginTop: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientBullet: {
    width: hp(1.5),
    height: hp(1.5),
    backgroundColor: '#FFC107',
    borderRadius: hp(1.5) / 2,
    marginRight: 8,
  },
  ingredientText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientMeasure: {
    fontSize: hp(1.7),
    fontWeight: 'bold',
    color: '#333',
  },
  ingredientName: {
    fontSize: hp(1.7),
    fontWeight: '500',
    color: '#777',
  },
  instructionsContainer: {},
  instructionsLabel: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: '#333',
  },
  instructionsText: {
    fontSize: hp(1.6),
    color: '#777',
    marginTop: 8,
  },
  videoContainer: {
    marginBottom: 16,
  },
  videoLabel: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: '#333',
  },
  youtubePlayer: {
    height: hp(30),
  },
});
