import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchAddressByCep } from '../services/viacep';

export default function AddressStepScreen({ navigation, route }) {
  const userToEdit = route.params?.userToEdit;

  const [cep, setCep] = useState(userToEdit?.cep || '');
  const [street, setStreet] = useState(userToEdit?.street || '');
  const [neighborhood, setNeighborhood] = useState(userToEdit?.neighborhood || '');
  const [city, setCity] = useState(userToEdit?.city || '');
  const [state, setState] = useState(userToEdit?.state || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cep.length === 8 && !userToEdit) {
      handleFetchAddress();
    }
  }, [cep]);

  const handleFetchAddress = async () => {
    if (cep.length < 8) return;
    setLoading(true);
    try {
      const data = await fetchAddressByCep(cep);
      setStreet(data.logradouro || '');
      setNeighborhood(data.bairro || '');
      setCity(data.localidade || '');
      setState(data.uf || '');
    } catch (error) {
      console.error("Erro no CEP:", error);
      Alert.alert('Erro', error.message || 'Não foi possível buscar o CEP. Verifique e tente novamente.');
      setStreet('');
      setNeighborhood('');
      setCity('');
      setState('');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!cep || !street || !city || !state) {
      Alert.alert('Atenção', 'Preencha pelo menos o CEP, Rua, Cidade e Estado.');
      return;
    }
    const addressData = { cep, street, neighborhood, city, state };
    navigation.navigate('PersonalInfoStep', { addressData, userToEdit });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="map-outline" size={32} color="#4A90E2" />
          <Text style={styles.title}>Onde você mora?</Text>
        </View>

        <Text style={styles.label}>CEP</Text>
        <View style={styles.cepContainer}>
          <TextInput
            style={[styles.input, styles.cepInput]}
            placeholder="00000000"
            keyboardType="numeric"
            maxLength={8}
            value={cep}
            onChangeText={setCep}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleFetchAddress}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Ionicons name="search" size={20} color="#FFF" />}
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Rua</Text>
        <TextInput style={styles.input} placeholder="Nome da rua" value={street} onChangeText={setStreet} />

        <Text style={styles.label}>Bairro</Text>
        <TextInput style={styles.input} placeholder="Nome do bairro" value={neighborhood} onChangeText={setNeighborhood} />

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput style={styles.input} placeholder="Cidade" value={city} onChangeText={setCity} />
          </View>
          <View style={styles.spacing} />
          <View style={styles.flex1}>
            <Text style={styles.label}>Estado (UF)</Text>
            <TextInput style={styles.input} placeholder="UF" maxLength={2} value={state} onChangeText={setState} autoCapitalize="characters" />
          </View>
        </View>

        <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
          <Text style={styles.btnNextText}>Próximo Passo</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F8',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9F9FB',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  cepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cepInput: {
    flex: 1,
  },
  searchBtn: {
    backgroundColor: '#4A90E2',
    height: 52,
    width: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  spacing: {
    width: 16,
  },
  btnNext: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  btnNextText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
