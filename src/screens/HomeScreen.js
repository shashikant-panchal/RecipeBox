import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StatusBar,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import {
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('Beef');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    getCategories();
    getRecipes();
  }, []);

  const handleChangeCategory = (category) => {
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        'https://themealdb.com/api/json/v1/1/categories.php'
      );
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  };

  const getRecipes = async (category = 'Beef') => {
    try {
      const response = await axios.get(
        `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.greetingsContainer}>
          <Text style={styles.punchlineText}>Prepare your own Food</Text>
          <Text style={styles.punchlineText}>
            stay at{' '}
            <Text style={styles.amberText}>home</Text>
          </Text>
        </View>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder="Search any recipe"
              placeholderTextColor="gray"
              style={styles.searchInput}
            />
          </View>
          <View style={styles.searchIconContainer}>
            <MagnifyingGlassIcon
              size={hp(2.5)}
              strokeWidth={3}
              color="gray"
            />
          </View>
        </View>
        <View style={styles.categoriesContainer}>
          {categories.length > 0 && (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>
        <View style={styles.recipesContainer}>
          <Recipes meals={meals} categories={categories} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F1F3',
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  avatarImage: {
    height: hp(5),
    width: hp(5.5),
  },
  greetingsContainer: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  greetingsText: {
    fontSize: hp(1.7),
    color: 'black',
  },
  punchlineText: {
    fontSize: hp(3.5),
    fontWeight: 'bold',
    color: 'black',
    letterSpacing: 1,
  },
  amberText: {
    color: 'skyblue',
  },
  searchBarContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 999,
    padding: 6,
  },
  searchInputContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  searchInput: {
    fontSize: hp(1.7),
  },
  searchIconContainer: {
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 10,
  },
  categoriesContainer: {
    marginTop: 10
  },
  recipesContainer: {
    flex: 1
  },
});
