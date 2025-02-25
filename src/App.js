import { useState, useEffect } from "react";
import { db } from "./firebase-Config";
import { collection, getDocs, addDoc, query, where, deleteDoc, doc } from "firebase/firestore";

const Libreria = () => {
  const [newAutor, setNewAutor] = useState("");
  const [newNombreDelLibro, setNewNombreDelLibro] = useState("");
  const [newEditorial, setNewEditorial] = useState("");
  const [newLugarDeEditorial, setNewLugarDeEditorial] = useState("");
  const [newFechaDeEditorial, setNewFechaDeEditorial] = useState("");
  const [newCantidadDePaginas, setNewCantidadDePaginas] = useState("");
  const [newCodigoIsbn, setNewCodigoIsbn] = useState("");
  const [newTejure, setNewTejure] = useState("");
  const [newCategoriaDelLibro, setNewCategoriaDelLibro] = useState("");
  const [Libros, setLibros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isbnToDelete, setIsbnToDelete] = useState(""); // Estado para almacenar el ISBN a eliminar
  const LibrosCollectionRef = collection(db, "Libros");

  // Cargar los libros desde Firestore
  useEffect(() => {
    const getLibros = async () => {
      const data = await getDocs(LibrosCollectionRef);
      setLibros(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getLibros();
  }, []);

  // Función para agregar un libro
  const createLibro = async () => {
    await addDoc(LibrosCollectionRef, {
      Autor: newAutor,
      NombreDelLibro: newNombreDelLibro,
      Editorial: newEditorial,
      LugarDeEditorial: newLugarDeEditorial,
      FechaDeEditorial: newFechaDeEditorial,
      CantidadDePaginas: newCantidadDePaginas,
      CodigoIsbn: newCodigoIsbn,
      Tejure: newTejure,
      CategoriaDelLibro: newCategoriaDelLibro,
    });
    alert("¡Libro agregado con éxito!");
    setShowForm(false); // Ocultar formulario después de agregar
    clearForm(); // Limpiar campos
  };

  // Limpiar los campos del formulario
  const clearForm = () => {
    setNewAutor("");
    setNewNombreDelLibro("");
    setNewEditorial("");
    setNewLugarDeEditorial("");
    setNewFechaDeEditorial("");
    setNewCantidadDePaginas("");
    setNewCodigoIsbn("");
    setNewTejure("");
    setNewCategoriaDelLibro("");
  };

  // Función para filtrar libros según el término de búsqueda
  const filterBooks = (books, term) => {
    if (!term) return books; // Si no hay término de búsqueda, devuelve todos los libros

    // Filtra por cualquier campo relevante (nombre, autor, categoría, ISBN)
    return books.filter((book) => {
      return (
        (book.NombreDelLibro && book.NombreDelLibro.toLowerCase().includes(term.toLowerCase())) ||
        (book.Autor && book.Autor.toLowerCase().includes(term.toLowerCase())) ||
        (book.CategoriaDelLibro && book.CategoriaDelLibro.toLowerCase().includes(term.toLowerCase())) ||
        (book.CodigoIsbn && book.CodigoIsbn.toLowerCase().includes(term.toLowerCase()))
      );
    });
  };

  // Función para eliminar un libro por ISBN
  const deleteLibro = async () => {
    const q = query(LibrosCollectionRef, where("CodigoIsbn", "==", isbnToDelete));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref); // Eliminar el libro
        alert("¡Libro eliminado con éxito!");
      });
    } else {
      alert("No se encontró un libro con ese código ISBN.");
    }

    setIsbnToDelete(""); // Limpiar el campo ISBN después de la operación
  };

  // Lista de categorías
  const categories = [
    "informatica", "cultura", "comunicaciones", "periodismo", "psicologia",
    "logica", "psicoanalisis", "filosofia", "economia", "sociologia",
    "religion", "religión biblia", "derecho", "microeconomia", "macroeconomia",
    "literatura infantil", "literatura juvenil"
  ];

  return (
    <div className="Libreria">
      {/* Encabezado */}
      <header style={styles.header}>
        <h1>Biblioteca Escolar Instituto La Salette</h1>
        <p>Descubre tu próxima lectura</p>
      </header>

      {/* Barra de búsqueda */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar nombre del libro, autor o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button style={styles.searchButton}>
          Buscar
        </button>
      </div>

      {/* Contenedor principal */}
      <div style={styles.container}>
        <div style={styles.actions}>
          <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Agregar Libro"}
          </button>
          <button
            style={styles.addButton}
            onClick={() => setShowCategories(!showCategories)}
          >
            {showCategories ? "Ocultar Categorías" : "Ver Categorías"}
          </button>
        </div>

        {/* Formulario para agregar libro */}
        {showForm && (
          <div style={styles.form}>
            <label style={styles.label}>Autor:</label>
            <input
              type="text"
              value={newAutor}
              onChange={(e) => setNewAutor(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Nombre del Libro:</label>
            <input
              type="text"
              value={newNombreDelLibro}
              onChange={(e) => setNewNombreDelLibro(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Editorial:</label>
            <input
              type="text"
              value={newEditorial}
              onChange={(e) => setNewEditorial(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Lugar de Editorial:</label>
            <input
              type="text"
              value={newLugarDeEditorial}
              onChange={(e) => setNewLugarDeEditorial(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Fecha de Editorial:</label>
            <input
              type="date"
              value={newFechaDeEditorial}
              onChange={(e) => setNewFechaDeEditorial(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Cantidad de Páginas:</label>
            <input
              type="number"
              value={newCantidadDePaginas}
              onChange={(e) => setNewCantidadDePaginas(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Código ISBN:</label>
            <input
              type="text"
              value={newCodigoIsbn}
              onChange={(e) => setNewCodigoIsbn(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Tejure:</label>
            <input
              type="text"
              value={newTejure}
              onChange={(e) => setNewTejure(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Categoría del Libro:</label>
            <select
              value={newCategoriaDelLibro}
              onChange={(e) => setNewCategoriaDelLibro(e.target.value)}
              style={styles.input}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button type="button" onClick={createLibro} style={styles.saveButton}>
              Guardar Libro
            </button>
          </div>
        )}

        {/* Botón para eliminar libro */}
        <div>
          <label>Eliminar libro por ISBN:</label>
          <input
            type="text"
            value={isbnToDelete}
            onChange={(e) => setIsbnToDelete(e.target.value)}
            placeholder="Ingresa ISBN del libro a eliminar"
            style={styles.input}
          />
          <button onClick={deleteLibro} style={styles.deleteButton}>
            Eliminar Libro
          </button>
        </div>

        {/* Lista de categorías */}
        {showCategories && (
          <div>
            <ul style={styles.categoriesList}>
              {categories.map((category, index) => (
                <li key={index} style={styles.categoryItem}>
                  {category}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mostrar libros */}
        <div style={styles.booksList}>
  {filterBooks(Libros, searchTerm).map((libro) => (
    <div key={libro.id} style={styles.bookItem}>
      <h3>{libro.NombreDelLibro}</h3>
      <p><strong>Autor:</strong> {libro.Autor}</p>
      <p><strong>Código ISBN:</strong> {libro.CodigoIsbn}</p>
      <p><strong>Categoría:</strong> {libro.CategoriaDelLibro}</p>
      <p><strong>Editorial:</strong> {libro.Editorial}</p>
      <p><strong>Lugar de Editorial:</strong> {libro.LugarDeEditorial}</p>
      <p><strong>Fecha de Editorial:</strong> {libro.FechaDeEditorial}</p>
      <p><strong>Cantidad de Páginas:</strong> {libro.CantidadDePaginas}</p>
      <p><strong>Tejure:</strong> {libro.Tejure}</p>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

const styles = {
  header: {
    textAlign: "center",
    backgroundColor: "#d2e5d8",
    padding: "20px",
    borderRadius: "5px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0",
  },
  searchInput: {
    padding: "10px",
    width: "60%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  searchButton: {
    padding: "10px",
    marginLeft: "10px",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "white",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    borderRadius: "5px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "16px",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
  },
  categoriesList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  categoryItem: {
    backgroundColor: "#f9f9f9",
    padding: "10px",
    marginBottom: "5px",
    borderRadius: "5px",
  },
  booksList: {
    marginTop: "20px",
  },
  bookItem: {
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

export default Libreria;
