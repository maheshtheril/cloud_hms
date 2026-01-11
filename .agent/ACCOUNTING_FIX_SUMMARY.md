# Task Completed: Fix Accounting Discrepancy & Remove Settle Button

## Summary
1.  **Fixed Accounting Ledger Sync:**
    *   Previously, the `settlePatientDues` action marked invoices as 'paid' in the database but failed to post the corresponding Journal Entries because `postSalesInvoice` would exit early if the *Invoice* was already posted (accrual).
    *   Refactored `AccountingService.postSalesInvoice` to support "Payment Syncing". It now checks efficiently if specific payments (ref `PMT-{id}`) are missing from the ledger and creates them, even if the Accrual Journal exists.
    *   Updated `settlePatientDues` to call this new logic for every settled invoice.
    *   Added "Self-Healing" logic: If `settlePatientDues` is called with an amount but finds no open invoices (likely because they were marked 'paid' but not 'posted' in a previous failed run), it proactively scans recent 'paid' invoices for the patient and syncs their accounting.

2.  **Removed "Settle Now" Button (User Request):**
    *   The user found the separate settlement workflow confusing or "duplicating".
    *   Removed the button and dialog from `CompactInvoiceEditor`.
    *   Retained the "Previous Outstanding" display for informational purposes.
    *   This shifts the workflow to a "World Standard" model: The cashier sees the Total Due (Current + Previous) and collects the full payment on the current invoice. The system's backend (which creates Journal Entries) will naturally credit the patient's Accounts Receivable, reducing the global balance correctly.

## Files Modified
*   `src/lib/services/accounting.ts`: Refactored `postSalesInvoice`.
*   `src/app/actions/billing.ts`: Enhanced `settlePatientDues` (logic remains for API/future use, though button is hidden).
*   `src/components/billing/invoice-editor-compact.tsx`: Removed UI elements.

## Status
**Completed** and **Deployed**.
