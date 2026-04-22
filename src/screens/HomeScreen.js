import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUsers, deleteUser, deleteAllUsers } from '../database/userRepository';

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert('Excluir Registro', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          await deleteUser(id);
          loadUsers();
        } 
      }
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Atenção!', 'Isso apagará TODOS os registros. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar Tudo', style: 'destructive', onPress: async () => {
          await deleteAllUsers();
          loadUsers();
        } 
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => navigation.navigate('AddressStep', { userToEdit: item })} style={styles.actionBtn}>
            <Ionicons name="pencil" size={20} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <Ionicons name="trash" size={20} color="#E24A4A" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.info}><Ionicons name="call-outline" size={14}/> {item.phone}</Text>
        <Text style={styles.info}><Ionicons name="mail-outline" size={14}/> {item.email}</Text>
        <Text style={styles.info}><Ionicons name="location-outline" size={14}/> {item.city} - {item.state}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum usuário cadastrado.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.fabContainer}>
        {users.length > 0 && (
          <TouchableOpacity style={[styles.fab, styles.fabClear]} onPress={handleClearAll}>
            <Ionicons name="trash-bin" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddressStep')}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F8',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginLeft: 15,
    padding: 5,
  },
  cardBody: {
    gap: 4,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    backgroundColor: '#4A90E2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginLeft: 15,
  },
  fabClear: {
    backgroundColor: '#E24A4A',
    width: 50,
    height: 50,
    borderRadius: 25,
  }
});
