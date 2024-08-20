import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, Button, ImageBackground, TextInput } from 'react-native';
import backgroundImg from './assets/fundo.jpg';

const fetchBreeds = async (callback) => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const parsed = await response.json();
    const breeds = Object.keys(parsed.message).map(breed => ({ name: breed, image: null }));
    callback(breeds);
  } catch (error) {
    console.error("Failed to fetch breeds:", error);
  }
};


const fetchBreedImage = async (breed, callback) => {
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
    const parsed = await response.json();
    callback(parsed.message);
  } catch (error) {
    console.error(`Failed to fetch image for breed ${breed}:`, error);
  }
};

export default function App() {
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState(null);

  useEffect(() => {
    fetchBreeds((breeds) => {
      setBreeds(breeds);
      setFilteredBreeds(breeds); 
    });
  }, []);

  useEffect(() => {
   
    if (searchTerm === '') {
      setFilteredBreeds(breeds);
    } else {
      setFilteredBreeds(
        breeds.filter(breed =>
          breed.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, breeds]);

  const handleFetchImage = (breed) => {
    fetchBreedImage(breed, (imageUrl) => {
      setBreeds((prevBreeds) =>
        prevBreeds.map((b) =>
          b.name === breed ? { ...b, image: imageUrl } : b
        )
      );
      setSelectedBreed(breed);
    });
  };

  return (
    <View >
      
      <View style={styles.container}>
  <StatusBar style="auto" />
      <Text style={styles.title}>Lista de Raças de Cachorros</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquise uma raça..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      </View>

      <View style={styles.hr}></View>
      
      <FlatList
        data={filteredBreeds}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.breedName}>Raça: {item.name}</Text>
            <Button title="Obter Imagem" onPress={() => handleFetchImage(item.name)} />
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
          </View>
        )}
      />
   </View>
  );
}

const styles = StyleSheet.create({

  container:{
    backgroundColor: "#99F071",
    width: '100%',
    padding: 20,
  },  

  title: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000',   
    marginVertical: 30,
    marginHorizontal: 25,
    
  },

  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop:-10,
  },

  item: {
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
  },

  breedName: {
    fontSize: 18,
   color: '#625F5F',
  },

  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
});
