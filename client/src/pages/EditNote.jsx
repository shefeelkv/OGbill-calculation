import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import api from '../api';

const EditNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchNoteDetails();
    }, [id]);

    useEffect(() => {
        const newTotal = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
        setTotal(newTotal);
    }, [items]);

    const fetchNoteDetails = async () => {
        try {
            const res = await api.get('/notes'); // Assuming we get all notes and filter, or we need a get single endpoint
            // Wait, I didn't verify if GET /notes/:id exists. checking notes.js
            // It DOES NOT exist in my previous implementation of notes.js.
            // I need to add GET /notes/:id to backend first!
            // For now let's implement the frontend assuming it will exist or I'll fix it.
            // Actually, dashboard fetches all notes. I can filter from that state if I had it, but clean way is GET endpoint.
            // I will add GET /notes/:id to backend in next step.

            const allNotes = await api.get('/notes');
            const note = allNotes.data.find(n => n.id === parseInt(id));

            if (note) {
                setTitle(note.title);
                // Notes table doesn't have items in the list view usually?
                // My notes.js GET / returns * from notes.
                // Note items are in note_items table.
                // I definitely need a GET /notes/:id endpoint that returns items too.
                // Wait, let me check notes.js again.

            }
            // Re-reading notes.js content from previous turns...
            // It has GET / (all notes), DELETE /:id.
            // It DOES NOT have GET /:id.

            // I will implement this fetch to use a new endpoint I'll Create.
            const detailRes = await api.get(`/notes/${id}`);
            setTitle(detailRes.data.title);
            setItems(detailRes.data.items);
            setLoading(false);

        } catch (err) {
            console.error(err);
            alert('Failed to fetch note details');
            navigate('/dashboard');
        }
    };

    const addItem = () => {
        setItems([...items, { item_name: '', price: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const updateNote = async () => {
        if (!title) return alert('Please enter note title');
        try {
            await api.put(`/notes/${id}`, { title, items });
            alert('Note updated successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to update note');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading note details...</div>;

    return (
        <div className="card max-w-2xl mx-auto bg-yellow-50 border-yellow-200">
            <div className="flex justify-between items-center mb-6 border-b border-yellow-200 pb-4">
                <div className="flex items-center gap-3 w-full">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-yellow-100 rounded-full transition-colors shrink-0">
                        <ArrowLeft size={20} className="text-yellow-700" />
                    </button>
                    <input
                        type="text"
                        className="text-2xl font-bold bg-transparent border-none placeholder-yellow-600/50 text-slate-800 w-full focus:ring-0"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled Note..."
                    />
                </div>
                <button onClick={updateNote} className="btn bg-yellow-500 hover:bg-yellow-600 text-white shrink-0 ml-4">
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="space-y-2 mb-6">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center group">
                        <div className="w-8 flex justify-center text-slate-400 text-sm">{index + 1}.</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-b border-yellow-200 focus:border-yellow-500 p-2"
                            value={item.item_name}
                            onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                            placeholder="Item details..."
                        />
                        <div className="w-32 relative">
                            <span className="absolute left-2 top-2 text-slate-400">$</span>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-transparent border-b border-yellow-200 focus:border-yellow-500 p-2 pl-6"
                                value={item.price}
                                onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <button onClick={() => removeItem(index)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-yellow-200">
                <button onClick={addItem} className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1">
                    <Plus size={18} /> Add Line
                </button>
                <div className="text-right">
                    <p className="text-sm text-yellow-700 font-medium">Total Estimate</p>
                    <p className="text-2xl font-bold text-slate-800">${total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default EditNote;
