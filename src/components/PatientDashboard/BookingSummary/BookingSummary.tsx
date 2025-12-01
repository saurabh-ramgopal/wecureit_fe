import React from 'react'
import styles from './BookingSummary.module.scss'

const ConfirmAppointment: React.FC = () => {
  return (
    <div className={styles.confirmWrap}>
      <div className={styles.headerRow}>
        <button className={styles.backBtn}>← Back to Date &amp; Time</button>
        <h2 className={styles.title}>Confirm Appointment</h2>
        <p className={styles.subtitle}>Review your appointment details and confirm your booking</p>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.leftCol}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Appointment Details</h3>
            <p className={styles.cardNote}>Please review your appointment information</p>

            <div className={styles.detailBox}>
              <div className={styles.detailLabel}>Doctor</div>
              <div className={styles.detailValue}>
                <strong>Dr. Patricia Wong</strong>
                <span className={styles.tag}>Orthopedics</span>
              </div>
            </div>

            <div className={styles.detailBox}>
              <div className={styles.detailLabel}>Facility</div>
              <div className={styles.detailValue}>
                <strong>Alexandria Main Hospital</strong>
                <div className={styles.address}>789 King Street, Alexandria VA 22314</div>
              </div>
            </div>

            <div className={styles.rowTwoUp}>
              <div className={styles.smallBox}>
                <div className={styles.detailLabel}>Date</div>
                <div className={styles.smallValue}>Monday, December 1, 2025</div>
              </div>
              <div className={styles.smallBox}>
                <div className={styles.detailLabel}>Time</div>
                <div className={styles.smallValue}>2:30 PM<br/><span className={styles.muted}>15 minutes</span></div>
              </div>
            </div>
          </section>

          {/* <section className={styles.card + ' ' + styles.paymentCard}>
            <h3 className={styles.cardTitle}>Payment Method</h3>
            <p className={styles.cardNote}>Payment will be collected at the facility</p>

            <div className={styles.noCardBox}>
              <div className={styles.noCardIcon}>💳</div>
              <div className={styles.noCardText}>No card saved</div>
              <button className={styles.addCardBtn}>Add Card</button>
            </div>
          </section> */}
        </div>

        <aside className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}><span className={styles.dollarIcon}>$</span> Cost Summary</div>

            {/* <div className={styles.alertBox}>
              <span className={styles.alertIcon}>!</span>
              <div>Please add a payment card to complete your booking.</div>
            </div> */}

            <div className={styles.totalsList}>
              <div className={styles.row}><div>Consultation Fee (15 min)</div><div>$75.00</div></div>
              <div className={styles.row}><div>Facility Fee</div><div>$25.00</div></div>
              <div className={styles.hr} />
              <div className={styles.row}><div>Subtotal</div><div>$100.00</div></div>
              <div className={styles.row}><div>Tax (8%)</div><div>$8.00</div></div>
              <div className={styles.hr} />
              <div className={styles.totalRow}><div>Total Amount</div><div className={styles.totalAmount}>$108.00</div></div>
            </div>

            <button className={styles.bookBtn}>Book Appointment</button>

            <p className={styles.terms}>By confirming, you agree to our terms and conditions.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ConfirmAppointment
