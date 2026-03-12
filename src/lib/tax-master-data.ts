export interface MasterTaxRate {
    name: string;
    rate: number;
    type: string; // Internal type key
}

export interface CountryTaxMapping {
    countryIso2: string;
    taxNames: string[]; // Names from the rates list
}

export const MASTER_TAX_RATES: MasterTaxRate[] = [
    { name: 'GST 0%', rate: 0.0, type: 'GST_0' },
    { name: 'GST 5%', rate: 5.0, type: 'GST_5' },
    { name: 'GST 12%', rate: 12.0, type: 'GST_12' },
    { name: 'GST 18%', rate: 18.0, type: 'GST_18' },
    { name: 'GST 28%', rate: 28.0, type: 'GST_28' },
    { name: 'VAT 0%', rate: 0.0, type: 'VAT_0' },
    { name: 'VAT 5%', rate: 5.0, type: 'VAT_5' },
    { name: 'VAT 15%', rate: 15.0, type: 'VAT_15' },
];

export const COUNTRY_TAX_CONFIGS: CountryTaxMapping[] = [
    {
        countryIso2: 'IN',
        taxNames: ['GST 0%', 'GST 5%', 'GST 12%', 'GST 18%', 'GST 28%']
    },
    {
        countryIso2: 'AE', // UAE
        taxNames: ['VAT 0%', 'VAT 5%']
    },
    {
        countryIso2: 'SA', // Saudi
        taxNames: ['VAT 0%', 'VAT 15%']
    }
];

export const GLOBAL_DEFAULT_TAXES = ['GST 0%', 'GST 5%', 'GST 12%', 'GST 18%', 'GST 28%'];
