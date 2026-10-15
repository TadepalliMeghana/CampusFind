
import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/items';

const createEmptyForm = () => ({
    type: 'lost',
    title: '',
    category: '',
    location: '',
    description: '',
    item_date: new Date().toISOString().slice(0, 10)
});

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(createEmptyForm);

    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    // Load listings from the backend
    async function fetchItems() {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Unable to load listings.');
            }

            const data = await response.json();

            setItems(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            console.error('Error loading listings:', err);
            setError(
                'Could not load listings. Make sure the backend and MySQL are running.'
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    // Update form fields
    function handleChange(event) {
        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    }

    // Submit a new listing
    async function handleSubmit(event) {
        event.preventDefault();
        setMessage('');
        setSubmitting(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Unable to add the listing.'
                );
            }

            setMessage('Listing added successfully!');
            setForm(createEmptyForm());
            setShowForm(false);

            await fetchItems();
        } catch (err) {
            console.error('Error adding listing:', err);
            setMessage(
                err.message || 'Unable to add listing. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    }

    // Format dates without timezone shifting
    function formatDate(date) {
        if (!date) return 'Not specified';

        const parts = String(date).slice(0, 10).split('-');

        if (parts.length === 3) {
            return parts[2] + '/' + parts[1] + '/' + parts[0];
        }

        return String(date);
    }

    // Normalize values in case the database uses different capitalization
    function getType(item) {
        return String(item.type || item.item_type || 'lost').toLowerCase();
    }

    function getItemDate(item) {
        return item.item_date || item.date_reported || item.created_at || '';
    }

    // Filter and search listings
    const filteredItems = items.filter(item => {
        const type = getType(item);
        const category = String(item.category || '');

        const searchText = [
            item.title,
            item.category,
            item.location,
            item.description
        ].join(' ').toLowerCase();

        const matchesSearch = searchText.includes(search.toLowerCase());
        const matchesType =
            filterType === 'all' || type === filterType;
        const matchesCategory =
            filterCategory === 'all' || category === filterCategory;

        return matchesSearch && matchesType && matchesCategory;
    });

    const categories = [
        ...new Set(items.map(item => item.category).filter(Boolean))
    ];

    function handleCardKeyDown(event, item) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelectedItem(item);
        }
    }

    return (
        <div className="app">
            <nav className="navbar">
                <a
                    className="brand"
                    href="#home"
                    onClick={() => {
                        setShowForm(false);
                        setSelectedItem(null);
                    }}
                >
                    <span className="brand-icon">C</span>
                    CampusFind
                </a>

                <div className="nav-links">
                    <a href="#listings">Browse Items</a>
                    <button
                        className="nav-button"
                        onClick={() => {
                            setShowForm(true);
                            setSelectedItem(null);
                            setMessage('');
                        }}
                    >
                        + Report an Item
                    </button>
                </div>
            </nav>

            <main>
                <section className="hero" id="home">
                    <div className="hero-content">
                        <span className="eyebrow">
                            YOUR CAMPUS, CONNECTED
                        </span>

                        <h1>
                            Lost something?
                            <br />
                            <span>Let's find it.</span>
                        </h1>

                        <p>
                            A simple place for our campus community to report
                            lost belongings and reunite people with their
                            missing items.
                        </p>

                        <div className="hero-actions">
                            <a className="primary-button" href="#listings">
                                Browse Listings →
                            </a>

                            <button
                                className="secondary-button"
                                onClick={() => {
                                    setShowForm(true);
                                    setMessage('');
                                }}
                            >
                                Report an Item
                            </button>
                        </div>
                    </div>

                    <div className="hero-illustration" aria-hidden="true">
                        <div className="illustration-circle">
                            <span className="illustration-search">⌕</span>
                            <span className="illustration-card card-one">ID</span>
                            <span className="illustration-card card-two">✦</span>
                            <span className="illustration-card card-three">✓</span>
                        </div>
                        <div className="floating-note">
                            <span>✦</span>
                            Small things, found again.
                        </div>
                    </div>
                </section>

                <section className="stats">
                    <div className="stat">
                        <span className="stat-number">{items.length}</span>
                        <span className="stat-label">Total Listings</span>
                    </div>

                    <div className="stat">
                        <span className="stat-number">
                            {items.filter(item => getType(item) === 'lost').length}
                        </span>
                        <span className="stat-label">Items Lost</span>
                    </div>

                    <div className="stat">
                        <span className="stat-number">
                            {items.filter(item => getType(item) === 'found').length}
                        </span>
                        <span className="stat-label">Items Found</span>
                    </div>
                </section>

                {showForm && (
                    <section className="form-section" id="report-form">
                        <div className="section-heading">
                            <div>
                                <span className="eyebrow">MAKE A REPORT</span>
                                <h2>Report an item</h2>
                                <p>
                                    Share a few details to help someone find
                                    their belongings.
                                </p>
                            </div>

                            <button
                                className="close-button"
                                aria-label="Close form"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form className="listing-form" onSubmit={handleSubmit}>
                            <label>
                                Item status
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="lost">I lost something</option>
                                    <option value="found">I found something</option>
                                </select>
                            </label>

                            <label>
                                Item name
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Black wallet"
                                    required
                                    maxLength={150}
                                />
                            </label>

                            <label>
                                Category
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Choose a category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="ID Cards">ID Cards</option>
                                    <option value="Bags & Wallets">Bags & Wallets</option>
                                    <option value="Books & Notes">Books & Notes</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Other">Other</option>
                                </select>
                            </label>

                            <label>
                                Location
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Central Library"
                                    required
                                    maxLength={200}
                                />
                            </label>

                            <label>
                                Date
                                <input
                                    type="date"
                                    name="item_date"
                                    value={form.item_date}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="full-width">
                                Description
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Add identifying details, colour, brand, or other useful information..."
                                    rows={4}
                                    maxLength={2000}
                                />
                            </label>

                            <div className="form-actions full-width">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>

                            {message && (
                                <p className="form-message full-width" role="status">
                                    {message}
                                </p>
                            )}
                        </form>
                    </section>
                )}

                <section className="listings-section" id="listings">
                    <div className="section-heading">
                        <div>
                            <span className="eyebrow">COMMUNITY LISTINGS</span>
                            <h2>Recently reported items</h2>
                            <p>
                                Browse reports from your campus community.
                            </p>
                        </div>

                        <button
                            className="primary-button"
                            onClick={() => {
                                setShowForm(true);
                                setMessage('');
                            }}
                        >
                            + Add Listing
                        </button>
                    </div>

                    <div className="filters">
                        <div className="search-box">
                            <span aria-hidden="true">⌕</span>
                            <input
                                type="search"
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="Search items, categories, locations..."
                                aria-label="Search listings"
                            />
                        </div>

                        <select
                            value={filterType}
                            onChange={event => setFilterType(event.target.value)}
                            aria-label="Filter by status"
                        >
                            <option value="all">All statuses</option>
                            <option value="lost">Lost</option>
                            <option value="found">Found</option>
                        </select>

                        <select
                            value={filterCategory}
                            onChange={event => setFilterCategory(event.target.value)}
                            aria-label="Filter by category"
                        >
                            <option value="all">All categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="error-message" role="alert">
                            <p>{error}</p>
                            <button
                                className="secondary-button"
                                onClick={() => {
                                    setLoading(true);
                                    fetchItems();
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="empty-state">
                            <span className="empty-icon">⌛</span>
                            <h3>Loading listings...</h3>
                            <p>Please wait while we fetch the latest reports.</p>
                        </div>
                    ) : !error && filteredItems.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">⌕</span>
                            <h3>No items found</h3>
                            <p>
                                Try another search, or report an item to get
                                started.
                            </p>
                            <button
                                className="primary-button"
                                onClick={() => {
                                    setShowForm(true);
                                    setMessage('');
                                }}
                            >
                                Report an Item
                            </button>
                        </div>
                    ) : (
                        <div className="items-grid">
                            {filteredItems.map((item, index) => {
                                const type = getType(item);

                                return (
                                    <article
                                        className="item-card"
                                        key={item.id ?? item.item_id ?? `${item.title}-${index}`}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setSelectedItem(item)}
                                        onKeyDown={event =>
                                            handleCardKeyDown(event, item)
                                        }
                                    >
                                        <div className={`item-card-top ${type}`}>
                                            <span className={`status-badge ${type}`}>
                                                {type === 'found' ? 'Found' : 'Lost'}
                                            </span>
                                            <span className="item-symbol" aria-hidden="true">
                                                {String(item.category || '').toLowerCase().includes('id')
                                                    ? '▤'
                                                    : String(item.category || '').toLowerCase().includes('electronic')
                                                    ? '⌁'
                                                    : String(item.category || '').toLowerCase().includes('bag')
                                                    ? '▣'
                                                    : '✦'}
                                            </span>
                                        </div>

                                        <div className="item-card-body">
                                            <span className="item-category">
                                                {item.category || 'Other'}
                                            </span>

                                            <h3>{item.title || 'Untitled item'}</h3>

                                            <p className="item-description">
                                                {item.description ||
                                                    'No description provided.'}
                                            </p>

                                            <div className="item-meta">
                                                <span>
                                                    <span aria-hidden="true">⌖</span>
                                                    {item.location || 'Location not specified'}
                                                </span>

                                                <span>
                                                    <span aria-hidden="true">◷</span>
                                                    {formatDate(getItemDate(item))}
                                                </span>
                                            </div>

                                            <button
                                                className="details-link"
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    setSelectedItem(item);
                                                }}
                                            >
                                                View Details →
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="bottom-cta">
                    <div>
                        <span className="eyebrow">HELP YOUR COMMUNITY</span>
                        <h2>Found something that isn't yours?</h2>
                        <p>
                            A quick report could help someone get an important
                            belonging back.
                        </p>
                    </div>

                    <button
                        className="primary-button"
                        onClick={() => {
                            setForm({
                                ...createEmptyForm(),
                                type: 'found'
                            });
                            setShowForm(true);
                            setMessage('');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        Report a Found Item →
                    </button>
                </section>
            </main>

            <footer className="footer">
                <a className="brand" href="#home">
                    <span className="brand-icon">C</span>
                    CampusFind
                </a>
                <p>Helping campus belongings find their way home.</p>
                <span>CampusFind © {new Date().getFullYear()}</span>
            </footer>

            {selectedItem && (
                <div
                    className="modal-backdrop"
                    role="presentation"
                    onClick={() => setSelectedItem(null)}
                >
                    <section
                        className="item-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        onClick={event => event.stopPropagation()}
                    >
                        <button
                            className="close-button modal-close"
                            aria-label="Close details"
                            onClick={() => setSelectedItem(null)}
                        >
                            ×
                        </button>

                        <div className={`modal-banner ${getType(selectedItem)}`}>
                            <span className={`status-badge ${getType(selectedItem)}`}>
                                {getType(selectedItem) === 'found' ? 'Found item' : 'Lost item'}
                            </span>
                            <span className="modal-symbol" aria-hidden="true">✦</span>
                        </div>

                        <div className="modal-content">
                            <span className="item-category">
                                {selectedItem.category || 'Other'}
                            </span>

                            <h2 id="modal-title">
                                {selectedItem.title || 'Untitled item'}
                            </h2>

                            <p className="modal-description">
                                {selectedItem.description ||
                                    'No additional description was provided.'}
                            </p>

                            <div className="detail-row">
                                <span>Report type</span>
                                <strong>
                                    {getType(selectedItem) === 'found' ? 'Found' : 'Lost'}
                                </strong>
                            </div>

                            <div className="detail-row">
                                <span>Category</span>
                                <strong>{selectedItem.category || 'Other'}</strong>
                            </div>

                            <div className="detail-row">
                                <span>Location</span>
                                <strong>
                                    {selectedItem.location || 'Not specified'}
                                </strong>
                            </div>

                            <div className="detail-row">
                                <span>Date</span>
                                <strong>
                                    {formatDate(getItemDate(selectedItem))}
                                </strong>
                            </div>

                            <button
                                className="primary-button modal-done"
                                onClick={() => setSelectedItem(null)}
                            >
                                Close Details
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default App;
