import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, books }) {
  return (
    <View style={styles.container}>
      <Button
        title="Adicionar Livro"
        onPress={() => navigation.navigate("Adicionar")}
      />

      {books.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Nenhum livro cadastrado.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("Detalhes", { book: item })}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.status}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function AddBookScreen({ navigation, books, setBooks }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const addBook = () => {
    if (!title.trim()) {
      Alert.alert("Validação", "O título é obrigatório!");
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      status: "Quero ler",
    };

    setBooks([newBook, ...books]);
    Alert.alert("Sucesso", "Livro adicionado com sucesso!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Título *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título"
      />
      <Text>Autor</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Digite o autor"
      />
      <Button title="Salvar" onPress={addBook} />
    </View>
  );
}

function DetailScreen({ route, navigation, books, setBooks }) {
  const [currentBook, setCurrentBook] = useState(route.params.book);

  const updateStatus = (status) => {
    if (currentBook.status === status) {
      Alert.alert("Informação", `O livro já está com o status "${status}".`);
      return;
    }

    setBooks((prev) =>
      prev.map((b) => (b.id === currentBook.id ? { ...b, status } : b))
    );

    setCurrentBook((prev) => ({ ...prev, status }));

    Alert.alert("Sucesso", `Status atualizado para "${status}"!`);
  };

  const removeBook = () => {
    Alert.alert("Remover livro", "Deseja realmente excluir este livro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          setBooks((prev) => prev.filter((b) => b.id !== currentBook.id));
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentBook.title}</Text>
      <Text>{currentBook.author || "Autor não informado"}</Text>
      <Text style={{ marginVertical: 8 }}>Status: {currentBook.status}</Text>

      <Button title="Marcar como Lendo" onPress={() => updateStatus("Lendo")} />
      <View style={{ height: 8 }} />
      <Button title="Marcar como Lido" onPress={() => updateStatus("Lido")} />
      <View style={{ height: 8 }} />
      <Button title="Excluir livro" color="red" onPress={removeBook} />
    </View>
  );
}

export default function App() {
  const [books, setBooks] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ title: "Meus Livros" }}
        >
          {(props) => <HomeScreen {...props} books={books} />}
        </Stack.Screen>

        <Stack.Screen
          name="Adicionar"
          options={{ title: "Adicionar Livro" }}
        >
          {(props) => (
            <AddBookScreen {...props} books={books} setBooks={setBooks} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Detalhes"
          options={{ title: "Detalhes do Livro" }}
        >
          {(props) => (
            <DetailScreen {...props} books={books} setBooks={setBooks} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 6,
  },
  item: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  title: { fontSize: 16, fontWeight: "600" },
});
