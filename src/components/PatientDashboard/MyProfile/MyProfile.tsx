import React, { useEffect, useState } from 'react';
import './MyProfile.scss';

const MyProfile: React.FC = () => {
    const [myProfileData, setMyProfileData] = useState({
        name: 'John Doe',
        email: 'john.doe@email.com',
        dateOfBirth: 'June 14, 1985',
        phone: '(555) 123-4567',
        gender: 'Male',
        address: '123 Main St, Springfield, USA',
        ccNumber: '',
        ccExpiry: '**/**',
        cvv: '***',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const getPatientId = async (): Promise<string | null> => {
        // 1) quick-local check (set this at login)
        const fromStorage = window.localStorage.getItem('patientId');
        if (fromStorage) return fromStorage;

    
        try {
          const { getAuth } = await import('firebase/auth');
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const token = await user.getIdTokenResult();
            // assuming backend set `patientMasterId` as a custom claim
            const claimId = token.claims.patientMasterId;
            if (claimId) return String(claimId);
          }
        } catch (e) {
          // ignore if firebase isn't configured here; fallback remains localStorage
        }

        return null;
    };

    const updatePatient = async (patchBody: Record<string, unknown>) => {
        const patientId = await getPatientId();
        if (!patientId) throw new Error('No patient id found in session.');
        const apiBase = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080').replace(/\/$/, '');
        const res = await fetch(`${apiBase}/patient/${encodeURIComponent(patientId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(patchBody),
        });
        if (!res.ok) {
            const body = await res.text().catch(() => '<no-body>');
            throw new Error(`Update failed ${res.status}: ${body}`);
        }
        return res.json();
    };

    const updateCard = async (card: {
        ccNumber: string;
        ccExpiry: string; // MM/YY
        cvv: string;
        }) => {
        const patientId = await getPatientId();
        if (!patientId) throw new Error('No patient id found in session.');

        const [mm, yy] = card.ccExpiry.split('/');

        const payload = {
            pan: card.ccNumber.replace(/\D/g, ''),
            cvc: card.cvv,
            expMonth: Number(mm),
            expYear: 2000 + Number(yy),
            patientMasterId: Number(patientId),
        };

        const apiBase = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080').replace(/\/$/, '');

        const res = await fetch(`${apiBase}/cards/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const msg = await res.text();
            throw new Error(`Card save failed: ${msg}`);
        }

        return res.json();
    };



    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const patientId = await getPatientId();
                if (!patientId) {
                    setError('No patient id found in session.');
                    setLoading(false);
                    return;
                }

                // prefer an explicit API base set via .env.local: NEXT_PUBLIC_API_BASE
                // (must start with NEXT_PUBLIC_ to be accessible in the browser)
                const apiBase = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080').replace(/\/$/, '');
                const url = `${apiBase}/patient/getById?patientId=${encodeURIComponent(patientId)}`;
                
                const res = await fetch(url, { credentials: 'include' });
                
                if (!res.ok) {
                    // attempt to capture body for debugging
                    throw new Error(`Server returned ${res.status}`);
                }
                const data = await res.json();

                // Fetch card info separately
                const cardUrl = `${apiBase}/cards/getcards?patientId=${encodeURIComponent(patientId)}`;
                const cardRes =  await fetch (cardUrl, { credentials: 'include'});

                if (!cardRes.ok) {
                    throw new Error(`Server returned ${cardRes.status}`);
                }
                const cardData = await cardRes.json();
                
                // console.log('Fetched patient profile data:', cardData[0]);
                // Map backend fields to our local state shape
                const mapped = {
                    name: data.patientName ?? myProfileData.name,
                    email: data.patientEmail ?? myProfileData.email,
                    dateOfBirth: data.patientDob ?? myProfileData.dateOfBirth,
                    gender: data.patientGender ?? myProfileData.gender,
                    phone: data.patientPhone ?? myProfileData.phone,
                    address: data.patientAddress ?? myProfileData.address,
                    ccNumber: cardData[0] ?? myProfileData.ccNumber,
                    ccExpiry: cardData.ccExpiry ?? myProfileData.ccExpiry,
                    cvv: cardData.cvv ?? myProfileData.cvv,
                };

                if (mounted) setMyProfileData(prev => ({ ...prev, ...mapped }));
            } catch (err: unknown) {
                console.error('Failed loading patient profile', err);
                if (mounted) setError((err as Error)?.message ?? String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [editing, setEditing] = useState<{ field: 'email' | 'phone' | null, value: string | null }>({ field: null, value: null });
    const [card, setCard] = useState({
        ccNumber: '',
        ccExpiry: '',
        cvv: '',
    });
    const [cardEditing, setCardEditing] = useState(false);

    // const maskCard = (num: string) => {
    //     const cleaned = String(num).replace(/\D/g, '');
    //     if (!cleaned) return '';
    //     return '**** **** **** ' + cleaned.slice(-4);
    // };

    return (
        <section className="myprofile-card">
            {loading && <div className="myprofile-loading">Loading profile…</div>}
            {error && <div className="myprofile-error" role="alert">{error}</div>}

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
                                                            <button className="btn btn-primary" onClick={async () => {
                                                                try {
                                                                    setLoading(true);
                                                                    const newVal = String(editing.value ?? myProfileData.email);
                                                                    // PATCH may accept partial body with only email
                                                                    const updated = await updatePatient({ email: newVal });
                                                                    // backend may echo updated fields; fallback to newVal
                                                                    setMyProfileData(prev => ({ ...prev, email: updated.patientEmail ?? newVal }));
                                                                    setEditing({ field: null, value: null });
                                                                } catch (err: unknown) {
                                                                    console.error('Failed to update email', err);
                                                                    setError((err as Error)?.message ?? String(err));
                                                                } finally {
                                                                    setLoading(false);
                                                                }
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
                                                            <button className="btn btn-primary" onClick={async () => {
                                                                try {
                                                                    setLoading(true);
                                                                    const newVal = String(editing.value ?? myProfileData.phone);
                                                                    const updated = await updatePatient({ phone: newVal });
                                                                    setMyProfileData(prev => ({ ...prev, phone: updated.patientPhone ?? newVal }));
                                                                    setEditing({ field: null, value: null });
                                                                } catch (err: unknown) {
                                                                    console.error('Failed to update phone', err);
                                                                    setError((err as Error)?.message ?? String(err));
                                                                } finally {
                                                                    setLoading(false);
                                                                }
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
                    <div className="grid-row">
                        <div className="field field--full">
                            <label>Card Number</label>
                            <div className="value">**** **** **** {myProfileData.ccNumber}</div>
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
                            className="btn btn-danger"
                            onClick={async () => {
                                setLoading(true);
                                setError(null);
                                try {
                                    const apiBase = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080').replace(/\/$/, '');
                                    const patientId = await getPatientId();
                                    console.log('Deleting card for patientId:', patientId);
                                    if (patientId) {
                                        // backend expects a query param delete call: /cards/delete?patientId=...
                                        // send patientId as a query parameter so Spring's @RequestParam can find it
                                        const delUrl = `${apiBase}/cards/delete?patientId=${encodeURIComponent(patientId)}`;
                                        const delRes = await fetch(delUrl, {
                                            method: 'PATCH',
                                            credentials: 'include',
                                        });

                                        if (!delRes.ok) {
                                            const bodyText = await delRes.text().catch(() => '<no-body>');
                                            console.error('cards/delete failed', { status: delRes.status, body: bodyText });
                                            throw new Error(`Delete failed ${delRes.status}: ${bodyText}`);
                                        }
                                    }
                                } catch (err) {
                                    console.error('Delete card failed', err);
                                    setError((err as Error)?.message ?? String(err));
                                } finally {
                                    setLoading(false);
                                    // clear locally regardless of backend result
                                    setMyProfileData(prev => ({ ...prev, ccNumber: '', ccExpiry: '**/**', cvv: '***' }));
                                    setCard({ ccNumber: '', ccExpiry: '', cvv: '' });
                                    setCardEditing(false);
                                }
                            }}
                        >
                            Delete Card
                        </button>
                    </div>
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
                                    onClick={async () => {
                                        setError(null);
                                        setLoading(true);
                                        try {
                                            const num = String(card.ccNumber).replace(/\D/g, '');
                                            const expiry = String(card.ccExpiry);
                                            const cvv = String(card.cvv);

                                            if (!/^\d{13,19}$/.test(num)) {
                                                alert('Please enter a valid card number (13-19 digits).');
                                                setLoading(false);
                                                return;
                                            }
                                            if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) {
                                                alert('Please enter expiry in MM/YY format.');
                                                setLoading(false);
                                                return;
                                            }
                                            if (!/^\d{3,4}$/.test(cvv)) {
                                                alert('Please enter a valid CVV (3-4 digits).');
                                                setLoading(false);
                                                return;
                                            }

                                            // call backend add card endpoint
                                            await updateCard({ ccNumber: card.ccNumber, ccExpiry: card.ccExpiry, cvv: card.cvv });

                                            const last4 = num.slice(-4);
                                            setMyProfileData(prev => ({ ...prev, ccNumber: last4, ccExpiry: expiry, cvv: '***' }));
                                            setCard({ ccNumber: '', ccExpiry: '**/**', cvv: '***' });
                                            setCardEditing(false);
                                        } catch (err) {
                                            console.error('Add card failed', err);
                                            setError((err as Error)?.message ?? String(err));
                                        } finally {
                                            setLoading(false);
                                        }
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