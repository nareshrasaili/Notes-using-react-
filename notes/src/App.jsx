import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const STORAGE_KEY = "modern_notes_v1";

function formatDate(ts) {
  return new Date(ts).toLocaleString();
}

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeId, setActiveId] = useState(notes[0]?.id || null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeId);

  function createNote() {
    const newNote = {
      id: uuidv4(),
      title: "Untitled Note",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveId(newNote.id);
  }

  function updateNote(field, value) {
    setNotes(
      notes.map((note) =>
        note.id === activeId
          ? { ...note, [field]: value, updatedAt: Date.now() }
          : note
      )
    );
  }

  function deleteNote(id) {
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    if (id === activeId) {
      setActiveId(filtered.length ? filtered[0].id : null);
    }
  }

  const filteredNotes = notes.filter((note) => {
    const q = search.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="header">
        <h1>Notes</h1>
        <div className="header-actions">
          <button onClick={createNote} className="primary-btn">
            + New Note
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="secondary-btn"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <div className="notes-list">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={note.id === activeId ? "note-item active" : "note-item"}
                onClick={() => setActiveId(note.id)}
              >
                <div className="note-title">{note.title}</div>
                <div className="note-date">{formatDate(note.updatedAt)}</div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </aside>

        <main className="editor">
          {activeNote ? (
            <div className="editor-left">
              <input
                className="title-input"
                value={activeNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
              />
              <textarea
                className="content-input"
                value={activeNote.content}
                onChange={(e) => updateNote("content", e.target.value)}
              />
            </div>
          ) : (
            <div className="empty-state">No note selected</div>
          )}
        </main>
      </div>
    </div>
  );
}
