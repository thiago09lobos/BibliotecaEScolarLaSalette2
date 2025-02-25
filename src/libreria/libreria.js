import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Libreria = () => {
  const [newAutor, setNewAutor] = useState("");
  const [newNombreDelLibro, setNewNombreDelLibro] = useState("");
  const [newEditorial, setNewEditorial] = useState("");
  const [newLugarDeEditorial, setNewLugarDeEditorial] = useState("");
  const [newFechaDeEditorial, setNewFechaDeEditorial] = useState("");
  const [newCantidadDePaginas, setNewCantidadDePaginas] = useState("");
  const [newCodigoIsbn, setNewCodigoIsbn] = useState("");
  const [newCategoriaDelLibro, setNewCategoriaDelLibro] = useState("");
  const [newTejure, setNewTejure] = useState("");

  const [Libros, setLibros] = useState([]);
  const LibrosCollectionRef = collection(db, "Libros");

  // Función para obtener los libros desde Firestore
  useEffect(() => {
    const getLibros = async () => {
      const data = await getDocs(LibrosCollectionRef);
      setLibros(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getLibros();
  }, []);

  // Función para crear un libro
  const createLibros = async () => {
    await addDoc(LibrosCollectionRef, {
      Autor: newAutor,
      NombreDelLibro: newNombreDelLibro,
      Editorial: newEditorial,
      LugarDeEditorial: newLugarDeEditorial,
      FechaDeEditorial: Number(newFechaDeEditorial),
      CantidadDePaginas: Number(newCantidadDePaginas),
      CodigoIsbn: Number(newCodigoIsbn),
      CategoriasDelLibro: newCategoriaDelLibro,
      Tejure: Number(newTejure),
    });
  };

  // Función para eliminar un libro
  const deleteLibros = async (id) => {
    const libroDoc = doc(db, "Libros", id);
    await deleteDoc(libroDoc);
  };

  return (
    <div className="Libreria">
      {/* Encabezado */}
      <header style={styles.header}>
        <h1>Biblioteca Escolar Instituto La Salette</h1>
        <p>Descubre tu próxima lectura</p>
      </header>

      {/* Barra de búsqueda y acciones */}
      <div style={styles.container}>
        <div style={styles.searchBar}>
          <select
            onChange={(e) => setNewCategoriaDelLibro(e.target.value)}
            style={styles.input}
          >
            <option value="">Seleccionar categoría</option>
            <option value="Ficción">Ficción</option>
            <option value="No Ficción">No Ficción</option>
            <option value="Ciencia">Ciencia</option>
          </select>
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Código ISBN"
            style={styles.input}
            onChange={(e) => setNewCodigoIsbn(e.target.value)}
          />
          <button style={styles.searchButton} onClick={createLibros}>
            Agregar Libro
          </button>
        </div>

        {/* Lista de libros */}
        <div>
          {Libros.map((libro) => (
            <div key={libro.id} style={styles.bookItem}>
              <h3>{libro.NombreDelLibro}</h3>
              <p>Autor: {libro.Autor}</p>
              <p>Editorial: {libro.Editorial}</p>
              <button
                style={styles.deleteButton}
                onClick={() => deleteLibros(libro.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Estilos CSS en JS
const styles = {
  header: {
    background: "linear-gradient(90deg, #4a90e2, #aa66cc)",
    color: "white",
    padding: "20px",
    textAlign: "center",
  },
  container: {
    maxWidth: "900px",
    margin: "20px auto",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  searchBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  searchButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  bookItem: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
  },
};

export default Libreria;