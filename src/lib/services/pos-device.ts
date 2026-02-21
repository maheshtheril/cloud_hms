/**
 * POS Device Service - Plug-n-Play Integration
 * Supports PineLabs Plutus Smart API over HTTP (Localhost)
 */

export type POSStatus = 'connected' | 'offline' | 'searching' | 'unsupported';

export interface POSTransactionRequest {
    amount: number;
    invoiceId: string;
    method?: 'CARD' | 'UPI' | 'QR';
}

export interface POSTransactionResponse {
    success: boolean;
    error?: string;
    reference?: string;
    amount?: number;
    rawResponse?: any;
}

class POSDeviceService {
    private baseUrl: string = 'http://localhost:8080'; // Default PineLabs Port
    private fallbackUrl: string = 'http://localhost:8082';
    private activeUrl: string | null = null;
    private status: POSStatus = 'searching';

    constructor() {
        if (typeof window !== 'undefined') {
            this.autoDiscover();
        }
    }

    private async autoDiscover() {
        const ports = [8080, 8082, 12345]; // Common POS Controller ports
        for (const port of ports) {
            try {
                const url = `http://localhost:${port}`;
                const res = await fetch(`${url}/web/status`, { method: 'GET', signal: AbortSignal.timeout(1000) });
                if (res.ok) {
                    this.activeUrl = url;
                    this.status = 'connected';
                    console.log(`[POS] Device Controller detected at ${url}`);
                    return;
                }
            } catch (e) {
                // Port offline
            }
        }
        this.status = 'offline';
        console.log('[POS] No local device controller detected.');
    }

    public getStatus(): POSStatus {
        return this.status;
    }

    /**
     * Initiates a payment on the physical device.
     * Uses the Plutus Smart API CSV/JSON format.
     */
    public async initiatePayment(req: POSTransactionRequest): Promise<POSTransactionResponse> {
        if (!this.activeUrl) {
            await this.autoDiscover();
            if (!this.activeUrl) {
                return { success: false, error: 'POS Controller not found on localhost' };
            }
        }

        try {
            // PineLabs Sample Request Format (Aggregator/Standalone)
            const payload = {
                transaction_type: 4001, // Sale
                amount: Math.round(req.amount * 100), // In Paisa
                billing_ref_no: req.invoiceId,
                payment_mode: req.method === 'CARD' ? 1 : 14, // 1=Card, 14=UPI/QR
            };

            const response = await fetch(`${this.activeUrl}/web/doTransaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.status === 'success' || data.response_code === '00') {
                return {
                    success: true,
                    reference: data.approval_code || data.retrieval_ref_no,
                    amount: req.amount,
                    rawResponse: data
                };
            }

            return {
                success: false,
                error: data.message || 'Transaction Failed on Device',
                rawResponse: data
            };

        } catch (err: any) {
            console.error('[POS] Transaction Error:', err);
            return { success: false, error: 'Communication error with local POS controller' };
        }
    }
}

export const posService = new POSDeviceService();
