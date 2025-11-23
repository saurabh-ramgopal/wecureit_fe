import React, { useState } from 'react';
import './MyProfile.scss';

const MyProfile: React.FC = () => {
    const [myProfileData, setMyProfileData] = useState({
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        address: '123 Main St, Springfield, USA',
        dateOfBirth: 'June 14, 1985',
        gender: 'Male',
        ccNumber: '1234123412341234',
        ccExpiry: '12/25',
        cvv: '123',
    });

    const [editing, setEditing] = useState<{ field: 'email' | 'phone' | null, value: string | null }>({ field: null, value: null });
    const [card, setCard] = useState({
        ccNumber: '',
        ccExpiry: '',
        cvv: '',
    });
    const [cardEditing, setCardEditing] = useState(false);

    const maskCard = (num: string) => {
        const cleaned = String(num).replace(/\D/g, '');
        if (!cleaned) return '';
        return '**** **** **** ' + cleaned.slice(-4);
    };

    return (
        <section className="myprofile-card">

            {/* Personal Information Section */}
            <div className="myprofile-card__header">
                <div className="myprofile-card__icon">👤</div>
                <div>
                    <h3 className="myprofile-card__title">Personal Information</h3>
                    <p className="myprofile-card__subtitle">Your basic details</p>
                </div>
            </div>

            <div className="myprofile-card__body">
                <div className="grid-row">
                    <div className="field field--full">
                        <label>Full Name</label>
                        <div className="value">{myProfileData.name}</div>
                    </div>
                </div>

                <div className="grid-row">
                    <div className="field">
                        <label>Date of Birth</label>
                        <div className="value">{myProfileData.dateOfBirth}</div>
                    </div>
                    <div className="field">
                        <label>Sex</label>
                        <div className="value">{myProfileData.gender}</div>
                    </div>
                </div>
                    {/* Editable Email and Phone Section */}
                                <div className="grid-row">
                                        <div className="field">
                                                <label>Email Address</label>
                                                <div className="value-row">
                                                    {editing.field === 'email' ? (
                                                        <>
                                                            <input className="value-input" value={String(editing.value ?? myProfileData.email)} onChange={e => setEditing({ field: 'email', value: e.target.value })} />
                                                            <button className="btn btn-primary" onClick={() => {
                                                                setMyProfileData(prev => ({ ...prev, email: String(editing.value ?? prev.email) }));
                                                                setEditing({ field: null, value: null });
                                                            }}>Save</button>
                                                            <button className="btn btn-ghost" onClick={() => setEditing({ field: null, value: null })}>Cancel</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button className="edit-btn" aria-label="Edit email" onClick={() => setEditing({ field: 'email', value: myProfileData.email })}>✎</button>
                                                            <div className="value">{myProfileData.email}</div>
                                                        </>
                                                    )}
                                                </div>
                                        </div>
                                        <div className="field">
                                                <label>Phone Number</label>
                                                <div className="value-row">
                                                    {editing.field === 'phone' ? (
                                                        <>
                                                            <input className="value-input" value={String(editing.value ?? myProfileData.phone)} onChange={e => setEditing({ field: 'phone', value: e.target.value })} />
                                                            <button className="btn btn-primary" onClick={() => {
                                                                setMyProfileData(prev => ({ ...prev, phone: String(editing.value ?? prev.phone) }));
                                                                setEditing({ field: null, value: null });
                                                            }}>Save</button>
                                                            <button className="btn btn-ghost" onClick={() => setEditing({ field: null, value: null })}>Cancel</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button className="edit-btn" aria-label="Edit phone" onClick={() => setEditing({ field: 'phone', value: myProfileData.phone })}>✎</button>
                                                            <div className="value">{myProfileData.phone}</div>
                                                        </>
                                                    )}
                                                </div>
                                        </div>
                                </div>

                <div className="grid-row">
                    <div className="field field--full">
                        <label>Residential Address</label>
                        <div className="value">{myProfileData.address}</div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <hr style={{ margin: '20px 0', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid' }} />

            {/* Card Information Section */}
            <div className="myprofile-card__header">
                <div className="myprofile-card__icon">💳</div>
                <div>
                    <h3 className="myprofile-card__title">Card Information</h3>
                    <p className="myprofile-card__subtitle">Your card details</p>
                </div>
            </div>
            
            {myProfileData.ccNumber && (

                <div className="myprofile-card__body">
                    {!cardEditing ? (
                        <>
                            <div className="grid-row">
                                <div className="field field--full">
                                    <label>Card Number</label>
                                    <div className="value">{myProfileData.ccNumber}</div>
                                </div>
                            </div>

                            <div className="grid-row">
                                <div className="field">
                                    <label>Expiry Date</label>
                                    <div className="value">{myProfileData.ccExpiry}</div>
                                </div>
                                <div className="field">
                                    <label>CVV</label>
                                    <div className="value">{myProfileData.cvv}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: 10 }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        // Open form for editing: prefill expiry/cvv, ccNumber left blank (user must re-enter full card to replace)
                                        setCard({ ccNumber: '', ccExpiry: myProfileData.ccExpiry ?? '', cvv: myProfileData.cvv ?? '' });
                                        setCardEditing(true);
                                    }}
                                >
                                    Edit Card
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="card-form">
                            <div className="grid-row">
                                <div className="field field--full">
                                    <label>Card Number</label>
                                    <input
                                        className="value-input"
                                        placeholder="Enter full card number to replace"
                                        value={card.ccNumber}
                                        onChange={e => setCard(prev => ({ ...prev, ccNumber: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid-row">
                                <div className="field">
                                    <label>Expiry (MM/YY)</label>
                                    <input
                                        className="value-input"
                                        placeholder="MM/YY"
                                        value={card.ccExpiry}
                                        onChange={e => setCard(prev => ({ ...prev, ccExpiry: e.target.value }))}
                                    />
                                </div>
                                <div className="field">
                                    <label>CVV</label>
                                    <input
                                        className="value-input"
                                        placeholder="123"
                                        value={card.cvv}
                                        onChange={e => setCard(prev => ({ ...prev, cvv: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        const numRaw = String(card.ccNumber).replace(/\D/g, '');
                                        const expiry = String(card.ccExpiry);
                                        const cvv = String(card.cvv);

                                        // If user provided a new card number, validate it; otherwise keep existing masked number
                                        if (card.ccNumber) {
                                            if (!/^\d{13,19}$/.test(numRaw)) {
                                                alert('Please enter a valid card number (13-19 digits).');
                                                return;
                                            }
                                        }

                                        if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) {
                                            alert('Please enter expiry in MM/YY format.');
                                            return;
                                        }
                                        if (!/^\d{3,4}$/.test(cvv)) {
                                            alert('Please enter a valid CVV (3-4 digits).');
                                            return;
                                        }

                                        setMyProfileData(prev => ({
                                            ...prev,
                                            ccNumber: card.ccNumber ? maskCard(numRaw) : prev.ccNumber,
                                            ccExpiry: expiry,
                                            cvv,
                                        }));
                                        setCard({ ccNumber: '', ccExpiry: '', cvv: '' });
                                        setCardEditing(false);
                                    }}
                                >
                                    Save
                                </button>
                                <button className="btn btn-ghost" onClick={() => { setCard({ ccNumber: '', ccExpiry: '', cvv: '' }); setCardEditing(false); }}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/*If no card info, show add/edit form */}
            {!myProfileData.ccNumber && (
                <div className="myprofile-card__body">
                    {!cardEditing ? (
                        <>
                            <p>No card information available.</p>
                            <button className="btn btn-primary" onClick={() => { setCard({ ccNumber: '', ccExpiry: '', cvv: '' }); setCardEditing(true); }}>Add Card</button>
                        </>
                    ) : (
                        <div className="card-form">
                            <div className="grid-row">
                                <div className="field field--full">
                                    <label>Card Number</label>
                                    <input
                                        className="value-input"
                                        placeholder="4242 4242 4242 4242"
                                        value={card.ccNumber}
                                        onChange={e => setCard(prev => ({ ...prev, ccNumber: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid-row">
                                <div className="field">
                                    <label>Expiry (MM/YY)</label>
                                    <input
                                        className="value-input"
                                        placeholder="MM/YY"
                                        value={card.ccExpiry}
                                        onChange={e => setCard(prev => ({ ...prev, ccExpiry: e.target.value }))}
                                    />
                                </div>
                                <div className="field">
                                    <label>CVV</label>
                                    <input
                                        className="value-input"
                                        placeholder="123"
                                        value={card.cvv}
                                        onChange={e => setCard(prev => ({ ...prev, cvv: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        const num = String(card.ccNumber).replace(/\D/g, '');
                                        const expiry = String(card.ccExpiry);
                                        const cvv = String(card.cvv);

                                        if (!/^\d{13,19}$/.test(num)) {
                                            alert('Please enter a valid card number (13-19 digits).');
                                            return;
                                        }
                                        if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) {
                                            alert('Please enter expiry in MM/YY format.');
                                            return;
                                        }
                                        if (!/^\d{3,4}$/.test(cvv)) {
                                            alert('Please enter a valid CVV (3-4 digits).');
                                            return;
                                        }

                                        setMyProfileData(prev => ({ ...prev, ccNumber: maskCard(num), ccExpiry: expiry, cvv }));
                                        setCard({ ccNumber: '', ccExpiry: '', cvv: '' });
                                        setCardEditing(false);
                                    }}
                                >
                                    Save
                                </button>
                                <button className="btn btn-ghost" onClick={() => { setCard({ ccNumber: '', ccExpiry: '', cvv: '' }); setCardEditing(false); }}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}


        </section>
    );
};

export default MyProfile;