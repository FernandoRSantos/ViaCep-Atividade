import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { insertUser, updateUser } from '../database/userRepository';

export default function PersonalInfoStepScreen({ navigation, route }) {
  const { addressData, userToEdit } = route.params;

  const [name, setName] = useState(userToEdit?.name || '');
  const [email, setEmail] = useState(userToEdit?.email || '');
  const [phone, setPhone] = useState(userToEdit?.phone || '');

  const handleSave = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Atenção', 'Preencha todos os dados pessoais.');
      return;
    }

    const userData = {
      name,
      email,
      phone,
      ...addressData
    };

    try {
      if (userToEdit) {
        await updateUser(userToEdit.id, userData);
        Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      } else {
        await insertUser(userData);
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      }
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um problema ao salvar os dados.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="person-outline" size={32} color="#4A90E2" />
          <Text style={styles.title}>Quase lá!</Text>
        </View>

        <Text style={styles.subtitle}>Agora, preencha seus dados de contato.</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
          <Text style={styles.btnSaveText}>Salvar Dados</Text>
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
    marginBottom: 8,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
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
  btnSave: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  btnSaveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
